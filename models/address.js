import mongoose from "mongoose";

// Define the schema for the address sub-document
export const addressSchema = new mongoose.Schema({
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
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
});

export const Address = mongoose.model("address", addressSchema);
