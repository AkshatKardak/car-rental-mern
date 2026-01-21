import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut, Car } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../assets/logo.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Get user from localStorage (you can use AuthContext instead)
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-background-dark-secondary shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
<div className="flex items-center">
  <Link to="/" className="flex items-center space-x-2">
    <img
      src={Logo}
      alt="RentRide Logo"
      className="w-10 h-10 object-contain"
    />
    <span className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
      RentRide
    </span>
  </Link>
</div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
            >
              Home
            </Link>
            <Link 
              to="/browsecars" 
              className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
            >
              Browse Cars
            </Link>
            <Link 
              to="/offers" 
              className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
            >
              Offers
            </Link>
            <Link 
              to="/aiassistant" 
              className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
            >
              AI Assistant
            </Link>
            <Link 
              to="/about" 
              className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
            >
              About
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/mybookings" 
                  className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
                >
                  My Bookings
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-text-primary dark:text-text-dark-primary hover:text-primary transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-text-primary dark:text-text-dark-primary hover:text-primary transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-background-secondary dark:bg-background-dark hover:bg-border-light dark:hover:bg-border-dark transition"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-text-primary" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-background-secondary dark:bg-background-dark"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-text-primary" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary dark:text-text-dark-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-background-dark-secondary border-t border-border-light dark:border-border-dark">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browsecars"
              className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            <Link
              to="/offers"
              className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Offers
            </Link>
            <Link
              to="/aiassistant"
              className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              AI Assistant
            </Link>
            <Link
              to="/about"
              className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/mybookings"
                  className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-text-primary dark:text-text-dark-primary hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block text-text-primary dark:text-text-dark-primary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
