const User = require("../models/User");

// ===================================================
// GET ALL EMPLOYEES (Admin Only)
// ===================================================
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: { $ne: "Admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error("Get All Employees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching employees",
    });
  }
};

// ===================================================
// GET EXECUTIVES LIST (For Dropdown Assignment)
// ===================================================
exports.getExecutives = async (req, res) => {
  try {
    const executives = await User.find({
      role: { $in: ["Executive", "Sales"] },
      isActive: true,
    })
      .select("name employeeId email username role")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: executives,
    });
  } catch (error) {
    console.error("Get Executives Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching executives",
    });
  }
};

// ===================================================
// CREATE EMPLOYEE (Admin Only)
// ===================================================
exports.createEmployee = async (req, res) => {
  try {
    const { name, username, email, phone, role, department, password } = req.body;

    if (!name || !username || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, Username, Email, and Role are required",
      });
    }

    // Change 2: Password Length Validation
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be minimum 6 characters",
      });
    }

    // Check existing email or username
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this Email or Username already exists",
      });
    }

    // Change 5: Phone Duplicate Check
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    // Change 1: Robust Employee ID Generation (Avoids Duplicate IDs after Deletion)
    const lastEmployee = await User.findOne({
      employeeId: { $exists: true }
    }).sort({ createdAt: -1 });

    let employeeId = "EMP001";
    if (lastEmployee && lastEmployee.employeeId) {
      const lastNumber = parseInt(
        lastEmployee.employeeId.replace("EMP", ""),
        10
      );
      if (!isNaN(lastNumber)) {
        employeeId = `EMP${String(lastNumber + 1).padStart(3, "0")}`;
      }
    }

    const tempPassword = password || "Temp@123";

    const newEmployee = await User.create({
      name,
      employeeId,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone: phone || "",
      role,
      department: department || "",
      password: tempPassword,
      isFirstLogin: true,
      isActive: true,
    });

    const createdEmployee = newEmployee.toObject();
    delete createdEmployee.password;

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: createdEmployee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating employee",
    });
  }
};

// ===================================================
// UPDATE EMPLOYEE DETAILS (Admin Only)
// ===================================================
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, department, isActive } = req.body;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Change 4: Duplicate Email Check on Update
    if (email) {
      const duplicateEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id }
      });

      if (duplicateEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another user",
        });
      }
      employee.email = email.toLowerCase();
    }

    if (name) employee.name = name;
    if (phone !== undefined) employee.phone = phone;
    if (role) employee.role = role;
    if (department !== undefined) employee.department = department;
    if (isActive !== undefined) employee.isActive = isActive;

    await employee.save();

    const updatedEmployee = employee.toObject();
    delete updatedEmployee.password;

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating employee",
    });
  }
};

// ===================================================
// TOGGLE ACTIVE / INACTIVE STATUS (Admin Only)
// ===================================================
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Protect Admin from Deactivation
    if (employee.role === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account status cannot be changed",
      });
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: `Employee account ${employee.isActive ? "activated" : "deactivated"} successfully`,
      isActive: employee.isActive,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while changing employee status",
    });
  }
};

// ===================================================
// RESET EMPLOYEE PASSWORD (Admin Only)
// ===================================================
exports.resetEmployeePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Change 2: Password Length Validation on Reset
    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be minimum 6 characters",
      });
    }

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.password = newPassword || "Temp@123";
    employee.isFirstLogin = true;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee password reset successfully. User will be prompted to change it on next login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};

// ===================================================
// DELETE EMPLOYEE (Admin Only)
// ===================================================
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Change 3: Protect Admin from Deletion
    if (employee.role === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting employee",
    });
  }
};