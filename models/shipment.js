import mongoose from "mongoose";
const { Schema } = mongoose;

const shipmentSchema = new Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "transit",
      enum: ["transit", "delivered", "delayed"],
    },
    isIncoming: {
      type: Boolean,
      default: false,
    },
    date: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    notes: String,
    instructions: String,
  },
  { timestamps: true }
);

export const Shipment = mongoose.model("shipment", shipmentSchema);
