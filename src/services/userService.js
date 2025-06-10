import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";

export default {
  register(email, password, rePass) {
    if (password !== rePass) {
      throw new Error("Password mismatch!");
    }
    return User.create({ email, password, rePass });
  },
  async login(email, password) {
    // do Something
    // check if user exist by email findOne email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Not such User in DB, please try again!");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Your password is not Valid!");
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
