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
      default: "Transit",
      enum: ["Transit", "Delivered", "Delayed"],
    },
    isIncoming: {
      type: Boolean,
      default: false,
    },
    date: { type: Date, default: Date.now },
    deliveryDate: { type: Date, required: true },
    notes: String,
    instructions: String,
    houseNo: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    destinationState: {
      type: String,
      required: true,
    },
    destinationPincode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Shipment = mongoose.model("shipment", shipmentSchema);
