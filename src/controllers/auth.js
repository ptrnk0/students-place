import { ONE_DAY } from "../constants/index.js";
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from "../services/auth.js";
import { generateAuthUrl } from "../utils/googleOAuth2.js";

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: "User succesfuly created",
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res) {
  if (req.cookie.sessionId) {
    await logoutUser(req.cookie.sessionId);
  }

  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).send();
}

function setupSession(res, session) {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
}

export async function refreshUserSessionController(req, res) {
  const newSession = await refreshUserSession(
    req.cookies.sessionId,
    req.cookies.refreshToken
  );

  setupSession(res, newSession);

  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: {
      accessToken: newSession.accessToken,
    },
  });
}

export async function requestResetEmailController(req, res) {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: "Reset password email was successfully sent!",
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  await resetPassword(req.body);

  res.json({
    message: "Password was successfully reset!",
    status: 200,
    data: {},
  });
}

export async function getGoogleOAuthUrlController(req, res) {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: "Successfully get Google OAuth url!",
    data: { url },
  });
}
