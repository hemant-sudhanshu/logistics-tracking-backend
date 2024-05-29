import express from "express";
import {
  handleUserSignUp,
  handleUserLogin,
  handleUserProfile,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/signup", handleUserSignUp);
userRouter.post("/login", handleUserLogin);
userRouter.get("/profile", handleUserProfile);

export default userRouter;
