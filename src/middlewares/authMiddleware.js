import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";

export const auth = (req, res, next) => {
  const token = req.cookies["auth"];

  if (!token) {
    return next();
  }

  try {
    const { id, email, role } = jwt.verify(token, SECRET);

    req.user = { id, email, role };
    res.locals.user = {
      id,
      email,
      role,
    };

    return next();
  } catch (err) {
    res.clearCookie("auth");
    res.redirect("/users/login");
  }
};

export const authGuard = (req, res, next) => {
  if (!req.user) {
    throw new Error("You don't have permission!");
  }

  next();
};
