import { ONE_DAY } from "../constants/index.js";
import { loginUser, registerUser } from "../services/auth.js";

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
      accesToken: session.accessToken,
    },
  });
}
