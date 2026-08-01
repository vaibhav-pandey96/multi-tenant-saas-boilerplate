import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../api/axios";

function SuperAdminPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary invoice data (replace with API later)
  const invoices = [
    { id: 1, company: "ABC Pvt Ltd", amount: "₹999", status: "Paid" },
    { id: 2, company: "XYZ Technologies", amount: "₹1999", status: "Pending" },
  ];

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/superadmin/tenants");
      setTenants(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tenants.");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = tenants.reduce(
    (sum, tenant) => sum + (tenant.userCount || 0),
    0
  );

  const totalApiCalls = tenants.reduce(
    (sum, tenant) => sum + (tenant.apiCallCount || 0),
    0
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Platform Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Companies
              </Typography>
              <Typography variant="h4">
                {tenants.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total API Calls
              </Typography>
              <Typography variant="h4">
                {totalApiCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Invoices
              </Typography>
              <Typography variant="h4">
                {invoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Companies
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Company</b></TableCell>
                <TableCell><b>Plan</b></TableCell>
                <TableCell><b>Users</b></TableCell>
                <TableCell><b>API Calls</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.plan}</TableCell>
                  <TableCell>{tenant.userCount}</TableCell>
                  <TableCell>{tenant.apiCallCount}</TableCell>
                  <TableCell>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Recent Invoices
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Company</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.company}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={
                      invoice.status === "Paid"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default SuperAdminPage;