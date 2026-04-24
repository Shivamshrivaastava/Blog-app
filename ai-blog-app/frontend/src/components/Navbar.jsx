import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiPenTool, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <FiPenTool className="text-2xl" />
          <span>AI<span className="text-gray-900">Blog</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 transition font-medium">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition font-medium">Dashboard</Link>
              <Link to="/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center gap-1">
                <FiPenTool /> Write
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg">
                    <FiUser /> Profile
                  </Link>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <FiGrid /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg w-full">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-600 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">Dashboard</Link>
              <Link to="/create" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">Write Blog</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">Profile</Link>
              <button onClick={handleLogout} className="text-red-600 font-medium py-1 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
