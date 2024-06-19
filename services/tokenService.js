import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Generates a JWT token for the given user.
 * @param {Object} user - The user object.
 * @param {string} user._id - The user's ID.
 * @param {string} user.firstName - The user's first name.
 * @param {string} user.lastName - The user's last name.
 * @param {string} user.email - The user's email address.
 * @param {string} user.role - The user's role.
 * @returns {string} - A JWT token.
 */
export const setUser = (user) => {
  const payload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    address: user.address,
  };
  const options = { expiresIn: "7d" };

  return jwt.sign(payload, process.env.APP_SECRET, options);
};

/**
 * Extracts the JWT token from the request headers.
 * @param {Object} req - Express request object.
 * @returns {string|null} - The extracted token or null if not found.
 */
export const extractToken = (req) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.split(" ")[1];
  }

  return null;
};

/**
 * Decodes and verifies the JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object|null} - The decoded user object or null if verification fails.
 */
export const getUser = (token) => {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.APP_SECRET);
  } catch (error) {
    return null;
  }
};
