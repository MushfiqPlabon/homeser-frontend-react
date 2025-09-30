// UserManagement.jsx
// Component for managing user accounts in admin panel

import {
  ArrowTrendingUpIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  usePromoteUserMutation,
  useUpdateAdminUserMutation,
} from "../store/extendedApiSlice";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate unique IDs for form elements
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();

  const {
    data: apiUsers,
    isLoading,
    isError,
    refetch,
  } = useGetAdminUsersQuery();
  const [_updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();
  const [promoteUser, { isLoading: isPromoting }] = usePromoteUserMutation();

  useState(() => {
    if (apiUsers) {
      setUsers(apiUsers);
    }
  }, [apiUsers]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        refetch(); // Refresh the user list
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await promoteUser(userId);
      refetch(); // Refresh the user list
    } catch (error) {
      console.error("Failed to promote user:", error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" className="btn-primary">
            Add New User
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load users</div>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.is_staff || user.is_superuser
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {user.is_staff || user.is_superuser
                          ? "Admin"
                          : "Customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {!(user.is_staff || user.is_superuser) && (
                          <button
                            type="button"
                            onClick={() => handlePromoteUser(user.id)}
                            disabled={isPromoting}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                            title="Promote to Admin"
                          >
                            <ArrowTrendingUpIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit User
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={firstNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id={firstNameId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  defaultValue={editingUser.first_name}
                />
              </div>
              <div>
                <label
                  htmlFor={lastNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id={lastNameId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  defaultValue={editingUser.last_name}
                />
              </div>
              <div>
                <label
                  htmlFor={emailId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id={emailId}
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  defaultValue={editingUser.email}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
