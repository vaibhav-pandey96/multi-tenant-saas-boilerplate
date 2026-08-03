import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static">
      <Toolbar>

        {/* App Name */}
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/dashboard')}>
          SaaS Boilerplate
        </Typography>

        {/* Nav Links */}
        <Button color="inherit"
                onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>

        <Button color="inherit"
                onClick={() => navigate('/billing')}>
          Billing
        </Button>

        {/* Admin link — only for ADMIN and SUPER_ADMIN */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <Button color="inherit"
                  onClick={() => navigate('/admin')}>
            Admin Panel
          </Button>
        )}

        {/* Super Admin link — only for SUPER_ADMIN */}
        {user?.role === 'SUPER_ADMIN' && (
          <Button color="inherit"
                  onClick={() => navigate('/superadmin')}>
            Super Admin
          </Button>
        )}

        {/* Role Badge */}
        <Chip
          label={user?.role}
          size="small"
          sx={{ mx: 2, bgcolor: 'white', fontWeight: 'bold',
                color:
                  user?.role === 'SUPER_ADMIN' ? 'error.main' :
                  user?.role === 'ADMIN' ? 'warning.main' : 'primary.main'
              }}
        />

        {/* Logout Button */}
        <Button color="inherit" variant="outlined"
                onClick={handleLogout}
                sx={{ borderColor: 'white' }}>
          Logout
        </Button>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;