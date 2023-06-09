import { ReactNode } from 'react';
import Header from './Header';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />

      <main className="page-main">{children}</main>
    </>
  );
};

export default MainLayout;
