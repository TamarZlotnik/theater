const Movie = require('../models/Movie');

// Book a seat
const bookSeat = async (req, res) => {
  const { row, seat } = req.body;
  const index = row * 10 + seat;

  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find the correct schedule entry by _id
    const schedule = movie.schedule.find(sch => sch._id.toString() === req.params.id);
    if (!schedule) {
      return res.status(400).json({ message: 'Schedule entry not found' });
    }

    // Check if seat is already booked
    if (schedule.seats.get(index.toString())) {
      return res.status(400).json({ message: 'Seat already booked' });
    }

    // Mark seat as booked
    schedule.seats.set(index.toString(), true);
    const updatedMovie = await movie.save();

    res.status(200).json({ data: updatedMovie, message: 'Seat booked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookSeat
};
