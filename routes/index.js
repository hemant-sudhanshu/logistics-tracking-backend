import express from "express";
import userRouter from "./user.js";
import shipmentRouter from "./shipment.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/shipments", shipmentRouter);

export default router;
