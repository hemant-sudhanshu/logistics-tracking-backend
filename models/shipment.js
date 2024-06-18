import mongoose from "mongoose";
import { strings } from "../constants/strings.js";
import { addressSchema } from "./address.js";
const { Schema } = mongoose;

const { shipmentStatuses } = strings;

// Define the schema for the shipmentActions sub-document
const shipmentActionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

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
    status: {
      type: String,
      required: true,
      default: shipmentStatuses[0],
      enum: shipmentStatuses,
    },
    isIncoming: {
      type: Boolean,
      default: false,
    },
    date: { type: Date, default: Date.now },
    deliveryDate: { type: Date, required: true },
    notes: String,
    instructions: String,
    originAddress: {
      type: addressSchema,
      required: true,
    },
    destinationAddress: {
      type: addressSchema,
      required: true,
    },

    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },

    actions: [shipmentActionSchema],
  },
  { timestamps: true }
);


export const Shipment = mongoose.model("shipment", shipmentSchema);
