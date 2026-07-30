import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress,
  FormControl, InputLabel, Select,
  MenuItem, Divider, Chip
} from '@mui/material';
import api from '../api/axios';

function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', companyName: ''
  });
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [isNewCompany, setIsNewCompany] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load existing companies on page load
  useEffect(() => {
    api.get('/api/superadmin/tenant-names')
      .then(res => setExistingCompanies(res.data))
      .catch(() => setExistingCompanies([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setForm({ ...form, companyName: company });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email ||
        !form.password || !form.companyName) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post(
        '/api/auth/register', form
      );
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
  const data = err.response?.data;

  if (data?.password) {
    setError(data.password);
  } else if (data?.email) {
    setError(data.email);
  } else if (data?.name) {
    setError(data.name);
  } else if (data?.companyName) {
    setError(data.companyName);
  } else {
    setError(data?.error || "Registration failed.");
  }
}finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Paper elevation={3} sx={{
        p: 4, width: 450, borderRadius: 2
      }}>

        <Typography variant="h5" fontWeight="bold"
                    color="primary" textAlign="center" mb={3}>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Personal Details */}
        <TextField
          fullWidth label="Full Name" name="name"
          value={form.name} onChange={handleChange}
          sx={{ mb: 2 }} />

        <TextField
          fullWidth label="Email" name="email" type="email"
          value={form.email} onChange={handleChange}
          sx={{ mb: 2 }} />

        <TextField
          fullWidth label="Password" name="password"
          type="password"
          value={form.password} onChange={handleChange}
          sx={{ mb: 3 }} />

        <Divider sx={{ mb: 2 }}>
          <Chip label="Company" size="small" />
        </Divider>

        {/* Toggle — New or Existing Company */}
        <Box display="flex" gap={1} mb={2}>
          <Button
            fullWidth
            variant={isNewCompany ? 'contained' : 'outlined'}
            onClick={() => {
              setIsNewCompany(true);
              setSelectedCompany('');
              setForm({ ...form, companyName: '' });
            }}>
            New Company
          </Button>
          <Button
            fullWidth
            variant={!isNewCompany ? 'contained' : 'outlined'}
            onClick={() => setIsNewCompany(false)}
            disabled={existingCompanies.length === 0}>
            Join Existing
          </Button>
        </Box>

        {/* New Company — type name */}
        {isNewCompany && (
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="Enter your company name"
            helperText="This will create a new company"
          />
        )}

        {/* Existing Company — pick from dropdown */}
        {!isNewCompany && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              label="Select Company"
              onChange={(e) =>
                handleCompanySelect(e.target.value)}>
              {existingCompanies.map((company) => (
                <MenuItem key={company} value={company}>
                  {company}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          fullWidth variant="contained" size="large"
          onClick={handleRegister}
          disabled={loading}>
          {loading
            ? <CircularProgress size={24} color="inherit" />
            : 'Register'}
        </Button>

        <Typography textAlign="center" mt={2} variant="body2">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1976d2' }}>
            Login here
          </Link>
        </Typography>

      </Paper>
    </Box>
  );
}

export default RegisterPage;