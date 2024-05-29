import { extractToken, getUser } from "../services/tokenService.js";

// Export middleware function to handle authentication
export const auth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    // Decode the token and set the decoded data to the req.user property
    const user = getUser(token);

    // If the decoded payload's is a valid user
    if (user) next();
    else return res.status(401).send("Access denied.");
  } catch (err) {
    // Handle error for invalid token
    return res.status(400).send("Invalid token");
  }
};
