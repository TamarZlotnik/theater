import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Select, MenuItem, InputLabel, FormControl, TextField, List, ListItem, ListItemText, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    axios.get('http://localhost:5000/movies')
      .then(response => {
        const sortedMovies = sortMovies(response.data, sortBy);
        setMovies(sortedMovies);
        setFilteredMovies(sortedMovies);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [dateRange]);

  useEffect(() => {
    const sortedMovies = sortMovies(movies, sortBy);
        setMovies(sortedMovies);
        setFilteredMovies(sortedMovies);
  }, [sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setDateRange({ ...dateRange, startDate: event.target.value });
  };

  const handleEndDateChange = (event) => {
    setDateRange({ ...dateRange, endDate: event.target.value });
  };

  const filterAndSortMovies = () => {
    let filteredMovies = [...movies];
    if (dateRange.startDate && dateRange.endDate) {
      filteredMovies = filteredMovies.filter(movie => {
        const schedulesWithinRange = movie.schedule.filter(schedule => {
          const scheduleDate = new Date(schedule.date);
          return scheduleDate >= new Date(dateRange.startDate) && scheduleDate <= new Date(dateRange.endDate);
        });
        if (schedulesWithinRange.length > 0) {
          movie.schedule = schedulesWithinRange
          return true;
        }
        return false;
      });
    }
    filteredMovies = sortMovies(filteredMovies, sortBy);
    setFilteredMovies(filteredMovies);
  };

  const sortMovies = (moviesToSort, sortType) => {
    // Sorting each movie's schedule first
    const sortedMovies = moviesToSort.map(movie => {
      const sortedSchedule = movie.schedule.slice().sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      return { ...movie, schedule: sortedSchedule };
    });
  
    // Sorting movies based on schedule dates
    return sortedMovies.sort((a, b) => {
      if (sortType === 'date') {
        const dateA = a.schedule.length > 0 ? new Date(a.schedule[0].date) : null;
        const dateB = b.schedule.length > 0 ? new Date(b.schedule[0].date) : null;
        return dateA - dateB;
      } else if (sortType === 'dateDesc') {
        const dateA = a.schedule.length > 0 ? new Date(a.schedule[a.schedule.length - 1].date) : null;
        const dateB = b.schedule.length > 0 ? new Date(b.schedule[b.schedule.length - 1].date) : null;
        return dateB - dateA;
      }
      return 0;
    });
  };
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Scheduled Movies
      </Typography>
      <Box mb={3}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="sort-by-label">Sort by</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            onChange={handleSortChange}
            label="Sort by"
          >
            <MenuItem value="date">Date (Oldest to Newest)</MenuItem>
            <MenuItem value="dateDesc">Date (Newest to Oldest)</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateRange.startDate}
            onChange={handleStartDateChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateRange.endDate}
            onChange={handleEndDateChange}
            fullWidth
            margin="normal"
          />
        </Box>
      </Box>
      <List>
        {filteredMovies.map(movie => (
          <ListItem key={movie._id} divider>
            <ListItemText
              primary={
                <>
                  <Typography variant="h6">{movie.title}</Typography>
                </>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">{movie.description}</Typography>
                  <Typography variant="subtitle1" component="h2" mt={2}>
                    Duration: {Math.floor(movie.duration / 60)}:{movie.duration % 60} hours
                  </Typography>
                  <Typography variant="subtitle1" component="h2" mt={2}>
                    Schedule:
                  </Typography>
                  <List>
                    {movie.schedule?.map((schedule, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={new Date(schedule.date).toLocaleString()} />
                        <Button
                          variant="contained"
                          component={Link}
                          disabled={!user}
                          to={`/movie/${movie._id}/${schedule._id}`}
                        >
                          Book Now
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </>
              }
            />


          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default HomePage;

