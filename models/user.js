import mongoose from "mongoose";

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
      default: "team",
      enum: ["team", "admin"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
