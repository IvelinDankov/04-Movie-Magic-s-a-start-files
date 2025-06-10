import { Router } from "express";
import userService from "../services/userService.js";
import { authGuard } from "../middlewares/authMiddleware.js";
import { errorMessage } from "../utils/errorUtils.js";

const userController = Router();

userController.get("/register", async (req, res) => {
  res.render("users/register");
});
userController.post("/register", async (req, res) => {
  const { email, password, rePass } = req.body;

  try {
    await userService.register(email, password, rePass);
    const token = await userService.login(email, password);

    // take back from service token and attach cookie
    res.cookie("auth", token);

    res.redirect("/");
  } catch (err) {
    const error = errorMessage(err);

    res.render("users/register", { error, email });
  }
});

userController.get("/login", (req, res) => {
  res.render("users/login");
});
userController.post("/login", async (req, res) => {
  // get user data
  const { email, password } = req.body;

  try {
    const token = await userService.login(email, password);

    // take back from service token and attach cookie
    res.cookie("auth", token);
    // redirect to home
    res.redirect("/");
  } catch (err) {
    res.render("users/login", { error: err.message, email });
  }

  // send to service
});

userController.get("/logout", authGuard, (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

export default userController;
