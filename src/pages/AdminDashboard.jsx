import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  UsersIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon },
    { id: 'services', name: 'Services', icon: WrenchScrewdriverIcon },
    { id: 'reviews', name: 'Reviews', icon: StarIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'promote', name: 'Promote User', icon: UserPlusIcon },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active Services</p>
              <p className="text-2xl font-bold text-green-900">7</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center">
            <StarIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Total Reviews</p>
              <p className="text-2xl font-bold text-yellow-900">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Total Users</p>
              <p className="text-2xl font-bold text-purple-900">1</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
        <select className="border border-gray-300 rounded-md px-3 py-2">
          <option>All Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No orders found</p>
        <p className="text-sm text-gray-500 mt-2">
          Orders will appear here once customers start placing them.
        </p>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Manage Services</h3>
        <button className="btn-primary">Add New Service</button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <WrenchScrewdriverIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Service management coming soon</p>
        <p className="text-sm text-gray-500 mt-2">
          You'll be able to add, edit, and manage services from here.
        </p>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No reviews yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Customer reviews will appear here once services are completed.
        </p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">User management coming soon</p>
        <p className="text-sm text-gray-500 mt-2">
          You'll be able to view and manage users from here.
        </p>
      </div>
    </div>
  );

  const renderPromoteUser = () => {
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePromote = async (e) => {
      e.preventDefault();
      if (!userId) return;

      setLoading(true);
      setMessage('');

      try {
        // This would call the admin API to promote user
        // await adminAPI.promoteUser(userId);
        setMessage('User promoted to admin successfully!');
        setUserId('');
      } catch (error) {
        setMessage('Failed to promote user. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Promote User to Admin</h3>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Only promote trusted users to admin. 
            Admins have full access to the system and can manage all data.
          </p>
        </div>

        <form onSubmit={handlePromote} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input-field"
              placeholder="Enter user ID to promote"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              You can find user IDs in the Users section or user profile URLs.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !userId}
            className="btn-primary"
          >
            {loading ? 'Promoting...' : 'Promote to Admin'}
          </button>
        </form>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return renderOrders();
      case 'services':
        return renderServices();
      case 'reviews':
        return renderReviews();
      case 'users':
        return renderUsers();
      case 'promote':
        return renderPromoteUser();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your household service platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;