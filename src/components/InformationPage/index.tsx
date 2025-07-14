'use client';
import React, { useEffect, useState } from 'react';
import { ref, push, update, get } from 'firebase/database';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { database } from '../../../firebase';

const UserForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // "edit" mode if this exists

  const [formData, setFormData] = useState({
    username: '',
    userplace: '',
    amountPaid: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data if editing
  useEffect(() => {
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setFormData({
              username: data.username || '',
              userplace: data.userplace || '',
              amountPaid: data.amountPaid?.toString() || '',
            });
          }
        })
        .catch(() => {
          setError('Failed to fetch user data.');
        });
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      if (userId) {
        // 🔄 Update existing user
        const userRef = ref(database, `users/${userId}`);
        await update(userRef, {
          username: formData.username,
          userplace: formData.userplace,
          amountPaid: parseFloat(formData.amountPaid),
        });
      } else {
        // ➕ Create new user
        const usersRef = ref(database, 'users');
        await push(usersRef, {
          username: formData.username,
          userplace: formData.userplace,
          amountPaid: parseFloat(formData.amountPaid),
          createdAt: new Date().toISOString(),
        });
      }

      setSuccess(true);
      setFormData({ username: '', userplace: '', amountPaid: '' });

      // Optionally redirect back to list after delay
      setTimeout(() => router.push('/infoPage/UserList'), 1000);
    } catch (err:any) {
      setError(err);
    }
  };

  return (
    <div className="container">
      <Paper
        sx={{
          p: 4,
          maxWidth: 500,
          mx: 'auto',
          mt: 6,
          background:
            'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
            background:
              'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/infoPage/UserList')}
          >
            View User List
          </Button>
        </Box>
        <Typography variant="h5" mb={2}>
          {userId ? 'Edit User Info' : 'Add User Info'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="User Place"
            name="userplace"
            value={formData.userplace}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Amount Paid"
            name="amountPaid"
            type="number"
            value={formData.amountPaid}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              inputProps: {
                style: { MozAppearance: 'textfield' }, // For Firefox
                step: 'any',
                min: 0,
              },
              // Hide arrows for Chrome, Safari, Edge, Opera
              sx: {
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                  {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
              },
            }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {userId ? 'Update' : 'Submit'}
          </Button>

          {success && (
            <Typography color="green" mt={2}>
              {userId
                ? 'Data updated successfully!'
                : 'Data submitted successfully!'}
            </Typography>
          )}
          {error && (
            <Typography color="red" mt={2}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </div>
  );
};

export default UserForm;
