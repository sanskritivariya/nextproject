'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../lib/firebase';

import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
} from '@mui/material';

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

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'green' || name === 'yellow') {
      setForm((prev) => ({
        ...prev,
        timings: {
          ...prev.timings,
          [name]: Number(value),
        },
      }));
    } else if (name === 'roads') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'signals'), {
        ...form,
        emergencyActive: false,
        currentDirection: 0,
        remainingTime: form.timings.green,
        lastUpdated: new Date(),
      });
      router.push('/');
    } catch (err) {
      console.error('Error creating signal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 600 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Create New Traffic Signal
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Signal Name"
              name="name"
              fullWidth
              required
              value={form.name}
              onChange={handleChange}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                name="city"
                fullWidth
                required
                value={form.city}
                onChange={handleChange}
              />
              <TextField
                label="State"
                name="state"
                fullWidth
                required
                value={form.state}
                onChange={handleChange}
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

            <Stack direction="row" spacing={2}>
              <TextField
                label="Green Duration (sec)"
                name="green"
                type="number"
                fullWidth
                value={form.timings.green}
                onChange={handleChange}
              />
              <TextField
                label="Yellow Duration (sec)"
                name="yellow"
                type="number"
                fullWidth
                value={form.timings.yellow}
                onChange={handleChange}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
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
