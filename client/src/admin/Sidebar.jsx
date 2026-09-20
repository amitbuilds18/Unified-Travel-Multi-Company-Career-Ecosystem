import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/admin/superadmin">👑 Super Admin</Link>
        </li>
        <li>
          <Link to="/admin/add-destination">➕ Add Destination</Link>
        </li>
        <li>
          <Link to="/admin/destinations">📍 Destinations List</Link>
        </li>
      </ul>
    </div>
  );
}
