import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button,
  Chip, CircularProgress, Alert, Divider,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Select, MenuItem,
  FormControl, InputLabel, TextField
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardBrand, setCardBrand] = useState('');

  const isAdmin = user?.role === 'ADMIN' ||
<<<<<<< HEAD
                  user?.role === 'SUPER_ADMIN';
=======
    user?.role === 'SUPER_ADMIN';
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      try {
        const subRes = await api.get('/api/billing/subscription');
        setSubscription(subRes.data);
      } catch (err) {
        setError('Could not load subscription. ' +
<<<<<<< HEAD
                 (err.response?.data?.error || ''));
=======
          (err.response?.data?.error || ''));
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
      }

      try {
        const invoiceRes = await api.get('/api/billing/invoices');
        setInvoices(invoiceRes.data);
      } catch (err) {
        console.error('Invoice error:', err.response?.data);
      }

      if (isAdmin) {
        try {
          const pmRes = await api.get(
            '/api/billing/payment-method'
          );
          setPaymentMethod(pmRes.data);
        } catch {
          setPaymentMethod(null);
        }
      }

    } finally {
      setLoading(false);
    }
  };

  const changePlan = async () => {
    if (!selectedPlan) return;
    try {
      const res = await api.post(
        '/api/billing/subscription/change-plan',
        { plan: selectedPlan }
      );
      setSubscription(res.data);
      setMessage(`Plan changed to ${selectedPlan} successfully!`);
      setSelectedPlan('');
    } catch (err) {
      setError('Failed to change plan.');
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm(
      'Cancel subscription at period end?'
    )) return;
    try {
      const res = await api.post(
        '/api/billing/subscription/cancel'
      );
      setSubscription(res.data);
      setMessage('Subscription will cancel at period end.');
    } catch (err) {
      setError('Failed to cancel subscription.');
    }
  };

  const addPaymentMethod = async () => {
    if (!cardNumber || !cardBrand) {
      setError('Please enter card number and brand.');
      return;
    }
    try {
      const res = await api.post(
        '/api/billing/payment-method',
        { cardNumber, cardBrand }
      );
      setPaymentMethod(res.data);
      setMessage('Payment method added!');
      setCardNumber('');
      setCardBrand('');
    } catch (err) {
      setError('Failed to add payment method.');
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
          Billing & Subscription
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Manage your plan, payment method and invoices
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}
<<<<<<< HEAD
                 onClose={() => setError('')}>
=======
            onClose={() => setError('')}>
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}
<<<<<<< HEAD
                 onClose={() => setMessage('')}>
