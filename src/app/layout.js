import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "BookWell - Appointment Booking",
  description: "Book your next appointment in seconds",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased bg-background-light text-text-main overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
