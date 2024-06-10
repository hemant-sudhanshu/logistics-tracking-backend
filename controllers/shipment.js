import {
  handleBadRequest,
  handleInternalServerError,
} from "../services/errorHandler.js";

import { Shipment } from "../models/shipment.js";
import { getSubtractedDateFromCurrent } from "../utils/dateUtils.js";
import { strings } from "../constants/strings.js";

const { filters, shipmentMessages } = strings;

/**
 * Checks if a shipment with the given ID does not exist.
 * @param {string} id - The shipment ID.
 * @returns {Promise<boolean>} - True if shipment does not exist, false otherwise.
 */
const isShipmentNotExists = async (id) => {
  const shipment = await Shipment.findOne({ shipmentId: id });
  return !shipment;
};

/**
 * Handles fetching shipments based on query parameters.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 */
export const handleGetShipments = async (req, res) => {
  try {
    const { isIncoming, filter, sort } = req.query;

    const query = {};
    if (isIncoming) {
      query.isIncoming = isIncoming;
    }

    if (filter && filter !== filters.all) {
      let dateStr;
      if (filter === filters.lastWeek) {
        dateStr = getSubtractedDateFromCurrent({ days: 7 }).toISOString();
      } else if (filter === filters.lastMonth) {
        dateStr = getSubtractedDateFromCurrent({ months: 1 }).toISOString();
      } else if (filter === filters.lastYear) {
        dateStr = getSubtractedDateFromCurrent({ years: 1 }).toISOString();
      }
      if (dateStr) {
        query.date = { $gte: dateStr };
      }
    }

    let sortQuery;
    if (sort) {
      sortQuery = JSON.parse(sort);
    }
    const shipments = await Shipment.find(query).sort(sortQuery);

    if (!shipments) {
      return res.status(404).json({
        success: false,
        message: shipmentMessages.notFound,
      });
    }

    return res.status(200).json({
      success: true,
      message: shipmentMessages.success,
      data: shipments,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

/**
 * Handles fetching details of a specific shipment by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleGetShipmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: shipmentMessages.notFound,
      });
    }

    return res.status(200).json({
      success: true,
      message: shipmentMessages.success,
      data: shipment,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

/**
 * Handles adding a new shipment.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleAddShipment = async (req, res) => {
  try {
    const reqObj = req.body;

    const isShipmentNotExist = await isShipmentNotExists(reqObj.shipmentId);

    if (!isShipmentNotExist) {
      return handleBadRequest(res, shipmentMessages.alreadyAdded);
    }

    // create a new shipment
    const shipment = await Shipment.create(reqObj);

    return res.status(201).json({
      success: true,
      message: shipmentMessages.addedSuccussfully,
      data: shipment,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

/**
 * Handles updating an existing shipment by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleUpdateShipment = async (req, res) => {
  try {
    var updateObject = req.body;
    const { id } = req.params;

    // fiand and update a shipment
    const shipment = await Shipment.findByIdAndUpdate(id, updateObject, {
      new: true,
    });

    if (!shipment) {
      return handleNotFoundRequest(res, shipmentMessages.notFound);
    }
    return res.status(200).json({
      success: true,
      message: shipmentMessages.updatedSuccessfully,
      data: shipment,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
