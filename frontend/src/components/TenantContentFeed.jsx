import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Delete,
  AttachFile,
  Campaign
} from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, must match backend limit

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function TenantContentFeed() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fileInputRef = useRef(null);

  const fetchFeed = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/api/content');
      setItems(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to load company updates.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;

    if (selected && selected.size > MAX_FILE_SIZE) {
      setFormError('File too large. Max size is 10MB.');
      setFile(null);
      e.target.value = '';
      return;
    }

    setFormError('');
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }

    if (!body.trim() && !file) {
      setFormError('Add a message or attach a file (or both).');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    if (body.trim()) formData.append('body', body.trim());
    if (file) formData.append('file', file);

    setSubmitting(true);

    try {
      await api.post('/api/content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setTitle('');
      setBody('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      fetchFeed();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to post update.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (item) => {
    try {
      const res = await api.get(`/api/content/${item.id}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.fileName || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to download file.'
      );
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this update? This cannot be undone.');
    if (!ok) return;

    setProcessingId(id);
    setError('');

    try {
      await api.delete(`/api/content/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to delete update.'
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Campaign color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Company Updates
        </Typography>
      </Box>

      {isAdmin && (
        <>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Stack spacing={2}>
              {formError && <Alert severity="error">{formError}</Alert>}

              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                fullWidth
                required
              />

              <TextField
                label="Message (optional)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                size="small"
                fullWidth
                multiline
                minRows={2}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                  size="small"
                >
                  {file ? 'Change file' : 'Attach file (optional)'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                {file && (
                  <Chip
                    label={`${file.name} (${formatFileSize(file.size)})`}
                    onDelete={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    size="small"
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    submitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <CloudUpload />
                    )
                  }
                  disabled={submitting}
                  sx={{ ml: 'auto' }}
                >
                  Post
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">
          No updates yet from your company.
        </Typography>
      ) : (
        <List disablePadding>
          {items.map((item) => (
            <ListItem
              key={item.id}
              divider
              sx={{ px: 0, alignItems: 'flex-start' }}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  {item.hasFile && (
                    <IconButton
                      edge="end"
                      title="Download"
                      onClick={() => handleDownload(item)}
                    >
                      <Download />
                    </IconButton>
                  )}
                  {isAdmin && (
                    <IconButton
                      edge="end"
                      title="Delete"
                      disabled={processingId === item.id}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Typography fontWeight="bold">{item.title}</Typography>
                }
                secondary={
                  <>
                    {item.body && (
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ whiteSpace: 'pre-wrap', mb: 0.5 }}
                      >
                        {item.body}
                      </Typography>
                    )}
                    {item.hasFile && (
                      <Chip
                        icon={<AttachFile fontSize="small" />}
                        label={`${item.fileName} (${formatFileSize(item.fileSize)})`}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      {item.uploadedByName} ·{' '}
                      {dayjs(item.createdAt).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default TenantContentFeed;
