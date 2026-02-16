/**
 * Main Site Layout
 * 
 * fatosyilmazcasting.com → Public facing pages
 * Header, Footer ve shared components burada
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-site">
      {children}
    </div>
  );
}
