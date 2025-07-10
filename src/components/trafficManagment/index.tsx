'use client';

import { useEffect, useState } from 'react';

import { collection, onSnapshot, getFirestore } from 'firebase/firestore';
import Link from 'next/link';
import { app } from '../../../firebase';

interface Signal {
  id: string;
  name: string;
  city: string;
  state: string;
  roads: number;
}

export default function DashboardPage() {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    const firestore = getFirestore(app);
    const unsubscribe = onSnapshot(
      collection(firestore, 'signals'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Signal[];
        setSignals(data);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ marginLeft: 240, padding: '24px' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Traffic Signals</h1>
        <Link
          href="/trafficManagement/signal"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Signal
        </Link>
      </div>

      {signals.length === 0 ? (
        <p>No signals found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <Link
              key={signal.id}
              href={`/signal/${signal.id}`}
              className="block p-4 border rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{signal.name}</h2>
              <p className="text-sm text-gray-600">
                {signal.city}, {signal.state}
              </p>
              <p className="text-sm mt-1">🚦 {signal.roads}-way</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
