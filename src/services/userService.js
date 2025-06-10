import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";

export default {
  register(userData) {
    const { email, password } = userData;
    return User.create({ email, password });
  },
  async login(userData) {
    // do Something
    const { email, password } = userData;
    // check if user exist by email findOne email
    const user = await User.findOne({ email });

    if (!user) {
      return new Error("Not such User in DB, please try again!");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return new Error("Your password is not Valid!");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: "user",
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "2h" });

    return token;
  },
};
