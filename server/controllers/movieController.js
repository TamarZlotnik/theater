const Movie = require('../models/Movie');

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single movie by ID
const getMovieById = async (req, res) => {
  res.json(res.movie);
};

// Create a new movie (Admin only)
const createMovie = async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    schedule: [{ date: new Date(req.body.date) }],
    coverImage: req.file ? req.file.filename : null
  });
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a movie by ID (Admin only)
const updateMovie = async (req, res) => {
  if (req.body.title != null) {
    res.movie.title = req.body.title;
  }
  if (req.body.description != null) {
    res.movie.description = req.body.description;
  }
  if (req.body.duration != null) {
    res.movie.duration = req.body.duration;
  }
  if (req.body.date != null) {
    res.movie.date = req.body.date;
  }
  try {
    const updatedMovie = await res.movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a movie by ID (Admin only)
const deleteMovie = async (req, res) => {
  try {
    await res.movie.deleteOne();
    res.json({ message: 'Deleted movie' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add schedule to a movie by ID (Admin only)
const addSchedule = async (req, res) => {
    const newScheduleStart = new Date(req.body.date);
    const newScheduleEnd = new Date(newScheduleStart.getTime() + res.movie.duration * 60000);
    try {
      // Check for overlapping schedules in all movies
      const overlappingSchedules = await Movie.aggregate([
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movies'
          }
        },
        {
          $unwind: "$schedule"
        },
        {
          $addFields: {
            scheduleEnd: { $add: ["$schedule.date", { $multiply: ["$duration", 60000] }] }
          }
        },
        {
          $match: {
            $or: [
              {
                $and: [
                  { "schedule.date": { $lte: newScheduleStart } },
                  { "scheduleEnd": { $gt: newScheduleStart } }
                ]
              },
              {
                $and: [
                  { "schedule.date": { $lt: newScheduleEnd } },
                  { "scheduleEnd": { $gte: newScheduleEnd } }
                ]
              },
              {
                $and: [
                  { "schedule.date": { $gte: newScheduleStart } },
                  { "scheduleEnd": { $lte: newScheduleEnd } }
                ]
              },
              {
                $and: [
                  { "schedule.date": { $lte: newScheduleStart } },
                  { "scheduleEnd": { $gte: newScheduleEnd } }
                ]
              }
            ]
          }
        }
      ]);
  
      if (overlappingSchedules.length > 0) {
        return res.status(400).json({ message: 'Schedule overlaps with an existing movie' });
      }
  
      // Add the new schedule to the movie's schedule array
      res.movie.schedule.push({ date: newScheduleStart});
      const updatedMovie = await res.movie.save();
  
      res.status(201).json(updatedMovie);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Remove schedule from a movie by ID (Admin only)
  const removeSchedule = async (req, res) => {
    const movie = res.movie;
    try {
      const scheduleIndex = movie.schedule.findIndex(schedule => schedule._id.toString() === req.params.id);
      if (scheduleIndex === -1) {
        return res.status(404).json({ message: 'Schedule not found for this date' });
      }
  
      // Remove the schedule from the movie
      movie.schedule.splice(scheduleIndex, 1);
      const updatedMovie = await movie.save();
  
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    addSchedule,
    removeSchedule
  };