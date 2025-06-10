import { Router } from "express";
import userService from "../services/userService.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const userController = Router();

userController.get("/register", (req, res) => {
  res.render("users/register");
});
userController.post("/register", async (req, res) => {
  const userData = req.body;

  await userService.register(userData);

  res.redirect("/users/login");
});

userController.get("/login", (req, res) => {
  res.render("users/login");
});
userController.post("/login", async (req, res) => {
  // get user data
  const userData = req.body;

  // send to service

  const token = await userService.login(userData);

  // take back from service token and attach cookie
  res.cookie("auth", token);
  // redirect to home
  res.redirect("/");
});

userController.get("/logout", authGuard, (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

export default userController;
