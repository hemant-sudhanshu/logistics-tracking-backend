import jwt from "jsonwebtoken";
import "dotenv/config";

export const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    process.env.APP_SECRET,
    { expiresIn: "7d" }
  );
};

export const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else {
    return null;
  }
};

export const getUser = (token) => {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.APP_SECRET);
  } catch (error) {
    return null;
  }
};
