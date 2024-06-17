import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectToMongoDb } from "./connect.js";

import router from "./v1/routes/index.js";

const app = express();
const PORT = 8000;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
// v1 router add more routes later
app.use("/api/v1", router);

// DB Connection
connectToMongoDb(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
    app.listen(PORT, () => {
      console.log(`Server started at port: ${PORT}`);
    });
  })
  .catch((error) => console.log(`Server error ${error}`));


