import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress,
  Alert, Tabs, Tab, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  IconButton
} from '@mui/material';
import { Visibility, Close } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function SuperAdminPage() {
  const [tab, setTab] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // For viewing tenant users dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tenantsRes, invoicesRes] = await Promise.all([
        api.get('/api/superadmin/tenants'),
        api.get('/api/billing/invoices/all'),
      ]);
      setTenants(tenantsRes.data);
      setInvoices(invoicesRes.data);
    } catch (err) {
      setError('Failed to load super admin data.');
    } finally {
      setLoading(false);
    }
  };

  // View users of a specific tenant
  const viewTenantUsers = async (tenantId, tenantName) => {
    setSelectedTenant(tenantName);
    setOpenDialog(true);
    setUsersLoading(true);
    try {
      const res = await api.get(
        `/api/superadmin/tenants/${tenantId}/users`
      );
      setTenantUsers(res.data);
    } catch (err) {
      setError('Failed to load tenant users.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Promote user to Tenant Admin
  const makeTenantAdmin = async (userId) => {
    try {
      await api.put(
        `/api/superadmin/users/${userId}/make-tenant-admin`
      );
      setMessage('User promoted to Tenant Admin!');
      // Refresh users in dialog
      const updatedUsers = tenantUsers.map(u =>
        u.id === userId ? { ...u, role: 'ADMIN' } : u
      );
      setTenantUsers(updatedUsers);
    } catch (err) {
      setError('Failed to promote user.');
    }
  };

  // Demote Tenant Admin to User
  const makeUser = async (userId) => {
    try {
      await api.put(
        `/api/superadmin/users/${userId}/make-user`
      );
      setMessage('User demoted to User!');
      const updatedUsers = tenantUsers.map(u =>
        u.id === userId ? { ...u, role: 'USER' } : u
      );
      setTenantUsers(updatedUsers);
    } catch (err) {
      setError('Failed to demote user.');
    }
  };

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
          Super Admin Dashboard
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Platform-wide view — companies and billing only
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

        {/* Stats Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{
              p: 3, borderRadius: 2, textAlign: 'center'
            }}>
              <Typography variant="h3" fontWeight="bold"
                          color="primary">
                {tenants.length}
              </Typography>
              <Typography color="text.secondary">
                Total Companies
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{
              p: 3, borderRadius: 2, textAlign: 'center'
            }}>
              <Typography variant="h3" fontWeight="bold"
                          color="warning.main">
                {invoices.length}
              </Typography>
              <Typography color="text.secondary">
                Total Invoices
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="All Companies" />
            <Tab label="All Invoices" />
          </Tabs>

          <Box sx={{ p: 2 }}>

            {/* Tab 0 — Companies */}
            {tab === 0 && (
              tenants.length === 0 ? (
                <Typography color="text.secondary"
                            textAlign="center" py={3}>
                  No companies registered yet.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><b>Company Name</b></TableCell>
                        <TableCell><b>Plan</b></TableCell>
                        <TableCell><b>Total Users</b></TableCell>
                        <TableCell><b>API Calls</b></TableCell>
                        <TableCell><b>Manage</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tenants.map((tenant) => (
                        <TableRow key={tenant.id} hover>
                          <TableCell>
                            <b>{tenant.name}</b>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tenant.plan}
                              size="small"
                              color={
                                tenant.plan === 'PRO'
                                  ? 'error' :
                                tenant.plan === 'BASIC'
                                  ? 'warning' : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {tenant.userCount} users
                          </TableCell>
                          <TableCell>
                            {tenant.apiCallCount}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => viewTenantUsers(
                                tenant.id, tenant.name
                              )}>
                              View Users
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            )}

            {/* Tab 1 — Invoices */}
            {tab === 1 && (
              invoices.length === 0 ? (
                <Typography color="text.secondary"
                            textAlign="center" py={3}>
                  No invoices generated yet.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><b>Company</b></TableCell>
                        <TableCell><b>Period</b></TableCell>
                        <TableCell><b>Total</b></TableCell>
                        <TableCell><b>API Calls</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id} hover>
                          <TableCell>{inv.tenantName}</TableCell>
                          <TableCell>
                            {new Date(inv.periodStart)
                              .toLocaleDateString()}
                            {' → '}
                            {new Date(inv.periodEnd)
                              .toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <b>${inv.totalAmount}</b>
                          </TableCell>
                          <TableCell>
                            {inv.apiCallCount}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={inv.status}
                              size="small"
                              color={inv.status === 'PAID'
                                ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            )}

          </Box>
        </Paper>

        {/* Dialog — View Users of a Tenant */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between"
                 alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Users of {selectedTenant}
              </Typography>
              <IconButton
                onClick={() => setOpenDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            {usersLoading ? (
              <Box display="flex" justifyContent="center"
                   py={3}>
                <CircularProgress />
              </Box>
            ) : tenantUsers.length === 0 ? (
              <Typography color="text.secondary"
                          textAlign="center" py={2}>
                No users in this company yet.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell><b>Email</b></TableCell>
                      <TableCell><b>Role</b></TableCell>
                      <TableCell><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenantUsers.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={u.role}
                            size="small"
                            color={
                              u.role === 'ADMIN'
                                ? 'warning' :
                              u.role === 'SUPER_ADMIN'
                                ? 'error' : 'primary'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {u.role === 'USER' && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="warning"
                              onClick={() =>
                                makeTenantAdmin(u.id)}>
                              Make Tenant Admin
                            </Button>
                          )}
                          {u.role === 'ADMIN' && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => makeUser(u.id)}>
                              Make User
                            </Button>
                          )}
                          {u.role === 'SUPER_ADMIN' && (
                            <Typography variant="body2"
                                        color="error">
                              Platform Owner
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}

export default SuperAdminPage;