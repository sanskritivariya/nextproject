'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { useParams } from 'next/navigation';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { app } from '../../../firebase';

interface Signal {
  id: string;
  name: string;
  city: string;
  state: string;
  roads: number;
  timings: {
    green: number;
    yellow: number;
  };
  currentDirection: number;
  remainingTime: number;
  emergencyActive: boolean;
}

const directions = ['North', 'East', 'South', 'West', 'Extra'];

export default function ViewSignalPage() {
  const db = getFirestore(app);
  const [signal, setSignal] = useState<Signal | null>(null);
  const [emergencyDirection, setEmergencyDirection] = useState<number>(0);
  const [pausedDirection, setPausedDirection] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const params = useParams();
  const id = params.id as string;
  // Fetch signal
  useEffect(() => {
    const docRef = doc(db, 'signals', id);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        delete (data as any).id;
        setSignal({
          ...(data as Signal),
          id: snap.ref.id,
        });
      }
    });

    return () => unsub();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!signal || signal.emergencyActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          const nextDir = (signal.currentDirection + 1) % signal.roads;
          updateDoc(doc(db, 'signals', signal.id), {
            currentDirection: nextDir,
            remainingTime: signal.timings.green,
            lastUpdated: new Date(),
          });
          return signal.timings.green;
        } else {
          const updatedTime = prev - 1;
          updateDoc(doc(db, 'signals', signal.id), {
            remainingTime: updatedTime,
          });
          return updatedTime;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [signal?.emergencyActive, signal?.currentDirection]);

  const toggleEmergency = async () => {
    if (!signal) return;

    const signalRef = doc(db, 'signals', signal.id);

    if (!signal.emergencyActive) {
      // Emergency is being activated
      setPausedDirection(signal.currentDirection);
      setPausedTime(timer);

      await updateDoc(signalRef, {
        emergencyActive: true,
        currentDirection: emergencyDirection,
        remainingTime: signal.timings.green,
        lastUpdated: new Date(),
      });
    } else {
      // Emergency is being cancelled
      await updateDoc(signalRef, {
        emergencyActive: false,
        currentDirection: pausedDirection,
        remainingTime: signal.timings.green, // force fresh green cycle
        lastUpdated: new Date(),
      });

      // Reset paused state
      setPausedDirection(null);
      setPausedTime(null);
    }
  };

  if (!signal) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box px={3} py={4}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {signal.name} - {signal.city}, {signal.state}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        {Array.from({ length: signal.roads }).map((_, i) => (
          <Box
            key={i}
            p={3}
            borderRadius={2}
            border={
              '2px solid ' + (i === signal.currentDirection ? 'green' : '#ccc')
            }
            width={150}
            textAlign="center"
            bgcolor={i === signal.currentDirection ? '#e8f5e9' : 'white'}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {directions[i] || `Road ${i + 1}`}
            </Typography>
            <Typography
              fontSize={48}
              color={
                i === signal.currentDirection
                  ? signal.emergencyActive
                    ? 'green'
                    : timer <= 5
                    ? 'gold'
                    : 'green'
                  : 'grey'
              }
              fontWeight="bold"
            >
              {i === signal.currentDirection
                ? signal.emergencyActive
                  ? '🟢'
                  : timer <= 5
                  ? '🟡'
                  : '🟢'
                : '🔴'}
            </Typography>

            {i === signal.currentDirection && (
              <>
                <Typography color="text.secondary">{timer}s left</Typography>

                {signal.emergencyActive && (
                  <>
                    <Typography color="error" fontWeight="bold" mt={1}>
                      🚨 Emergency
                    </Typography>

                    {pausedDirection !== null && (
                      <Typography color="text.secondary" mt={1}>
                        ⏸ Will resume {directions[pausedDirection]} with{' '}
                        {pausedTime}s
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography>Select Emergency Direction:</Typography>
        <select
          value={emergencyDirection}
          disabled={signal.emergencyActive}
          onChange={(e) => setEmergencyDirection(Number(e.target.value))}
        >
          {Array.from({ length: signal.roads }).map((_, i) => (
            <option key={i} value={i}>
              {directions[i] || `Road ${i + 1}`}
            </option>
          ))}
        </select>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color={signal.emergencyActive ? 'error' : 'warning'}
          onClick={toggleEmergency}
        >
          {signal.emergencyActive ? 'Cancel Emergency' : 'Trigger Emergency'}
        </Button>
      </Stack>
    </Box>
  );
}
