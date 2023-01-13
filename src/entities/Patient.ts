import mongoose from "mongoose";
import { IPatient } from "../interfaces/patient";

const patientsSchema = new mongoose.Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientsSchema);

export default Patient;
