import mongoose from "mongoose";

const employeSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
//   email: { type: String, default: "" }, // was required before
  password: { type: String, default: "" },
  employeId: { type: String, required: true, unique: true },
  department: { type: String, default: "" },
  project: { type: String, default: "" }, // ✅ added
  dateOfJoining: { type: String, default: "" }, // ✅ added
});

const Employe = mongoose.model("Employe", employeSchema);
export default Employe;
