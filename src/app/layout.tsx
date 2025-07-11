import './globals.css';
import ProtectedRoutes from './hoc/protectedRoutes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body style={{ margin: 0, padding: 0 }}>
        <ProtectedRoutes>{children}</ProtectedRoutes>
      </body>
    </html>
  );
}
