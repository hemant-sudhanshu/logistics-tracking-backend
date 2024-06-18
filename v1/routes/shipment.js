import express from "express";
import {
  handleGetShipments,
  handleGetShipmentDetails,
  handleAddShipment,
  handleUpdateShipment,
  handleAddShipmentAction,
} from "../controllers/shipment.js";
import { auth } from "../../middlewares/auth.js";

const shipmentRouter = express.Router();
auth;

shipmentRouter.get("/", auth, handleGetShipments);
shipmentRouter.post("/", auth, handleAddShipment);
shipmentRouter.get("/:id", auth, handleGetShipmentDetails);
shipmentRouter.patch("/:id", auth, handleUpdateShipment);
shipmentRouter.patch("/addAction/:id", auth, handleAddShipmentAction);

export default shipmentRouter;
