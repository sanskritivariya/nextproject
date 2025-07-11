import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import WelcomePage from '@/app/welcomePage/page';
import { Const } from '@/constant/const';
import SideBar from './sideBar';
import MainLayout from '@/common/mainLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathName = usePathname();

  return (
    <>
      <SideBar>
        {pathName === Const?.routes?.home && (
          <div>
            <WelcomePage />
          </div>
        )}
      </SideBar>
      <MainLayout>{children}</MainLayout>
    </>
  );
};

export default Layout;
