import mongoose from "mongoose";

const employeSchema = new mongoose.Schema({
   
firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    
  },
  password: {
    type: String,
    required: true
  },
  
  employeId: {
    type: String,
    required: true,
    unique: true
  },
  
  department: {
    type: String,
    required: true,
    trim: true,
  },
  project: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
 
  

  
});

const Employe = mongoose.model("Employe", employeSchema);
export default Employe;
