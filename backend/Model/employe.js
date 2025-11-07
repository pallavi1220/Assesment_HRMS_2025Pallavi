import mongoose from "mongoose";

const employeSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
 email: { type: String },
  password: { type: String, default: "" },
  employeId: { type: String, required: true, unique: true },
  department: { type: String, default: "" },
  project: { type: String, default: "" }, // 
  dateOfJoining: { type: String, default: "" }, // 
});

const Employe = mongoose.model("Employe", employeSchema);
export default Employe;
