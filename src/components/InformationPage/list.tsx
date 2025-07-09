'use client'
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
    <div style={{ marginLeft: 240, padding: '24px' }}>
      <Box sx={{ mt: 5, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
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
          <Paper sx={{ overflowX: 'auto' }}>
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
                        color="primary"
                        onClick={() => router.push(`/infoPage?id=${key}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setDeleteId(key);
                          setOpen(true);
                        }}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default List;
