import express from "express";

import { connectToMongoDb } from "./connect.js";

import { router as userRoute } from "./routes/user.js";

const app = express();
const PORT = 8000;

// DB Connection
connectToMongoDb("mongodb://127.0.0.1:27017/logistics-tracking").then(() => {
  console.log("Mongodb connected");
});

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/user", userRoute);

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
