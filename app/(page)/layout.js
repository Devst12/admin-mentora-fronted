import Sidebar from "./components/sidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar/>
     
      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}