import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {

  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  const transferOwnership = async (id) => {

    const ok = window.confirm(
      "Transfer Tenant Admin ownership?\n\nAfter this:\n• You will become a normal USER.\n• You will lose admin access.\n• You will need to login again."
    );

    if (!ok) return;

    setError('');
    setMessage('');
    setProcessingId(id);

    try {

      await api.put(`/api/admin/transfer-admin/${id}`);

      logout();

      alert("Ownership transferred successfully. Please login again.");

      navigate("/login", { replace: true });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to transfer ownership."
      );

    } finally {

      setProcessingId(null);

    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    setError('');
    setMessage('');
    setProcessingId(id);

    try {

      await api.delete(`/api/admin/users/${id}`);

      setMessage("User deleted successfully.");

      fetchUsers();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to delete user."
      );

    } finally {

      setProcessingId(null);

    }
  };

  return (
    <Box>

      <Navbar />

      <Box sx={{ p: 4 }}>

        <Typography variant="h4" fontWeight="bold" mb={1}>
          Tenant Admin Panel
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Manage users in your company.
        </Typography>

        {error &&
          <Alert severity="error" sx={{ mb:2 }} onClose={()=>setError('')}>
            {error}
          </Alert>
        }

        {message &&
          <Alert severity="success" sx={{ mb:2 }} onClose={()=>setMessage('')}>
            {message}
          </Alert>
        }

        {loading ? (

          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>

        ) : (

          <TableContainer component={Paper} elevation={2} sx={{ borderRadius:2 }}>

            <Table>

              <TableHead sx={{ bgcolor:"#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color:"white", fontWeight:"bold" }}>Name</TableCell>
                  <TableCell sx={{ color:"white", fontWeight:"bold" }}>Email</TableCell>
                  <TableCell sx={{ color:"white", fontWeight:"bold" }}>Role</TableCell>
                  <TableCell sx={{ color:"white", fontWeight:"bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {users.map(user => {

                  const isCurrentUser = currentUser?.email === user.email;

                  return (

                    <TableRow key={user.id} hover>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {user.name}
                          {isCurrentUser &&
                            <Chip label="You" color="success" size="small" />
                          }
                        </Box>
                      </TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === "ADMIN" ? "warning" : "primary"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>

                        {isCurrentUser ? (

                          <Typography variant="body2" color="text.secondary">
                            Your Account
                          </Typography>

                        ) : (

                          <Box display="flex" gap={1}>

                            {user.role === "USER" && (

                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                disabled={processingId === user.id}
                                onClick={() => transferOwnership(user.id)}
                              >
                                Transfer Ownership
                              </Button>

                            )}

                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              disabled={processingId === user.id}
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete
                            </Button>

                          </Box>

                        )}

                      </TableCell>

                    </TableRow>

                  );

                })}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found.
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