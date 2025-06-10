import { Schema, model } from "mongoose";

const validCharacterPattern = /^[a-zA-Z0-9]+$/;

const castSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: [
      validCharacterPattern,
      "Only English Letters and white space are allowed!",
    ],
    minLengh: [5, "At least 5 character long!"],
  },
  age: {
    type: Number,
    required: true,
    min: [1, "Age should be at least 1 years old!"],
    max: [120, "Age must be less than 120!"],
  },
  born: {
    type: String,
    required: true,
    minLengh: [5, "At least 5 character long!"],
    validate: [
      validCharacterPattern,
      "Only English Letters and white space are allowed!",
    ],
  },
  imageUrl: {
    type: String,
    validate: [/^https?:\/\//, "Invalid Image URL!"],
    required: true,
  },
});

const Cast = model("Cast", castSchema);

export default Cast;
