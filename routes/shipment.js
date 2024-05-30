import express from "express";
import {
  handleGetShipments,
  handleAddShipment,
  handleUpdateShipment,
} from "../controllers/shipment.js";
import { auth } from "../middlewares/auth.js";

const shipmentRouter = express.Router();

shipmentRouter.get("/", auth, handleGetShipments);
shipmentRouter.post("/", auth, handleAddShipment);
shipmentRouter.patch("/:id", auth, handleUpdateShipment);

export default shipmentRouter;
