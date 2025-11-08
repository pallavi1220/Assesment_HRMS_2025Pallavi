import e from "express";
import Employe from "../Model/employe.js";

// Generate random 6-digit password
function generatePassword() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate employee ID like EMP_001, EMP_002, ...
async function generateEmployeeId() {
  const lastEmployee = await Employe.findOne().sort({ _id: -1 });
  let nextNumber = 1;
  if (lastEmployee) {
    const lastId = lastEmployee.employeId;
    const lastNum = parseInt(lastId.split("_")[1]);
    nextNumber = lastNum + 1;
  }
  return `EMP_${String(nextNumber).padStart(3, "0")}`;
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employedata = await Employe.findOne({
      email: email,
      password: password,
    });
    if (employedata) {
      return res
        .status(200)
        .json({ message: "Login Successful", employe: employedata });
    } else {
      const randomPassword = generatePassword();
      const newEmployeeId = await generateEmployeeId();
      const newEmploye = new Employe({
        email,
        password: randomPassword,
        employeId: newEmployeeId,
        firstName: "",
        lastName: "",
        department: "",
      });
      await newEmploye.save();

      return res.status(200).send({
        message: "Login Successful",
        employe: newEmploye,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const addEmploye = async (req, res) => {
  try {
    let { firstName, lastName, password, employeId, department, project, dateOfJoining } = req.body;

    // Auto-generate Employee ID if not provided
    if (!employeId) {
      employeId = await generateEmployeeId();
    }

    // Check if employeId already exists
    const existingEmploye = await Employe.findOne({ employeId });
    if (existingEmploye) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    const newEmploye = new Employe({
      firstName,
      lastName,
      password,
      employeId,
      department,
      project,
      dateOfJoining,
    });

    await newEmploye.save();

    return res.status(201).json({
      message: "Employee Created Successfully",
      employe: newEmploye,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const signup= async (req, res) => {
  try {
    const { firstName, lastName, email, password, department } = req.body;

    const existingEmploye = await Employe.findOne({ email: email });
    if (existingEmploye) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newEmployeeId = await generateEmployeeId();

    const newEmploye = new Employe({
      firstName,
      lastName,
      email,
      password,
      employeId: newEmployeeId,
      department,
    });

    await newEmploye.save();

    return res
      .status(201)
      .json({ message: "Signup Successful", employe: newEmploye });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const employes= async (req, res) => {
  try {
    const employes = await Employe.find();
    return res.status(200).json(employes);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEmploye= async (req, res) => {
  try {
    const employeId = req.params.id; // e.g., EMP_001
    const updateData = req.body;

    // Check if request body is empty
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    // Update employee by employeId (not Mongo _id)
    const updatedEmploye = await Employe.findOneAndUpdate(
      { _id:employeId }, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedEmploye) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employe: updatedEmploye
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEmploye= async (req, res) => {
  try {
    const employeId = req.params.id; 

    // Delete employee by employeId (Mongo _id)
    const deletedEmploye = await Employe.findOneAndDelete({ _id:employeId });

    if (!deletedEmploye) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};