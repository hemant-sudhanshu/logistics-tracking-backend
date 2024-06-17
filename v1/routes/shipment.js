import express from "express";
import {
  handleGetShipments,
  handleGetShipmentDetails,
  handleAddShipment,
  handleUpdateShipment,
} from "../controllers/shipment.js";
import { auth } from "../../middlewares/auth.js";

const shipmentRouter = express.Router();
auth;

shipmentRouter.get("/", auth, handleGetShipments);
shipmentRouter.post("/", auth, handleAddShipment);
shipmentRouter.get("/:id", auth, handleGetShipmentDetails);
shipmentRouter.patch("/:id", auth, handleUpdateShipment);

export default shipmentRouter;
