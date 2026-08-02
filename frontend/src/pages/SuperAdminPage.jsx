import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Business,
  People,
  ApiOutlined,
  TrendingUp,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
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
    (sum, tenant) => sum + (tenant.userCount || 0),
    0
  );

  const totalApiCalls = tenants.reduce(
    (sum, tenant) => sum + (tenant.apiCallCount || 0),
    0
  );

  // Stat card component
  const StatCard = ({ icon, label, value, color }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        borderLeft: `5px solid ${color}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          bgcolor: `${color}18`,
          borderRadius: "50%",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          color={color}
          sx={{ lineHeight: 1.2 }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>

      <Navbar />

      <Box sx={{ p: 4 }}>

        {/* Page Header */}
        <Box
          sx={{
            bgcolor: "#1565C0",
            borderRadius: 3,
            p: 3,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={0.5}>
            Super Admin Dashboard 👑
          </Typography>
          <Typography sx={{ opacity: 0.85, fontSize: 15 }}>
            Platform-wide overview — companies, users and API
            usage statistics only. Individual user data is
            kept private per tenant.
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stat Cards */}
        <Grid container spacing={3} mb={4}>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={
                <Business
                  sx={{ color: "#1565C0", fontSize: 28 }}
                />
              }
              label="Total Companies"
              value={tenants.length}
              color="#1565C0"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={
                <People
                  sx={{ color: "#2E7D32", fontSize: 28 }}
                />
              }
              label="Total Users"
              value={totalUsers}
              color="#2E7D32"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={
                <ApiOutlined
                  sx={{ color: "#E65100", fontSize: 28 }}
                />
              }
              label="Total API Calls"
              value={totalApiCalls.toLocaleString()}
              color="#E65100"
            />
          </Grid>

        </Grid>

        {/* Companies Table */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>

          {/* Table Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #E3F2FD",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <TrendingUp sx={{ color: "#1565C0" }} />
            <Typography variant="h6" fontWeight="bold"
                        color="#1565C0">
              Registered Companies
            </Typography>
            <Chip
              label={`${tenants.length} total`}
              size="small"
              sx={{
                ml: 1,
                bgcolor: "#E3F2FD",
                color: "#1565C0",
                fontWeight: "bold",
              }}
            />
          </Box>

          {/* Table Body */}
          {loading ? (

            <Box
              display="flex"
              justifyContent="center"
              py={6}
            >
              <CircularProgress sx={{ color: "#1565C0" }} />
            </Box>

          ) : tenants.length === 0 ? (

            <Box py={6} textAlign="center">
              <Business
                sx={{ fontSize: 64, color: "#BBDEFB", mb: 2 }}
              />
              <Typography color="text.secondary" fontSize={16}>
                No companies have registered yet.
              </Typography>
            </Box>

          ) : (

            <TableContainer>
              <Table>

                <TableHead>
                  <TableRow sx={{ bgcolor: "#1565C0" }}>
                    <TableCell sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      # 
                    </TableCell>
                    <TableCell sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      Company Name
                    </TableCell>
                    <TableCell sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      Plan
                    </TableCell>
                    <TableCell sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      Total Users
                    </TableCell>
                    <TableCell sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      API Calls
                    </TableCell>
                    <TableCell sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tenants.map((tenant, index) => (
                    <TableRow
                      key={tenant.id}
                      hover
                      sx={{
                        bgcolor:
                          index % 2 === 0
                            ? "white"
                            : "#F3F8FF",
                        "&:hover": {
                          bgcolor: "#E3F2FD !important",
                        },
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Row Number */}
                      <TableCell>
                        <Box
                          sx={{
                            bgcolor: "#E3F2FD",
                            color: "#1565C0",
                            fontWeight: "bold",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                          }}
                        >
                          {index + 1}
                        </Box>
                      </TableCell>

                      {/* Company Name */}
                      <TableCell>
                        <Box display="flex"
                             alignItems="center" gap={1}>
                          <Business
                            sx={{
                              color: "#1565C0",
                              fontSize: 20,
                            }}
                          />
                          <Typography fontWeight="bold"
                                      fontSize={14}>
                            {tenant.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Plan */}
                      <TableCell>
                        <Chip
                          label={tenant.plan}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            bgcolor:
                              tenant.plan === "PRO"
                                ? "#FFEBEE"
                                : tenant.plan === "BASIC"
                                ? "#FFF3E0"
                                : "#E8F5E9",
                            color:
                              tenant.plan === "PRO"
                                ? "#C62828"
                                : tenant.plan === "BASIC"
                                ? "#E65100"
                                : "#2E7D32",
                          }}
                        />
                      </TableCell>

                      {/* Total Users — count only, not names */}
                      <TableCell>
                        <Box display="flex"
                             alignItems="center" gap={0.8}>
                          <People
                            sx={{
                              color: "#2E7D32",
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            fontWeight="bold"
                            color="#2E7D32"
                            fontSize={14}
                          >
                            {tenant.userCount}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* API Calls */}
                      <TableCell>
                        <Box display="flex"
                             alignItems="center" gap={0.8}>
                          <ApiOutlined
                            sx={{
                              color: "#E65100",
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            fontWeight="bold"
                            color="#E65100"
                            fontSize={14}
                          >
                            {(tenant.apiCallCount || 0)
                              .toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            bgcolor: "#E8F5E9",
                            color: "#2E7D32",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>

          )}

          {/* Table Footer */}
          {!loading && tenants.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #E3F2FD",
                display: "flex",
                justifyContent: "flex-end",
                gap: 3,
              }}
            >
              <Typography variant="body2"
                          color="text.secondary">
                Total Companies:{" "}
                <b style={{ color: "#1565C0" }}>
                  {tenants.length}
                </b>
              </Typography>
              <Typography variant="body2"
                          color="text.secondary">
                Total Users:{" "}
                <b style={{ color: "#2E7D32" }}>
                  {totalUsers}
                </b>
              </Typography>
              <Typography variant="body2"
                          color="text.secondary">
                Total API Calls:{" "}
                <b style={{ color: "#E65100" }}>
                  {totalApiCalls.toLocaleString()}
                </b>
              </Typography>
            </Box>
          )}

        </Paper>

        {/* Privacy Note */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "#E3F2FD",
            borderRadius: 2,
            borderLeft: "4px solid #1565C0",
          }}
        >
          <Typography
            variant="body2"
            color="#1565C0"
            fontWeight={500}
          >
            🔒 Privacy Note: Individual user details within
            each company are kept private and are only visible
            to that company's Tenant Admin. Super Admin sees
            aggregated statistics only.
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}

export default SuperAdminPage;