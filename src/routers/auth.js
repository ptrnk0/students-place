import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getGoogleOAuthUrlController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
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

authRouter.post("/logout", ctrlWrapper(logoutUserController));

authRouter.post("/refresh", ctrlWrapper(refreshUserSessionController));

authRouter.post(
  "/request-reset-email",
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

authRouter.get("/get-oauth-url", ctrlWrapper(getGoogleOAuthUrlController));

export default authRouter;
