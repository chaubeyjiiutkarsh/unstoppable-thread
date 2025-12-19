import { Navbar } from "@/components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <ul className="space-y-2">
          <li>📦 Manage Orders</li>
          <li>🛍 Manage Products</li>
          <li>🌱 Manage Seed Data</li>
          <li>👤 Manage Users</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
