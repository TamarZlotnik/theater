const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  schedule: [{
    date: { type: Date, required: true },
    seats: {
      type: Map,
      of: Boolean,
      default: new Map()
    }
  }],
  coverImage: { type: String },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
