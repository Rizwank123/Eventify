import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, CalendarDays, LogOut, Menu, User, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Eventify</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user.role === 'ORGANIZER' ? (
              <>
                <Link to="/organizer/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                  My Events
                </Link>
                <Link to="/organizer/events/create" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                  Create Event
                </Link>
              </>
            ) : (
              <>
                <Link to="/attendee/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                  Browse Events
                </Link>
                <Link to="/attendee/registrations" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                  My Registrations
                </Link>
              </>
            )}

            {/* Notifications */}
            <Link to="/notifications" className="relative text-gray-700 hover:text-blue-600 p-2 rounded-full">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <User className="h-5 w-5 mr-1" />
                <span>{user.username}</span>
              </button>
              <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="px-4 py-3">
                  <p className="text-sm leading-5 text-gray-900 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs leading-4 text-gray-500">
                    {user.role}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/notifications" className="relative text-gray-700 p-2 mr-2">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user.role === 'ORGANIZER' ? (
                <>
                  <Link
                    to="/organizer/events"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    My Events
                  </Link>
                  <Link
                    to="/organizer/events/create"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    Create Event
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/attendee/events"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    Browse Events
                  </Link>
                  <Link
                    to="/attendee/registrations"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    onClick={toggleMenu}
                  >
                    My Registrations
                  </Link>
                </>
              )}
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-3 py-2 text-sm text-gray-500">
                <p>Signed in as: <span className="font-medium">{user.username}</span></p>
                <p className="text-xs mt-1">Role: {user.role}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;