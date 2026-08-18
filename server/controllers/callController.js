const Call = require("../models/Call");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const IVRConfig = require("../models/IVRConfig");


// =========================================
// GET ALL CALLS
// =========================================

const getCalls = async (req, res) => {
  try {
    const calls = await Call.find()
      .populate(
        "assignedExecutive",
        "name role department"
      )
      .populate(
        "lead",
        "name phone"
      )
      .populate(
        "customer",
        "name phone"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      calls,
    });

  } catch (error) {
    console.error(
      "Get Calls Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch call history",
    });
  }
};


// =========================================
// CREATE INCOMING CALL
// IVR WEBHOOK WILL USE THIS
// =========================================

const createIncomingCall = async (
  req,
  res
) => {
  try {
    const {
      customerNumber,
      provider,
      ivrNumber,
      providerCallId,
      status,
    } = req.body;

    // =====================================
    // VALIDATE CUSTOMER NUMBER
    // =====================================

    if (!customerNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Customer number is required",
      });
    }


    // =====================================
    // GET IVR CONFIGURATION
    // =====================================

    const config =
      await IVRConfig.findOne()
        .populate(
          "selectedExecutives",
          "name role department isActive"
        );


    let assignedExecutive = null;


    // =====================================
    // CHECK IVR CONFIGURATION
    // =====================================

    if (
      config &&
      config.isConnected &&
      config.selectedExecutives &&
      config.selectedExecutives.length > 0
    ) {

      // ===================================
      // GET ACTIVE EXECUTIVES
      // ===================================

      const activeExecutives =
        config.selectedExecutives.filter(
          (employee) =>
            employee &&
            employee.isActive !== false
        );


      if (activeExecutives.length > 0) {

        // =================================
        // ROUND ROBIN ROUTING
        // =================================

        if (
          config.routingMode ===
          "Round Robin"
        ) {

          // FIND LAST ASSIGNED CALL

          const lastCall =
            await Call.findOne({
              assignedExecutive: {
                $in: activeExecutives.map(
                  (employee) =>
                    employee._id
                ),
              },
            })
              .sort({
                createdAt: -1,
              });


          // FIRST CALL

          if (
            !lastCall ||
            !lastCall.assignedExecutive
          ) {

            assignedExecutive =
              activeExecutives[0]._id;

          } else {

            // FIND LAST EXECUTIVE INDEX

            const lastExecutiveIndex =
              activeExecutives.findIndex(
                (employee) =>
                  employee._id
                    .toString() ===
                  lastCall
                    .assignedExecutive
                    .toString()
              );


            // IF LAST EXECUTIVE NOT FOUND

            if (
              lastExecutiveIndex === -1
            ) {

              assignedExecutive =
                activeExecutives[0]._id;

            } else {

              // SELECT NEXT EXECUTIVE

              const nextIndex =
                (lastExecutiveIndex + 1) %
                activeExecutives.length;

              assignedExecutive =
                activeExecutives[
                  nextIndex
                ]._id;
            }
          }
        }


        // =================================
        // SIMULTANEOUS RING
        // =================================
        // Actual IVR provider integration
        // will ring all executives.
        // For CRM record, first executive
        // is temporarily stored.

        else if (
          config.routingMode ===
          "Simultaneous Ring"
        ) {

          assignedExecutive =
            activeExecutives[0]._id;
        }


        // =================================
        // DEPARTMENT WISE
        // =================================
        // Provider/webhook can later send
        // department information.

        else if (
          config.routingMode ===
          "Department Wise"
        ) {

          assignedExecutive =
            activeExecutives[0]._id;
        }


        // =================================
        // DEFAULT ASSIGNMENT
        // =================================

        else {

          assignedExecutive =
            activeExecutives[0]._id;
        }
      }
    }


    // =====================================
    // CHECK EXISTING LEAD
    // =====================================

    const lead =
      await Lead.findOne({
        phone: customerNumber,
      });


    // =====================================
    // CHECK EXISTING CUSTOMER
    // =====================================

    const customer =
      await Customer.findOne({
        phone: customerNumber,
      });


    // =====================================
    // CREATE CALL RECORD
    // =====================================

    const call = await Call.create({

      customerNumber,

      provider:
        provider ||
        config?.provider ||
        "",

      ivrNumber:
        ivrNumber ||
        config?.ivrNumber ||
        "",

      providerCallId:
        providerCallId || "",

      assignedExecutive,

      lead:
        lead?._id || null,

      customer:
        customer?._id || null,

      status:
        status || "Ringing",

      direction: "Incoming",

      startedAt:
        new Date(),
    });


    // =====================================
    // GET POPULATED CALL DATA
    // =====================================

    const populatedCall =
      await Call.findById(call._id)
        .populate(
          "assignedExecutive",
          "name role department"
        )
        .populate(
          "lead",
          "name phone"
        )
        .populate(
          "customer",
          "name phone"
        );


    res.status(201).json({
      success: true,

      message:
        "Incoming call created successfully",

      assignedExecutive:
        populatedCall.assignedExecutive,

      call:
        populatedCall,
    });

  } catch (error) {

    console.error(
      "Create Incoming Call Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to create incoming call",

      error:
        error.message,
    });
  }
};


