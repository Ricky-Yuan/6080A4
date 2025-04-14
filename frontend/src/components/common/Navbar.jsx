import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = ({ currentPage, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">BigBrain</span>
            </div>
          </div>
          <div className="flex items-center">
            {currentPage === 'profile' && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
            {currentPage === 'dashboard' && (
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            )}
            <Button
              onClick={onLogout}
              variant="danger"
              className="ml-4"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 