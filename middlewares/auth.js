import { extractToken, getUser } from "../services/tokenService.js";
import {
  handleUnauthorizedRequest,
  handleBadRequest,
} from "../services/errorHandler.js";

// Export middleware function to handle authentication
export const auth = (req, res, next) => {
  const token = extractToken(req);
  if (!token)
    return handleUnauthorizedRequest(res, "Access denied. No token provided");

  try {
    // Decode the token and set the decoded data to the req.user property
    const user = getUser(token);

    // If the decoded payload's is a valid user
    if (user) next();
    else return handleUnauthorizedRequest(res, "Access denied.");
  } catch (err) {
    // Handle error for invalid token
    return handleBadRequest(res, "Invalid token!"); 
  }
};
