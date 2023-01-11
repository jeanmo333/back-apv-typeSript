import mongoose from "mongoose";
import generarId from "../helpers/generarId";
import { IUser } from "../interfaces/user";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },

  address: {
    type: String,
    default: null,
  },

  token: {
    type: String,
    default: generarId(),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
});


const User = mongoose.model("User", userSchema);
export default User;

