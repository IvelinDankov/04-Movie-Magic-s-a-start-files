import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    // validate: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm,
    validate: [/@[a-zA-Z0-9]+\.[a-zA+Z0-9]+$/, "Ivalid email format"],
    minLength: [10, "Must be at Least 10 character"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    validate: [/^[a-zA-Z0-9]*$/, "password should be english word and Numbers"],
    minLength: [5, "Min Length should be min 5 characters!"],
  },
});

userSchema.virtual("rePass").set(function (value) {
  if (this.password !== value) {
    throw new Error("Password mismach!");
  }
});

userSchema.path("email").validate(async function (value) {
  const existingUser = await User.findOne({ email: value });

  return !existingUser;
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = model("User", userSchema);

export default User;
