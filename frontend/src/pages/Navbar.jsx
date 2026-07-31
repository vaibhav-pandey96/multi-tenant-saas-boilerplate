import {
  AppBar, Toolbar, Typography,
  Button, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>

        {/* App Name */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          SaaS Boilerplate
        </Typography>

        {/* Dashboard */}
        <Button color="inherit"
                onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>

        {/* Billing */}
        <Button color="inherit"
                onClick={() => navigate('/billing')}>
          Billing
        </Button>

        {/* Admin Panel — ADMIN and SUPER_ADMIN only */}
        {(user?.role === 'ADMIN' ||
          user?.role === 'SUPER_ADMIN') && (
          <Button color="inherit"
                  onClick={() => navigate('/admin')}>
            Admin Panel
          </Button>
        )}

        {/* Super Admin — SUPER_ADMIN only */}
        {user?.role === 'SUPER_ADMIN' && (
          <Button color="inherit"
                  onClick={() => navigate('/superadmin')}>
            Super Admin
          </Button>
        )}

        {/* Role Badge */}
        <Chip
          label={user?.role || 'USER'}
          size="small"
          sx={{
            mx: 2,
            bgcolor: 'white',
            fontWeight: 'bold',
            color:
              user?.role === 'SUPER_ADMIN' ? 'error.main' :
              user?.role === 'ADMIN' ? 'warning.main' :
              'primary.main'
          }}
        />

        {/* Logout */}
        <Button
          color="inherit"
          variant="outlined"
          onClick={handleLogout}
          sx={{ borderColor: 'white' }}>
          Logout
        </Button>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;