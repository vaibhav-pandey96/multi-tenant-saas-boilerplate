import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid,
  CircularProgress, Chip
} from '@mui/material';
import { Person, Business, Badge } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/user/me')
      .then(res => setProfile(res.data))
      .catch(err => console.error('Profile error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box>
      <Navbar />
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    </Box>
  );

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Welcome back, {profile?.name || user?.name}! 👋
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Here's your account overview
        </Typography>

        <Grid container spacing={3}>

          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" alignItems="center"
                   gap={1} mb={2}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  My Profile
                </Typography>
              </Box>
              <Typography>
                <b>Name:</b> {profile?.name || 'Loading...'}
              </Typography>
              <Typography>
                <b>Email:</b> {profile?.email || 'Loading...'}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={profile?.role || 'USER'}
                  color={
                    profile?.role === 'SUPER_ADMIN' ? 'error' :
                    profile?.role === 'ADMIN' ? 'warning' :
                    'primary'
                  }
                  size="small"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Company Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" alignItems="center"
                   gap={1} mb={2}>
                <Business color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  My Company
                </Typography>
              </Box>
              <Typography>
                <b>Company:</b>{' '}
                {profile?.companyName || 'Loading...'}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={`Plan: ${profile?.plan || 'FREE'}`}
                  color="success"
                  size="small"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Access Level Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" alignItems="center"
                   gap={1} mb={2}>
                <Badge color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Access Level
                </Typography>
              </Box>
              {(!profile?.role || profile?.role === 'USER') && (
                <Typography color="text.secondary">
                  You can view your profile and billing
                  information.
                </Typography>
              )}
              {profile?.role === 'ADMIN' && (
                <Typography color="text.secondary">
                  You can manage users in your company and
                  control billing.
                </Typography>
              )}
              {profile?.role === 'SUPER_ADMIN' && (
                <Typography color="text.secondary">
                  You have full platform access — companies
                  and billing system-wide.
                </Typography>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;