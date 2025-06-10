import { Schema, model, Types } from "mongoose";

const maxYearAllowed = new Date().getFullYear() + 5;

const validCharacterPattern = /^[a-zA-Z0-9 ]*$/;

const movieSchema = new Schema({
  title: {
    type: String,
    required: [true, "title is required!"],

    validate: [
      validCharacterPattern,
      "Only English Letters and white space are allowed!",
    ],
    minLengh: [5, "At least 5 character long!"],
  },
  category: {
    type: String,
    required: [true, "category is required!"],
    enum: {
      values: ["tv-show", "animation", "movie", "documentary", "short-film"],
      message: (props) => `${props.value} is not valid category`,
    },
  },
  genre: {
    type: String,
    required: [true, "genre is required!"],
    lowercase: true, // not a validator, but sanitizer
    validate: [
      validCharacterPattern,
      "Only English Letters and white space are allowed!",
    ],
    minLengh: [5, "At least 5 character long!"],
  },
  director: {
    type: String,
    required: [true, "director is required!"],
    validate: [
      validCharacterPattern,
      "Only English Letters and white space are allowed!",
    ],
    minLengh: [5, "At least 5 character long!"],
  },
  year: {
    type: Number,
    required: [true, "year is required!"],
    min: [1900, "Min year is 1900"],
    max: [maxYearAllowed, `Year cannot be larger than ${maxYearAllowed}`],
  },
  imageUrl: {
    type: String,
    required: [true, "imageUrl is required!"],
    validate: [/^https?:\/\//, "Invalid Image URL!"],
  },
  rating: {
    type: Number,
    required: [true, "rating is required!"],
    min: [1, "Rating should be equal or more than 1"],
    max: [10, "Rating should be equal or less than 10"],
  },
  description: {
    type: String,
    required: [true, "description is required!"],
    minLengh: [20, "Min length i 20 charachters"],
    maxLength: [1000, "Description is too long!"],
    validate: [
      validCharacterPattern,
      "Only English Letters and white space are allowed!",
    ],
  },
  casts: [
    {
      type: Types.ObjectId,
      ref: "Cast",
    },
  ],
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Movie = model("Movie", movieSchema);

export default Movie;
