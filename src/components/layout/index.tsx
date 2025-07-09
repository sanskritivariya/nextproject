import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import WelcomePage from '@/app/welcomePage/page';
import { Const } from '@/constant/const';
import SideBar from './sideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const pathName = usePathname()
  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      localStorage.clear(); // 🔓 Clear localStorage
      // toast.success('Logout successful'); // ✅ Toast message
      setTimeout(() => {
        router.push('/'); // 🔁 Redirect to login page
      }, 1000); // Delay so user can see the toast
    } else {
      console.log(`Clicked: ${key}`);
    }
  };

  return (
    <>
      <SideBar>
         {pathName === Const?.routes?.home && (
        <div >
         <WelcomePage/>
        </div>
      )}
      </SideBar>
        {children}

    
    </>
    
    
    
  );
};

export default Layout;
