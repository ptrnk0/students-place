import { OAuth2Client } from "google-auth-library";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { getEnvVar } from "./getEnvVar.js";

const PATH_JSON = path.join(process.cwd(), "google-oauth.json");
const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  clientId: getEnvVar("GOOGLE_AUTH_CLIENT_ID"),
  clientSecret: getEnvVar("GOOGLE_AUTH_CLIENT_SECRET"),
  redirectUri: "http://localhost:3000/confirm-google-auth",
});

export function generateAuthUrl() {
  return googleOAuthClient.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
}
