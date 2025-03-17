import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  loginUserController,
  registerUserController,
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

export default authRouter;
