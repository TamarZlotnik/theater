const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { auth, adminAuth } = require('../middleware/auth');
const Movie = require('../models/Movie');

// Middleware for handling movieId parameter
router.param('movieId', async (req, res, next, movieId) => {
  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.movie = movie;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Routes for movies
router.get('/', movieController.getAllMovies);
router.get('/:movieId', movieController.getMovieById);
router.post('/', auth, adminAuth, movieController.createMovie);
router.put('/:movieId', auth, adminAuth, movieController.updateMovie);
router.delete('/:movieId', auth, adminAuth, movieController.deleteMovie);

// Routes for schedules
router.post('/:movieId/schedule', auth, adminAuth, movieController.addSchedule);
router.delete('/:movieId/schedule/:id', auth, adminAuth, movieController.removeSchedule);

module.exports = router;
