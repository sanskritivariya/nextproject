import './globals.css';
import ProtectedRoutes from './hoc/protectedRoutes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoutes>{children}</ProtectedRoutes>
      </body>
    </html>
  );
}
