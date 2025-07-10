'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, onValue, remove } from 'firebase/database';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { database } from '../../../firebase';

interface User {
  username: string;
  userplace: string;
  amountPaid: number;
  createdAt?: string;
}

const List: React.FC = () => {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      const userRef = ref(database, `users/${deleteId}`);
      await remove(userRef);
      setOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div style={{ marginLeft: 240,padding: '24px' }}>
      <Box sx={{ mt: 5, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button
            variant="contained"
            sx={{
              ml: 1,
         background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
            }}
            // color="primary"
            onClick={() => router.push('/infoPage')}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom>
          User List
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper
            sx={{
              overflowX: 'auto',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
            }}
          >
            {Object.keys(users).length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Username</b>
                    </TableCell>
                    <TableCell>
                      <b>User Place</b>
                    </TableCell>
                    <TableCell>
                      <b>Amount Paid</b>
                    </TableCell>
                    <TableCell>
                      <b>Created At</b>
                    </TableCell>
                    <TableCell>
                      <b>Action</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(users).map(([key, user]) => (
                    <TableRow key={key}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.userplace}</TableCell>
                      <TableCell>{user.amountPaid}</TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => router.push(`/infoPage?id=${key}`)}
                          sx={{
                            ml: 1,
                            background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)'
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          // color="secondary"
                          onClick={() => {
                            setDeleteId(key);
                            setOpen(true);
                          }}
                          sx={{
                            ml: 1,
                            background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src="/no-data.svg"
                  alt="No data"
                  style={{ width: 120, marginBottom: 16, opacity: 0.7 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  No users found
                </Typography>
                <Typography variant="body2">
                  Please add users to see them listed here.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => router.push('/infoPage')}
                >
                  Add User
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
          }}
        >
          Delete Confirmation
        </DialogTitle>
        <DialogContent
          sx={{
            background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
          }}
        >
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
          }}
        >
          <Button
            onClick={() => setOpen(false)}
            sx={{
               background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default List;
