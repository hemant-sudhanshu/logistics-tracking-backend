import jwt from "jsonwebtoken";
import "dotenv/config";

export function setUser(user) {
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
}

export function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.APP_SECRET);
  } catch (error) {
    return null;
  }
}