=======
            onClose={() => setMessage('')}>
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>

          {/* Subscription Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Current Subscription
              </Typography>
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Chip
                  label={subscription?.plan || 'FREE'}
                  color="primary"
                />
                <Chip
                  label={subscription?.status || 'ACTIVE'}
                  color={subscription?.status === 'ACTIVE'
<<<<<<< HEAD
                         ? 'success' : 'error'}
=======
                    ? 'success' : 'error'}
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                />
                {subscription?.cancelAtPeriodEnd && (
                  <Chip
                    label="Cancels at period end"
                    color="warning"
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Period Start:{' '}
                {subscription?.currentPeriodStart
                  ? new Date(subscription.currentPeriodStart)
<<<<<<< HEAD
                      .toLocaleDateString()
                  : '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary"
                          mb={2}>
                Period End:{' '}
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd)
                      .toLocaleDateString()
=======
                    .toLocaleDateString()
                  : '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary"
                mb={2}>
                Period End:{' '}
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd)
                    .toLocaleDateString()
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                  : '-'}
              </Typography>

              {/* Change Plan — Admin only */}
              {isAdmin && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2"
<<<<<<< HEAD
                              fontWeight="bold" mb={1}>
=======
                    fontWeight="bold" mb={1}>
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                    Change Plan
                  </Typography>
                  <Box display="flex" gap={1}>
                    <FormControl size="small"
<<<<<<< HEAD
                                 sx={{ minWidth: 140 }}>
=======
                      sx={{ minWidth: 140 }}>
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                      <InputLabel>Select Plan</InputLabel>
                      <Select
                        value={selectedPlan}
                        label="Select Plan"
<<<<<<< HEAD
                        onChange={(e) =>
                          setSelectedPlan(e.target.value)}>
                        <MenuItem value="FREE">
                          FREE — $0/mo
                        </MenuItem>
                        <MenuItem value="BASIC">
                          BASIC — $29/mo
                        </MenuItem>
                        <MenuItem value="PRO">
                          PRO — $99/mo
                        </MenuItem>
=======
                        onChange={(e) => setSelectedPlan(e.target.value)}
                      >

                        <MenuItem value="FREE">
                          FREE — $0/mo
                        </MenuItem>

                        <MenuItem value="BASIC">
                          BASIC — $29/mo
                        </MenuItem>

                        <MenuItem value="PRO">
                          PRO — $99/mo
                        </MenuItem>

                        <MenuItem value="ENTERPRISE"
                        disabled>
                          ENTERPRISE — Contact Sales
                        </MenuItem>

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={changePlan}
                      disabled={!selectedPlan}>
                      Update
                    </Button>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={cancelSubscription}
                    disabled={subscription?.cancelAtPeriodEnd}>
                    {subscription?.cancelAtPeriodEnd
                      ? 'Cancellation Scheduled'
                      : 'Cancel Subscription'}
                  </Button>
                </>
              )}
            </Paper>
          </Grid>

          {/* Payment Method — Admin only */}
          {isAdmin && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Payment Method
                </Typography>

                {paymentMethod ? (
                  <Box mb={2}>
                    <Typography>
                      <b>{paymentMethod.cardBrand}</b>
                      {' ending in '}
                      <b>****{paymentMethod.cardLastFour}</b>
                    </Typography>
                    <Typography variant="body2"
<<<<<<< HEAD
                                color="text.secondary">
=======
                      color="text.secondary">
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                      Added:{' '}
                      {new Date(paymentMethod.addedAt)
                        .toLocaleDateString()}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary" mb={2}>
                    No payment method on file.
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2"
<<<<<<< HEAD
                            fontWeight="bold" mb={1}>
=======
                  fontWeight="bold" mb={1}>
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                  {paymentMethod ? 'Update Card' : 'Add Card'}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  sx={{ mb: 1 }}
                  placeholder="1234567890123456"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Card Brand"
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="VISA / MASTERCARD"
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={addPaymentMethod}>
                  {paymentMethod ? 'Update Card' : 'Add Card'}
                </Button>
              </Paper>
            </Grid>
          )}

          {/* Invoice History */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Invoice History
              </Typography>

              {invoices.length === 0 ? (
                <Typography color="text.secondary"
<<<<<<< HEAD
                            textAlign="center" py={3}>
=======
                  textAlign="center" py={3}>
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                  No invoices yet. They appear after each
                  billing cycle.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><b>Period</b></TableCell>
                        <TableCell><b>Base Amount</b></TableCell>
                        <TableCell><b>Usage Amount</b></TableCell>
                        <TableCell><b>Total</b></TableCell>
                        <TableCell><b>API Calls</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id} hover>
                          <TableCell>
                            {new Date(inv.periodStart)
                              .toLocaleDateString()}
                            {' → '}
                            {new Date(inv.periodEnd)
                              .toLocaleDateString()}
                          </TableCell>
                          <TableCell>${inv.baseAmount}</TableCell>
                          <TableCell>${inv.usageAmount}</TableCell>
                          <TableCell>
                            <b>${inv.totalAmount}</b>
                          </TableCell>
                          <TableCell>{inv.apiCallCount}</TableCell>
                          <TableCell>
                            <Chip
                              label={inv.status}
                              size="small"
                              color={inv.status === 'PAID'
<<<<<<< HEAD
                                     ? 'success' : 'warning'}
=======
                                ? 'success' : 'warning'}
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}

export default BillingPage;