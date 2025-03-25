import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

import { UsersCollection } from "../db/models/users.js";
import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";

export async function registerUser(payload) {
  const emailExist = await UsersCollection.findOne({ email: payload.email });

  if (emailExist) {
    throw createHttpError(409, "Email in use");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
  return user;
}

export async function loginUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
}

export async function logoutUser(sessionId) {
  const session = await UsersCollection.deleteOne({ _id: sessionId });
  return session;
}

export function createSession() {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
}

export async function refreshUserSession(sessionId, refreshToken) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
}

export async function requestResetToken(email) {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }
}
