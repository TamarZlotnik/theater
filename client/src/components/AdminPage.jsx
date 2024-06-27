import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Delete, Edit, Schedule, Save } from '@mui/icons-material';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: 0, date: '' });
  const [editMovie, setEditMovie] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [newSchedule, setNewSchedule] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      axios.get('http://localhost:5000/movies', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => setMovies(response.data))
        .catch(error => console.error('Error fetching movies:', error));
    }
  }, [user]);

  const handleAddMovie = () => {
    const formData = new FormData();
    formData.append('title', newMovie.title);
    formData.append('description', newMovie.description);
    formData.append('duration', newMovie.duration);
    formData.append('date', new Date(newMovie.date));
    formData.append('coverImage', coverImage);

    axios.post('http://localhost:5000/movies', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
    })
      .then(response => {
        setMovies([...movies, response.data]);
        setNewMovie({ title: '', description: '', duration: 0, date: '' });
        setCoverImage(null);
      })
      .catch(error => console.error('Error adding movie:', error));
  };

  const handleAddSchedule = (movieId) => {
    axios.post(`http://localhost:5000/movies/${movieId}/schedule`, { date: newSchedule }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        setMovies(movies.map(movie => movie._id === movieId ? response.data : movie));
        setSelectedMovieId(null); // Clear selected movie ID after adding schedule
        setNewSchedule(''); // Clear newSchedule state after adding schedule
      })
      .catch(error => {
        setNewSchedule('');
        setSelectedMovieId(null);
        setError('Error adding schedule: ' + error.response.data.message)});
  };

  const handleRemoveSchedule = (movieId, id) => {
    axios.delete(`http://localhost:5000/movies/${movieId}/schedule/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        setMovies(movies.map(movie => movie._id === movieId ? response.data : movie));
      })
      .catch(error => console.error('Error removing schedule:', error));
  };

  const handleEditMovie = (movieId) => {
    const formData = new FormData();
    formData.append('title', editMovie.title);
    formData.append('description', editMovie.description);
    formData.append('duration', editMovie.duration);
    formData.append('coverImage', coverImage);

    axios.put(`http://localhost:5000/movies/${movieId}`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
    })
      .then(response => {
        const updatedMovies = movies.map(movie => movie._id === movieId ? response.data : movie);
        setMovies(updatedMovies);
        setEditMovie(null);
      })
      .catch(error => console.error('Error editing movie:', error));
  };

  const handleDeleteMovie = (movieId) => {
    axios.delete(`http://localhost:5000/movies/${movieId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setMovies(movies.filter(movie => movie._id !== movieId));
      })
      .catch(error => console.error('Error deleting movie:', error));
  };

  const handleInputChange = (value) => {
    setNewSchedule(value);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return user?.role === 'admin' ? (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Page
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Movie</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={newMovie.title}
              onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration"
              variant="outlined"
              type="number"
              fullWidth
              value={newMovie.duration}
              onChange={e => setNewMovie({ ...newMovie, duration: parseInt(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={newMovie.description}
              onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Schedule"
              variant="outlined"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newMovie.date}
              onChange={e => setNewMovie({ ...newMovie, date: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              fullWidth
              onClick={handleAddMovie}
            >
              Add Movie
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h4" component="h1" gutterBottom>
        Existing Movies
      </Typography>
      <List>
        {movies.map(movie => (
          <Card key={movie._id} sx={{ mb: 2 }}>
            {movie.coverImage && <CardMedia
              component="img"
              alt={movie.title}
              height="140"
              image={`http://localhost:5000/${movie.coverImage}`}
            />}
            <CardContent>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2" color="textSecondary">{movie.description}</Typography>
              <Typography variant="subtitle1" component="h2" mt={2}>
                Duration: {Math.floor(movie.duration / 60)}:{movie.duration % 60} hours
              </Typography>
              <Typography variant="subtitle1" component="h2" mt={2}>
                Schedule:
              </Typography>
              <List>
                {movie.schedule?.map(schedule => (
                  <ListItem key={schedule}>
                    <ListItemText primary={new Date(schedule.date).toLocaleString()} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" style={{ fontSize: 'small' }} onClick={() => handleRemoveSchedule(movie._id, schedule._id)}>
                        Remove Schedule
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              {selectedMovieId === movie._id && (
                <Box>
                  <TextField
                    type="datetime-local"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={newSchedule}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={() => handleAddSchedule(movie._id)}
                    fullWidth
                  >
                    Save
                  </Button>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button startIcon={<Schedule />} onClick={() => setSelectedMovieId(movie._id)}>Add Schedule</Button>
              <Button startIcon={<Edit />} onClick={() => setEditMovie(movie)}>Edit</Button>
              <Button startIcon={<Delete />} onClick={() => handleDeleteMovie(movie._id)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </List>

      {editMovie && (
        <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
          <Typography variant="h5" gutterBottom>Edit Movie</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={editMovie.title}
                onChange={e => setEditMovie({ ...editMovie, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration"
                variant="outlined"
                type="number"
                fullWidth
                value={editMovie.duration}
                onChange={e => setEditMovie({ ...editMovie, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={editMovie.description}
                onChange={e => setEditMovie({ ...editMovie, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                fullWidth
                onClick={() => handleEditMovie(editMovie._id)}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  ) : (
    <Container>
      <Typography variant="h3" color="error">Access Denied</Typography>
    </Container>
  );
};

export default AdminPage;
