import "./globals.css";

export const metadata = {
  title: "Second Brain AI",
  description: "Shared AI Memory Workspace"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
