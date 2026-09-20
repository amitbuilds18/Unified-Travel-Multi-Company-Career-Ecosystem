import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white px-10 py-4 shadow">
      <h1 className="text-2xl font-bold">🌍 TravelEase</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/destinations">Destinations</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
