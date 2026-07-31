import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, CircularProgress, Alert
} from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/make-admin`);
      setMessage('User promoted to Admin!');
      fetchUsers();
    } catch (err) {
      setError('Failed to promote user.');
    }
  };

  const makeUser = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/make-user`);
      setMessage('User demoted to User!');
      fetchUsers();
    } catch (err) {
      setError('Failed to demote user.');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm(
      'Are you sure you want to delete this user?'
    )) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Admin Panel
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Manage users in your company only
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}
                 onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}
                 onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={2}
                          sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white',
                                   fontWeight: 'bold' }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: 'white',
                                   fontWeight: 'bold' }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: 'white',
                                   fontWeight: 'bold' }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ color: 'white',
                                   fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={
                          user.role === 'ADMIN' ? 'warning' :
                          user.role === 'SUPER_ADMIN' ? 'error' :
                          'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {user.role === 'USER' && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="warning"
                            onClick={() => makeAdmin(user.id)}>
                            Make Admin
                          </Button>
                        )}
                        {user.role === 'ADMIN' && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => makeUser(user.id)}>
                            Make User
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => deleteUser(user.id)}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found in your company.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

export default AdminPanel;