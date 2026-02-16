/**
 * Panel Layout
 * 
 * panel.fatosyilmazcasting.com → Admin Panel
 * Sidebar, TopNav ve dashboard components burada
 */
export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="panel-site min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
