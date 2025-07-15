// app/layout.tsx or app/page.tsx
import './globals.css';
import ProtectedRoutes from './hoc/protectedRoutes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <ProtectedRoutes>{children}</ProtectedRoutes>
      </body>
    </html>
  );
}
