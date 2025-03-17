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
  const user = await loginUser(req.body);
}
