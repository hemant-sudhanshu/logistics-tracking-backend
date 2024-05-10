import mongoose from "mongoose";

export async function connectToMongoDb(url) {
  return mongoose.connect(url);
}
