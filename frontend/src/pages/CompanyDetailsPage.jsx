import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import api from "../api/axios";

function CompanyDetailsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {

    try {

      setLoading(true);

      const res = await api.get(`/api/superadmin/company/${id}`);

      setCompany(res.data);

    } catch (err) {

      console.error(err);

      setError("Failed to load company details.");

    } finally {

      setLoading(false);

    }

  };

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

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
        <CircularProgress />
      </Box>

    );

  }

  if (error) {

    return (

      <Box sx={{ p: 4 }}>

        <Alert severity="error">
          {error}
        </Alert>

      </Box>

    );

  }

  return (

    <Box sx={{ p: 4 }}>

      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => navigate("/superadmin")}
      >
        ← Back to Dashboard
      </Button>

      <Typography
        variant="h4"
        fontWeight="bold"
      >
        {company.name}
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Company Management
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Company
              </Typography>

              <Typography variant="h6">
                {company.name}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Subscription
              </Typography>

              <Chip
                label={company.plan}
                color={getPlanColor(company.plan)}
              />

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Status
              </Typography>

              <Chip
                label={company.status}
                color={getStatusColor(company.status)}
              />

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={3}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Created
              </Typography>

              <Typography variant="h6">

                {dayjs(company.createdAt)
                  .format("DD MMM YYYY")}

              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      <Grid container spacing={3} mt={1}>

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                Total Users
              </Typography>

              <Typography variant="h4">
                {company.userCount}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Typography color="text.secondary">
                API Calls
              </Typography>

              <Typography variant="h4">
                {company.apiCallCount.toLocaleString()}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Subscription
        </Typography>

        <Typography color="text.secondary" mb={2}>
          Current Plan
        </Typography>

        <Chip
          label={company.plan}
          color={getPlanColor(company.plan)}
          sx={{ mb: 3 }}
        />

        <Box>

          <Button variant="contained">

            Change Plan

          </Button>

        </Box>

      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Platform Controls
        </Typography>

        <Button
          variant="contained"
          color="warning"
        >
          Suspend Company
        </Button>

      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="error"
          mb={3}
        >
          Danger Zone
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography
          color="text.secondary"
          mb={3}
        >
          Permanently delete this company and all associated platform resources.
        </Typography>

        <Button
          variant="contained"
          color="error"
        >
          Delete Company
        </Button>

      </Paper>

    </Box>

  );

}

export default CompanyDetailsPage;