import express from "express";
import movieService from "../services/movieService.js";
import castService from "../services/castService.js";
import { authGuard } from "../middlewares/authMiddleware.js";
import { errorMessage } from "../utils/errorUtils.js";

const movieController = express.Router();

movieController.get("/create", authGuard, (req, res) => {
  const movieOptions = populateOptions();
  res.render("movie/create", { movieOptions });
});

movieController.post("/create", authGuard, async (req, res) => {
  const newMovie = req.body;
  const userId = req.user.id;

  try {
    // Save Movie
    await movieService.create(userId, newMovie);

    // Redirect to home page
    res.redirect("/");
  } catch (err) {
    const movieOptions = populateOptions(newMovie.category);
    const error = errorMessage(err);
    res.render("movie/create", {
      error,
      movie: newMovie,
      movieOptions,
    });
  }
});

movieController.get("/:movieId/details", async (req, res) => {
  // Get movie id from params
  const movieId = req.params.movieId;

  // Get movie data with populated casts
  const movie = await movieService.getOne(movieId);

  const userId = req.user?.id;

  const isOwner = String(movie.owner) === userId;

  // Get movie cast
  // const casts = await movieService.getCasts(movieId)

  res.render("movie/details", { movie, isOwner });
});

movieController.get("/search", async (req, res) => {
  // Get querystring
  const filter = req.query;

  // Get all movies
  const movies = await movieService.getAll(filter);

  res.render("search", { movies, filter });
});

movieController.get("/:movieId/attach", authGuard, async (req, res) => {
  const movieId = req.params.movieId;

  // Get movie by id
  const movie = await movieService.getOne(movieId);

  // get all casts
  const casts = await castService.getAll({ exclude: movie.casts });

  // Pass casts to template
  res.render("movie/attach", { movie, casts });
});

movieController.post("/:movieId/attach", authGuard, async (req, res) => {
  // Get movie id
  const movieId = req.params.movieId;

  // Get cast id
  const castId = req.body.cast;

  // Attach cast to movie
  await movieService.attach(movieId, castId);

  // Redirect to movie details page
  res.redirect(`/movies/${movieId}/details`);
});

/* 
<select id="category" class="inputFields" name="category">
            <option value="">Select Category</option>
            <option value="tv-show">TV Show</option>
            <option value="animation">Animation</option>
            <option value="movie" selected>Movie</option>
            <option value="documentary">Documentary</option>
            <option value="short-film">Short Film</option>
          </select>
*/

function populateOptions(category) {
  const options = [
    { title: "TV Show", value: "tv-show" },
    { title: "Animation", value: "animation" },
    { title: "Movie", value: "movie" },
    { title: "Documentary", value: "documentary" },
    { title: "Short Film", value: "short-film" },
  ];

  const result = options.map((option) => ({
    ...option,
    selected: category == option.value ? "selected" : "",
  }));

  return result;
}

movieController.get("/:movieId/edit", authGuard, async (req, res) => {
  const movieId = req.params.movieId;

  const movie = await movieService.getOne(movieId);

  const movieOptions = populateOptions(movie.category);

  res.render(`movie/edit`, { movie, movieOptions });
});

movieController.post("/:movieId/edit", authGuard, async (req, res) => {
  const movieId = req.params.movieId;
  const movieData = req.body;
  await movieService.update(movieId, movieData);

  res.redirect(`/movies/${movieId}/details`);
});

export default movieController;
