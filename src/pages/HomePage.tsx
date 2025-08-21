import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useRequireAuth } from '@hooks/useRequireAuth';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Protect this route - redirect to login if not authenticated
  useRequireAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center space-x-4 mb-6">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome, {user.name || 'User'}!
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Provider</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{user.provider}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo page showing successful authentication.
              You can use the auth hooks and components throughout your application.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};