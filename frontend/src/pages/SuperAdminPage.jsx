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
      setError("Failed to load platform statistics.");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = tenants.reduce(
    (sum, tenant) => sum + tenant.userCount,
    0
  );

  const totalApiCalls = tenants.reduce(
    (sum, tenant) => sum + tenant.apiCallCount,
    0
  );

  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h4" fontWeight="bold">
        Super Admin Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Platform-wide overview. Super Admin manages companies,
        subscriptions and platform health only.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard Cards */}

      <Grid container spacing={3} mb={4}>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

      </Grid>

      {/* Companies */}

      <Paper sx={{ p: 2 }}>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Registered Companies
        </Typography>

        {loading ? (

          <Box
            display="flex"
            justifyContent="center"
            py={5}
          >
            <CircularProgress />
          </Box>

        ) : tenants.length === 0 ? (

          <Typography
            align="center"
            color="text.secondary"
            py={4}
          >
            No companies have registered yet.
          </Typography>

        ) : (

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <b>Company</b>
                </TableCell>

                <TableCell>
                  <b>Plan</b>
                </TableCell>

                <TableCell>
                  <b>Total Users</b>
                </TableCell>

                <TableCell>
                  <b>API Calls</b>
                </TableCell>

                <TableCell>
                  <b>Status</b>
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {tenants.map((tenant) => (

                <TableRow key={tenant.id} hover>

                  <TableCell>{tenant.name}</TableCell>

                  <TableCell>

                    <Chip
                      label={tenant.plan}
                      color={
                        tenant.plan === "PREMIUM"
                          ? "primary"
                          : "default"
                      }
                      size="small"
                    />

                  </TableCell>

                  <TableCell>
                    {tenant.userCount}
                  </TableCell>

                  <TableCell>
                    {tenant.apiCallCount}
                  </TableCell>

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

    </Box>
  );
}

export default SuperAdminPage;