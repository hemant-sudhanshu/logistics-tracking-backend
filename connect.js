import mongoose from "mongoose";

export const connectToMongoDb = async (url) => {
  try {
    const res = await mongoose.connect(url);
    console.log(`DB connected : ${res.connection.host}`);
  } catch (error) {
    return error;
  }
};
