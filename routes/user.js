import express from "express";
import {
  handleUserSignUp,
  handleUserLogin,
  handleUserProfile,
} from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", handleUserSignUp);
userRouter.post("/login", handleUserLogin);
userRouter.get("/profile", auth, handleUserProfile);

export default userRouter;
