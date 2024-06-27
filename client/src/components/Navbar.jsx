import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ marginBottom: 5 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          Theater
        </Typography>
        <Button color="inherit">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        </Button>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Button color="inherit">
                <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>Admin</Link>
              </Button>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>

            <Button color="inherit">
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
            </Button>
            <Button color="inherit">
              <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
