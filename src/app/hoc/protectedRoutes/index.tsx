'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Layout from '@/components/layout';
import LoginPageTest from '@/components/auth/loginnew';


const publicRoutes = ['/signupPage', '/reset-password']; // Add more public routes if needed

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const pathname = usePathname();

  const checkToken = () => {
    const storedToken = localStorage.getItem('uid');
    setToken(storedToken || null);
  };

  useEffect(() => {
    checkToken();

    const handleAuthChange = () => {
      checkToken();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  if (token === undefined) {
    return <div>Loading...</div>;
  }

  // ✅ Allow public routes without token
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // ✅ Authenticated routes
  return token ? <Layout>{children}</Layout> : <LoginPageTest />;
};

export default ProtectedRoutes;
