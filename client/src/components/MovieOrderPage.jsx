import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieOrderPage.css';
import { Container, Grid, Button, Typography, Paper, CircularProgress } from '@mui/material';

const MovieOrderPage = () => {
  const { movieId, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    // Fetch movie details based on movieId
    axios.get(`http://localhost:5000/movies/${movieId}`)
      .then(response => {
        // Filter schedule to find the specific entry by _id
        const filteredSchedule = response.data.schedule.find(schedule => schedule._id === id);
        if (filteredSchedule) {
          setMovie({ ...response.data, schedule: [filteredSchedule] });
        } else {
          setMovie(null); // Handle case where schedule entry is not found
        }
      })
      .catch(error => {
        console.error('Error fetching movie:', error);
        setMovie(null);
      });
  }, [movieId, id]);

  const handleSeatSelect = (row, seat) => {
    setSelectedSeat({ row, seat });
  };

  const handleBooking = () => {
    if (selectedSeat) {
      axios.post(`http://localhost:5000/bookings/${movieId}/${id}/book`, selectedSeat)
      .then(response => {
        // Filter schedule to find the specific entry by _id
        const filteredSchedule = response.data.data.schedule.find(schedule => schedule._id === id);

        if (filteredSchedule) {
          setMovie({ ...response.data.data, schedule: [filteredSchedule] });
          alert(response.data.message);
        } else {
          setMovie(null); // Handle case where schedule entry is not found
        }
      })
        .catch(error => console.error('Error booking seat:', error));
    }
  };

  return (
    <Container>
      {movie ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {movie.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Duration: {Math.floor(movie.duration / 60)}:{movie.duration % 60} hours
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: {new Date(movie.schedule[0].date).toLocaleString()}
          </Typography>
          <Paper style={{ padding: '20px', margin: '20px 0' }}>
            <Grid container spacing={2}>
              {Array.from({ length: 10 }, (_, rowIndex) => (
                <Grid container item spacing={1} key={rowIndex}>
                  {Array.from({ length: 10 }, (_, seatIndex) => (
                    <Grid item key={seatIndex}>
                      <Button
                        variant="contained"
                        color={movie.schedule[0].seats[rowIndex * 10 + seatIndex] ? 'error' : 'success'}
                        onClick={() => handleSeatSelect(rowIndex, seatIndex)}
                        disabled={movie.schedule[0].seats[rowIndex * 10 + seatIndex]}
                      >
                        {rowIndex + 1}-{seatIndex + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Button variant="contained" color="primary" onClick={handleBooking}>
            Book Seat
          </Button>
        </>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default MovieOrderPage;
