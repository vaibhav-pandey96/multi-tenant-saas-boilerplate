import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

<<<<<<< HEAD
=======

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
<<<<<<< HEAD
    Select,
    MenuItem,
=======
    TextField,
    Select,
    MenuItem
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
} from "@mui/material";

import api from "../api/axios";
import Navbar from "../components/Navbar";

function CompanyDetailsPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
<<<<<<< HEAD
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
=======
    const [message, setMessage] = useState("");
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [confirmCompanyName, setConfirmCompanyName] = useState("");
    const [deleting, setDeleting] = useState(false);
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135

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

    const changePlan = async () => {

        try {

            setSaving(true);

            await api.put(
                `/api/superadmin/company/${id}/plan`,
                {
                    plan: selectedPlan,
                }
            );

<<<<<<< HEAD
            setSuccess("Subscription updated successfully.");
=======
            setMessage("Subscription updated successfully.");
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135

            setDialogOpen(false);

            fetchCompany();

        } catch (err) {

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to update subscription."
            );

        } finally {

            setSaving(false);

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

<<<<<<< HEAD
=======
    const changeStatus = async () => {

        try {

            setProcessing(true);
            setError("");
            setMessage("");

            const newStatus =
                company.status === "ACTIVE"
                    ? "SUSPENDED"
                    : "ACTIVE";

            await api.put(
                `/api/superadmin/company/${id}/status`,
                {
                    status: newStatus
                }
            );

            setMessage(
                `Company ${newStatus === "ACTIVE"
                    ? "activated"
                    : "suspended"
                } successfully.`
            );

            fetchCompany();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to update company status."
            );

        } finally {

            setProcessing(false);

        }

    };

    const deleteCompany = async () => {

        try {

            setDeleting(true);
            setError("");
            setMessage("");

            await api.delete(`/api/superadmin/company/${id}`);

            setMessage("Company deleted successfully.");

            setDeleteDialogOpen(false);
            setConfirmCompanyName("");

            navigate("/superadmin");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.response?.data ||
                "Failed to delete company."
            );

        } finally {

            setDeleting(false);

        }

    };

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
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

        <Box>

            <Navbar />

<<<<<<< HEAD
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

            {/* Error Message */}
            {error && (
=======
            {error && (

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
<<<<<<< HEAD
            )}

            {/* Success Message */}
            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}


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

                    <Button
                        variant="contained"
                        disabled={!company}
                        onClick={() => {

                            setSelectedPlan(company.plan);
                            setDialogOpen(true);

                        }}
                    >
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

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>

                    Change Subscription Plan

=======

            )}

            {message && (

                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setMessage("")}
                >
                    {message}
                </Alert>

            )}

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

                        <Button
                            variant="contained"
                            disabled={!company}
                            onClick={() => {

                                setSelectedPlan(company.plan);
                                setDialogOpen(true);

                            }}
                        >
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
                        color={
                            company.status === "ACTIVE"
                                ? "warning"
                                : "success"
                        }
                        disabled={processing}
                        onClick={changeStatus}
                    >
                        {company.status === "ACTIVE"
                            ? "Suspend Company"
                            : "Activate Company"}
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
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Delete Company
                    </Button>

                </Paper>

                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    fullWidth
                    maxWidth="sm"
                >

                    <DialogTitle>

                        Change Subscription Plan

                    </DialogTitle>

                    <DialogContent>

                        <FormControl
                            fullWidth
                            sx={{ mt: 2 }}
                        >

                            <InputLabel>
                                Plan
                            </InputLabel>

                            <Select
                                value={selectedPlan}
                                label="Plan"
                                onChange={(e) => setSelectedPlan(e.target.value)}
                            >

                                {["FREE", "BASIC", "PRO", "ENTERPRISE"].map((plan) => (

                                    <MenuItem
                                        key={plan}
                                        value={plan}
                                        disabled={plan === company.plan}
                                    >
                                        {plan}

                                        {plan === company.plan && " (Current Plan)"}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() =>
                                setDialogOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={changePlan}
                            disabled={
                                saving ||
                                selectedPlan === company.plan
                            }
                        >

                            {saving
                                ? "Saving..."
                                : "Update"}

                        </Button>

                    </DialogActions>

                </Dialog>

            </Box >

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle color="error">
                    Delete Company
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                </DialogTitle>

                <DialogContent>

<<<<<<< HEAD
                    <FormControl
                        fullWidth
                        sx={{ mt: 2 }}
                    >

                        <InputLabel>
                            Plan
                        </InputLabel>

                        <Select
                            value={selectedPlan}
                            label="Plan"
                            onChange={(e) => setSelectedPlan(e.target.value)}
                        >

                            {["FREE", "BASIC", "PRO", "ENTERPRISE"].map((plan) => (

                                <MenuItem
                                    key={plan}
                                    value={plan}
                                    disabled={plan === company.plan}
                                >
                                    {plan}

                                    {plan === company.plan && " (Current Plan)"}

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>
=======
                    <Typography mb={2}>

                        This action <b>cannot be undone.</b>

                    </Typography>

                    <Typography mb={3}>

                        Type the company name
                        <b> "{company?.name}" </b>
                        to confirm deletion.

                    </Typography>

                    <TextField
                        fullWidth
                        label="Company Name"
                        value={confirmCompanyName}
                        onChange={(e) =>
                            setConfirmCompanyName(e.target.value)
                        }
                    />
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135

                </DialogContent>

                <DialogActions>

                    <Button
<<<<<<< HEAD
                        onClick={() =>
                            setDialogOpen(false)
                        }
=======
                        onClick={() => {

                            setDeleteDialogOpen(false);
                            setConfirmCompanyName("");

                        }}
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                    >
                        Cancel
                    </Button>

                    <Button
<<<<<<< HEAD
                        variant="contained"
                        onClick={changePlan}
                        disabled={
                            saving ||
                            selectedPlan === company.plan
                        }
                    >

                        {saving
                            ? "Saving..."
                            : "Update"}

=======
                        color="error"
                        variant="contained"
                        onClick={deleteCompany}
                        disabled={
                            confirmCompanyName !== company?.name ||
                            deleting
                        }
                    >
                        {deleting ? "Deleting..." : "Delete Company"}
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                    </Button>

                </DialogActions>

            </Dialog>

<<<<<<< HEAD
        </Box >

=======
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
        </Box>

    );

}

export default CompanyDetailsPage;