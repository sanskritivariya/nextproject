'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../lib/firebase';
interface FormErrors {
  name?: string;
  city?: string;
  state?: string;
  green?: string;
  yellow?: string;
}

const CreateSignalPage = () => {
  const router = useRouter();
  const db = getFirestore(app);


  const [form, setForm] = useState({
    name: '',
    city: '',
    state: '',
    roads: 4,
    timings: {
      green: 30,
      yellow: 5,
    },
  });

const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e:any) => {
    const { name, value } = e.target;

    if (name === 'green' || name === 'yellow') {
      setForm((prev) => ({
        ...prev,
        timings: { ...prev.timings, [name]: Number(value) },
      }));
    } else if (name === 'roads') {
      setForm((prev) => ({ ...prev, roads: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = 'Signal name is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.timings.green) newErrors.green = 'Green duration required';
    if (!form.timings.yellow) newErrors.yellow = 'Yellow duration required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'signals'), {
        ...form,
        emergencyActive: false,
        currentDirection: 0,
        remainingTime: form.timings.green,
        lastUpdated: new Date(),
      });
      router.push('/trafficManagemen');
    } catch (err) {
      console.error('Error creating signal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 3, maxHeight: 'calc(100vh - 200px)', // adjust as needed based on header height
    overflowY: 'auto', }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => router.back()}
      >
        Back
      </Button>

      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 600,
          mx: 'auto',
          borderRadius: 3,
          backgroundColor: '#fdfdfd',
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Create New Traffic Signal
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Signal Name"
              name="name"
              fullWidth
              required
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="City"
                name="city"
                fullWidth
                required
                value={form.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
              <TextField
                label="State"
                name="state"
                fullWidth
                required
                value={form.state}
                onChange={handleChange}
                error={!!errors?.state}
                helperText={errors.state}
              />
            </Stack>

            <TextField
              label="Number of Roads"
              name="roads"
              select
              fullWidth
              value={form.roads}
              onChange={handleChange}
            >
              {[3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}-Way
                </MenuItem>
              ))}
            </TextField>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Green Duration (sec)"
                name="green"
                type="number"
                fullWidth
                value={form.timings.green}
                onChange={handleChange}
                error={!!errors.green}
                helperText={errors.green}
              />
              <TextField
                label="Yellow Duration (sec)"
                name="yellow"
                type="number"
                fullWidth
                value={form.timings.yellow}
                onChange={handleChange}
                error={!!errors.yellow}
                helperText={errors.yellow}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? 'Creating...' : 'Create Signal'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateSignalPage;
