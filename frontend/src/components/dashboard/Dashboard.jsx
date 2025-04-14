import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../common/Navbar';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="dashboard" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {currentUser?.name || 'User'}!
            </h1>
            <p className="text-gray-600">
              This is your dashboard. More features coming soon!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 