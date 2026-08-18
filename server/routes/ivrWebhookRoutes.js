const express = require("express");

const router = express.Router();

const Call = require("../models/Call");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const IVRConfig = require("../models/IVRConfig");


// =========================================
// INCOMING CALL WEBHOOK
// =========================================

router.post("/incoming", async (req, res) => {
  try {
    const {
      customerNumber,
      phone,
      from,
      callerNumber,
      providerCallId,
      callId,
      status,
      provider,
      ivrNumber,
    } = req.body;


    // =====================================
    // GET CUSTOMER NUMBER
    // Different providers may send
    // different field names
    // =====================================

    const incomingNumber =
      customerNumber ||
      phone ||
      from ||
      callerNumber;


    if (!incomingNumber) {
      return res.status(400).json({
        success: false,
        message: "Customer number not received",
      });
    }


    // =====================================
    // GET IVR CONFIG
    // =====================================

    const config = await IVRConfig.findOne()
      .populate(
        "selectedExecutives",
        "name role department isActive"
      );


    let assignedExecutive = null;


    // =====================================
    // GET ACTIVE EXECUTIVES
    // =====================================

    if (
      config &&
      config.isConnected &&
      config.selectedExecutives?.length > 0
    ) {
      const activeExecutives =
        config.selectedExecutives.filter(
          (employee) =>
            employee &&
            employee.isActive !== false
        );


      // ===================================
      // ROUND ROBIN
      // ===================================

      if (activeExecutives.length > 0) {

        if (
          config.routingMode === "Round Robin"
        ) {

          const lastCall =
            await Call.findOne({
              assignedExecutive: {
                $in: activeExecutives.map(
                  (employee) => employee._id
                ),
              },
            }).sort({
              createdAt: -1,
            });


          if (!lastCall) {

            assignedExecutive =
              activeExecutives[0]._id;

          } else {

            const lastIndex =
              activeExecutives.findIndex(
                (employee) =>
                  employee._id.toString() ===
                  lastCall.assignedExecutive
                    .toString()
              );


            const nextIndex =
              lastIndex === -1
                ? 0
                : (lastIndex + 1) %
                  activeExecutives.length;


            assignedExecutive =
              activeExecutives[nextIndex]._id;
          }

        } else {

          // Default assignment
          assignedExecutive =
            activeExecutives[0]._id;
        }
      }
    }


    // =====================================
    // CHECK LEAD
    // =====================================

    const lead = await Lead.findOne({
      phone: incomingNumber,
    });


    // =====================================
    // CHECK CUSTOMER
    // =====================================

    const customer =
      await Customer.findOne({
        phone: incomingNumber,
      });


    // =====================================
    // PREVENT DUPLICATE CALL
    // =====================================

    const uniqueCallId =
      providerCallId || callId || "";

    if (uniqueCallId) {

      const existingCall =
        await Call.findOne({
          providerCallId: uniqueCallId,
        });

      if (existingCall) {

        return res.status(200).json({
          success: true,
          message:
            "Call already exists",
          call: existingCall,
        });
      }
    }


    // =====================================
    // CREATE CALL RECORD
    // =====================================

    const call = await Call.create({
      customerNumber: incomingNumber,

      provider:
        provider ||
        config?.provider ||
        "",

      ivrNumber:
        ivrNumber ||
        config?.ivrNumber ||
        "",

      providerCallId:
        uniqueCallId,

      assignedExecutive,

      lead:
        lead?._id || null,

      customer:
        customer?._id || null,

      status:
        status || "Ringing",

      direction: "Incoming",

      startedAt: new Date(),
    });


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
        "Incoming IVR call received",

      assignedExecutive:
        populatedCall.assignedExecutive,

      call:
        populatedCall,
    });

  } catch (error) {

    console.error(
      "IVR Incoming Webhook Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to process incoming call",

      error:
        error.message,
    });
  }
});


// =========================================
// CALL STATUS WEBHOOK
// =========================================

router.post("/status", async (req, res) => {
  try {
    const {
      providerCallId,
      callId,
      status,
      answeredAt,
      endedAt,
      duration,
      recordingUrl,
    } = req.body;


    const uniqueCallId =
      providerCallId || callId;


    if (!uniqueCallId) {
      return res.status(400).json({
        success: false,
        message: "Call ID is required",
      });
    }


    const call =
      await Call.findOne({
        providerCallId: uniqueCallId,
      });


    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }


    if (status !== undefined) {
      call.status = status;
    }

    if (answeredAt !== undefined) {
      call.answeredAt = answeredAt;
    }

    if (endedAt !== undefined) {
      call.endedAt = endedAt;
    }

    if (duration !== undefined) {
      call.duration = Number(duration);
    }

    if (recordingUrl !== undefined) {
      call.recordingUrl = recordingUrl;
    }


    // Auto calculate duration

    if (
      call.startedAt &&
      call.endedAt &&
      duration === undefined
    ) {
      const difference =
        new Date(call.endedAt).getTime() -
        new Date(call.startedAt).getTime();

      call.duration =
        Math.max(
          0,
          Math.floor(difference / 1000)
        );
    }


    await call.save();


    res.status(200).json({
      success: true,
      message:
        "Call status updated successfully",
      call,
    });

  } catch (error) {

    console.error(
      "IVR Status Webhook Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update call status",
      error: error.message,
    });
  }
});


module.exports = router;