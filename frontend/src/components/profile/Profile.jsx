import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Navbar from '../common/Navbar';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement actual profile update logic with backend
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="profile" onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    variant="success"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setName(currentUser?.name || '');
                      setEmail(currentUser?.email || '');
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{email}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
