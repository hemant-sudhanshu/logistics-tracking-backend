import mongoose from "mongoose";
import { strings } from "../constants/strings.js";
import { addressSchema } from "./address.js";

const { userRoles } = strings;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: userRoles[0],
      enum: userRoles,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: addressSchema,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
