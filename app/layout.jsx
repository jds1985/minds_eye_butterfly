import './globals.css';

export const metadata = {
  title: "Minds Eye Butterfly Studio",
  description: "Fine Art & Creative Atelier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white min-h-screen">{children}</body>
    </html>
  );
}
