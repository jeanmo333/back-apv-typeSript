// import mongoose from "mongoose";
// import generateId from "../helpers/generateId";
// import { IUser } from "../interfaces/user";

// const userSchema = new mongoose.Schema<IUser>({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     default: null,
//     trim: true,
//   },
//   web: {
//     type: String,
//     default: null,
//   },

//   address: {
//     type: String,
//     default: null,
//   },

//   token: {
//     type: String,
//     default: genarateId(),
//   },
//   isActive: {
//     type: Boolean,
//     default: false,
//   },
//   roles: {type: String,
//     enum: {
//       values: ["admin", "client", "super-user"],
//       message: "{VALUE} no es un role válido",
//       default: "client",
//       required: true,
//     },
//   },
  
// },
// {
//   timestamps: true,
// });


// const User = mongoose.model("User", userSchema);
// export default User;












import mongoose, { Schema, model, Model } from "mongoose";
import genarateId from "../helpers/genarateId";
import { IUser } from "../interfaces/user";

const userSchema = new Schema(
  {
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
    default: genarateId(),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
    roles: {type: String,
      enum: {
        values: ["admin", "client", "super-user"],
        message: "{VALUE} no es un role válido",
        default: "client",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;


