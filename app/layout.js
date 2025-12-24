



import './globals.css';
import SessionProvider from "./SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body

      >

        <SessionProvider>

          {children}
        </SessionProvider>

      </body>
    </html>
  );
}
