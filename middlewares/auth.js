import { extractToken, getUser } from "../services/tokenService.js";
import {
  handleUnauthorizedRequest,
  handleBadRequest,
} from "../services/errorHandler.js";
import { User } from "../models/user.js";
import { strings } from "../constants/strings.js";

const { messages } = strings;

/**
 * Middleware function to handle user authentication.
 * Extracts the token from the request, verifies it, and sets the user data to req.user if valid.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const auth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return handleUnauthorizedRequest(res, messages.noTokenProvided);

  try {
    // Decode the token and set the decoded data to the req.user property
    const user = getUser(token);

    // If the decoded payload's is a valid user
    if (user) {
      req.user = user; // Assign the user to req.user
      verifyUser(req, res, next);
    } else return handleUnauthorizedRequest(res, messages.invalidToken);
  } catch (err) {
    // Handle error for invalid token
    return handleBadRequest(res, messages.invalidToken);
  }
};

/**
 * Middleware function to verify if the user exists in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const verifyUser = async (req, res, next) => {
  const user = req.user;

  if (!user) return handleUnauthorizedRequest(res, messages.accessDenied);

  try {
    const verifiedUser = await User.findById(user._id);
    if (verifiedUser) {
      req.user = verifiedUser; // Assign the user to req.user
      next();
    } else return handleUnauthorizedRequest(res, messages.invalidUser);
  } catch (error) {
    // Handle error for invalid token
    return handleBadRequest(res, messages.invalidUser);
  }
};
