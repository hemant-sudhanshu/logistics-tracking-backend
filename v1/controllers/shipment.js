import {
  handleBadRequest,
  handleInternalServerError,
} from "../../services/errorHandler.js";

import { Shipment } from "../../models/shipment.js";
import { getSubtractedDateFromCurrent } from "../../utils/dateUtils.js";
import { strings } from "../../constants/strings.js";

const { common, filters, sortOptions, shipmentMessages, shipmentStatuses } =
  strings;

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
    const { type, timeStamp, sortby } = req.query;

    const query = {};
    if (type && (type === common.incoming || type === common.outgoing)) {
      query.isIncoming = type === common.incoming;
    }

    if (timeStamp && timeStamp !== filters.all) {
      let dateStr;
      if (timeStamp === filters.lastWeek) {
        dateStr = getSubtractedDateFromCurrent({ days: 7 }).toISOString();
      } else if (timeStamp === filters.lastMonth) {
        dateStr = getSubtractedDateFromCurrent({ months: 1 }).toISOString();
      } else if (timeStamp === filters.lastYear) {
        dateStr = getSubtractedDateFromCurrent({ years: 1 }).toISOString();
      }
      if (dateStr) {
        query.date = { $gte: dateStr };
      }
    }

    let sortQuery;
    if (sortby) {
      const sortObj = sortOptions.find((item) => item.key === sortby);
      sortQuery = sortObj.value;
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
    const reqObj = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id,
      originAddress: req.user.address,
    };

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
    var updateObject = {
      ...req.body,
      updatedBy: req.user._id,
    };
    const { id } = req.params;

    const status = updateObject.status;
    if (status) {
      // Check
      const index = shipmentStatuses.indexOf(status);
      if (index === -1)
        return handleBadRequest(res, shipmentMessages.invalidStatus);
    }

    // find and update a shipment
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

/**
 * Handles updating an existing shipment by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleAddShipmentAction = async (req, res) => {
  try {
    var { status, action } = req.body;
    const { id } = req.params;

    if (!status) {
      return handleBadRequest(res, shipmentMessages.statusRequired);
    } else {
      // Check
      const index = shipmentStatuses.indexOf(status);
      if (index === -1)
        return handleBadRequest(res, shipmentMessages.invalidStatus);
    }

    if (!action) {
      return handleBadRequest(res, shipmentMessages.actionRequired);
    }

    // find and update a shipment
    const existingShipment = await Shipment.findById(id);
    const newAactions = [...existingShipment.actions, action];

    const updateObject = {
      status: status,
      actions: newAactions,
      updatedBy: req.user._id,
    };

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