// =========================================
// UPDATE CALL STATUS
// IVR WEBHOOK WILL UPDATE THIS
// =========================================

const updateCall = async (
  req,
  res
) => {
  try {

    const {
      status,
      answeredAt,
      endedAt,
      duration,
      recordingUrl,
      notes,
      assignedExecutive,
    } = req.body;


    const call =
      await Call.findById(
        req.params.id
      );


    if (!call) {
      return res.status(404).json({
        success: false,
        message:
          "Call record not found",
      });
    }


    // =====================================
    // UPDATE CALL STATUS
    // =====================================

    if (status !== undefined) {
      call.status = status;
    }


    if (answeredAt !== undefined) {
      call.answeredAt =
        answeredAt;
    }


    if (endedAt !== undefined) {
      call.endedAt =
        endedAt;
    }


    if (duration !== undefined) {
      call.duration =
        duration;
    }


    if (recordingUrl !== undefined) {
      call.recordingUrl =
        recordingUrl;
    }


    if (notes !== undefined) {
      call.notes =
        notes;
    }


    if (
      assignedExecutive !== undefined
    ) {
      call.assignedExecutive =
        assignedExecutive;
    }


    // =====================================
    // AUTO CALCULATE DURATION
    // =====================================

    if (
      call.startedAt &&
      call.endedAt &&
      duration === undefined
    ) {

      const difference =
        new Date(
          call.endedAt
        ).getTime() -
        new Date(
          call.startedAt
        ).getTime();


      call.duration =
        Math.max(
          0,
          Math.floor(
            difference / 1000
          )
        );
    }


    await call.save();


    // =====================================
    // GET UPDATED CALL
    // =====================================

    const updatedCall =
      await Call.findById(call._id)
        .populate(
          "assignedExecutive",
          "name role department"
        )
        .populate(
          "lead",
          "name phone"
        )
        .populate(
          "customer",
          "name phone"
        );


    res.status(200).json({
      success: true,

      message:
        "Call updated successfully",

      call:
        updatedCall,
    });

  } catch (error) {

    console.error(
      "Update Call Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to update call",

      error:
        error.message,
    });
  }
};


// =========================================
// GET SINGLE CALL
// =========================================

const getCallById = async (
  req,
  res
) => {
  try {

    const call =
      await Call.findById(
        req.params.id
      )
        .populate(
          "assignedExecutive",
          "name role department"
        )
        .populate(
          "lead",
          "name phone"
        )
        .populate(
          "customer",
          "name phone"
        );


    if (!call) {
      return res.status(404).json({
        success: false,

        message:
          "Call record not found",
      });
    }


    res.status(200).json({
      success: true,
      call,
    });

  } catch (error) {

    console.error(
      "Get Call Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch call details",

      error:
        error.message,
    });
  }
};


// =========================================
// EXPORT CONTROLLER FUNCTIONS
// =========================================

module.exports = {
  getCalls,
  getCallById,
  createIncomingCall,
  updateCall,
};