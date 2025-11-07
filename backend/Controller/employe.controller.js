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

// 🔹 LOGIN FUNCTION (same as before)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employedata = await Employe.findOne({ email, password });

    if (employedata) {
      return res.status(200).json({
        message: "Login Successful",
        employe: employedata,
      });
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
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// 🔹 ADD EMPLOYEE API (frontend: /api/addEmploye)
export const addEmploye = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      employeId,
      department,
      project,
      dateOfJoining,
    } = req.body;

    // Generate employeId if not provided
    if (!employeId) {
      employeId = await generateEmployeeId();
    }

    // Generate a random password for new employees
    const password = generatePassword();

    const newEmploye = new Employe({
      firstName,
      lastName,
      employeId,
      department,
      project,
      dateOfJoining,
      password, // auto-generated password
    });

    await newEmploye.save();

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employe: newEmploye,
    });
  } catch (error) {
    console.error("Error in addEmploye:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 🔹 GET ALL EMPLOYEES
export const employes = async (req, res) => {
  try {
    const employes = await Employe.find();
    return res.status(200).json(employes);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 UPDATE EMPLOYEE
export const updateEmploye = async (req, res) => {
  try {
    const employeId = req.params.id;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const updatedEmploye = await Employe.findOneAndUpdate(
      { _id: employeId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmploye) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employe: updatedEmploye,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 DELETE EMPLOYEE
export const deleteEmploye = async (req, res) => {
  try {
    const employeId = req.params.id;
    const deletedEmploye = await Employe.findOneAndDelete({ _id: employeId });

    if (!deletedEmploye) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
