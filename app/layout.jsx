import './globals.css';

export const metadata = {
  title: "Minds Eye Butterfly Studio",
  description: "Fine Art & Creative Atelier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-zinc-950 text-white antialiased">{children}</body>
    </html>
  );
}
