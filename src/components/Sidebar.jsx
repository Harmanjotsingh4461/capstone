import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-gray-300">🏠 Overview</Link>
        <Link to="/dashboard/stores" className="hover:text-gray-300">🏬 My Stores</Link>
        <Link to="/dashboard/products" className="hover:text-gray-300">📦 Products</Link>
        <Link to="/dashboard/orders" className="hover:text-gray-300">🧾 Orders</Link>
        <Link to="/dashboard/analytics" className="hover:text-gray-300">📊 Analytics</Link>
        <Link to="/dashboard/messages" className="hover:text-gray-300">💬 Messages</Link>
        <Link to="/dashboard/settings" className="hover:text-gray-300">⚙️ Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
