import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = response.data;

      // Save token and user info
      login({
        name: data.name,
        email: data.email,
        role: data.role,
        companyName: data.companyName,
      }, data.token);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center',
               alignItems: 'center', minHeight: '100vh',
               bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 2 }}>

        <Typography variant="h4" fontWeight="bold"
                    color="primary" textAlign="center" mb={1}>
          SaaS Boilerplate
        </Typography>
        <Typography variant="body2" textAlign="center"
                    color="text.secondary" mb={3}>
          Sign in to your account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth label="Email" type="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }} />

        <TextField
          fullWidth label="Password" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />

        <Button fullWidth variant="contained" size="large"
                onClick={handleLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        <Typography textAlign="center" mt={2} variant="body2">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1976d2' }}>Register here</Link>
        </Typography>

      </Paper>
    </Box>
  );
}

export default LoginPage;