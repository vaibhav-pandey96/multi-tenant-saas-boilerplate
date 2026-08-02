import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
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

  const activeCompanies = tenants.filter(
    (t) => t.status === "ACTIVE"
  ).length;

  const trialCompanies = tenants.filter(
    (t) => t.status === "TRIAL"
  ).length;

  const suspendedCompanies = tenants.filter(
    (t) => t.status === "SUSPENDED"
  ).length;

  const getPlanColor = (plan) => {

    switch (plan) {

      case "FREE":
        return "default";

      case "BASIC":
        return "info";

      case "PRO":
        return "secondary";

      case "ENTERPRISE":
        return "success";

      default:
        return "default";

    }
  };

  const getStatusColor = (status) => {

    switch (status) {

      case "ACTIVE":
        return "success";

      case "TRIAL":
        return "warning";

      case "SUSPENDED":
        return "error";

      default:
        return "default";

    }
  };

  return (

    <Box sx={{ p: 4 }}>

      {/* Header */}

      <Box mb={4}>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Platform Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mt={1}
        >
          Monitor companies, subscriptions, billing and platform health.
        </Typography>

      </Box>

      {error && (

        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>

      )}

      {/* Dashboard Cards */}

      <Grid
        container
        spacing={3}
        mb={4}
      >

        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Companies
              </Typography>

              <Typography variant="h4">
                {tenants.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Users
              </Typography>

              <Typography variant="h4">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                API Calls
              </Typography>

              <Typography variant="h4">
                {totalApiCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Active
              </Typography>

              <Typography variant="h4">
                {activeCompanies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Trial
              </Typography>

              <Typography variant="h4">
                {trialCompanies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Suspended
              </Typography>

              <Typography variant="h4">
                {suspendedCompanies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Companies Table */}

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden"
        }}
      >

        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #eee"
          }}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Company Management
          </Typography>

        </Box>

        {loading ? (

          <Box
            display="flex"
            justifyContent="center"
            py={6}
          >
            <CircularProgress />
          </Box>

        ) : tenants.length === 0 ? (

          <Typography
            py={5}
            align="center"
            color="text.secondary"
          >
            No companies registered yet.
          </Typography>

        ) : (

          <TableContainer>

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
                    <b>Status</b>
                  </TableCell>

                  <TableCell>
                    <b>Users</b>
                  </TableCell>

                  <TableCell>
                    <b>API Calls</b>
                  </TableCell>

                  <TableCell>
                    <b>Created</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {tenants.map((tenant) => (

                  <TableRow
                    hover
                    key={tenant.id}
                  >

                    <TableCell>

                      <Typography fontWeight={600}>
                        {tenant.name}
                      </Typography>

                    </TableCell>

                    <TableCell>

                      <Chip
                        label={tenant.plan}
                        color={getPlanColor(tenant.plan)}
                        size="small"
                      />

                    </TableCell>

                    <TableCell>

                      <Chip
                        label={tenant.status}
                        color={getStatusColor(tenant.status)}
                        size="small"
                      />

                    </TableCell>

                    <TableCell>

                      {tenant.userCount}

                    </TableCell>

                    <TableCell>

                      {tenant.apiCallCount.toLocaleString()}

                    </TableCell>

                    <TableCell>

                      {dayjs(tenant.createdAt).format("DD MMM YYYY")}

                    </TableCell>

                    <TableCell align="center">

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/superadmin/company/${tenant.id}`)
                        }
                      >
                        Manage
                      </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </Paper>

    </Box>

  );

}

export default SuperAdminPage;