'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import './styles/globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <head>
        <title>{isAdminRoute ? 'Admin Dashboard' : 'My Website'}</title>
      </head>
      <body>
        {isAdminRoute ? (
          <div className="flex h-screen bg-[#f7fffd]">
            <Sidebar />
            <div className="flex-1 p-6 bg-[#F2EFE7] overflow-auto">
              {children}
            </div>
          </div>
        ) : (
          <>
            {!isAuthPage && <Navbar />}
            <main>{children}</main>
            {!isAuthPage && <Footer />}
          </>
        )}
      </body>
    </html>
  );
}
