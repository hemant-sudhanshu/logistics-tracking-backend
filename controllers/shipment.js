import {
  handleBadRequest,
  handleInternalServerError,
  handleUnauthorizedRequest,
} from "../services/errorHandler.js";

import { Shipment } from "../models/shipment.js";

const isShipmentNotExists = async (id) => {
  const shipment = await Shipment.findOne({ shipmentId: id });
  console.log(`shipment: ${JSON.stringify(shipment)}`);
  return shipment ? false : true;
};

export const handleGetShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    if (!shipments) {
      return res.status(404).json({
        success: false,
        message: "No shipments found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Success.",
      data: shipments,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

export const handleAddShipment = async (req, res) => {
  try {
    const reqObj = req.body;
    console.log(`reqObj.shipmentId: ${reqObj.shipmentId}`);

    const isShipmentNotExist = await isShipmentNotExists(reqObj.shipmentId);

    if (!isShipmentNotExist) {
      return handleBadRequest(res, "Shipment is already added.");
    }

    // create a new shipment
    const shipment = await Shipment.create(reqObj);

    return res.status(201).json({
      success: true,
      message: "Shipment added successfully.",
      data: shipment,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

export const handleUpdateShipment = async (req, res) => {
  try {
    var updateObject = req.body;
    var id = req.params.id;

    // fiand and update a shipment
    const shipment = await Shipment.findByIdAndUpdate(id, updateObject, {
      new: true,
    });

    if (!shipment) {
      return handleNotFoundRequest(res, "Shipment is not found.");
    }
    return res.status(200).json({
      success: true,
      message: "Shipment updated successfully.",
      data: shipment,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
