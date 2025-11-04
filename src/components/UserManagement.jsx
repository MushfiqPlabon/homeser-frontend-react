// UserManagement.jsx
// Component for managing user accounts in admin panel using generic CRUD component

import {
  ArrowTrendingUpIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import GenericCRUDManagement from "./GenericCRUDManagement";
import {
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  usePromoteUserMutation,
  useUpdateAdminUserMutation,
} from "../store/extendedApiSlice";

const UserManagement = () => {
  const { data: users, isLoading, isError, refetch } = useGetAdminUsersQuery();

  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteAdminUserMutation();
  const [promoteUser] = usePromoteUserMutation();

  // Define columns for the users table
  const userColumns = [
    {
      key: "user_info",
      header: "User",
      renderCell: (user) => (
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10">
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
      ),
    },
    {
      key: "email",
      header: "Email",
      renderCell: (user) => user.email,
    },
    {
      key: "role",
      header: "Role",
      renderCell: (user) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              user.is_staff || user.is_superuser
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
        >
          {user.is_staff || user.is_superuser ? "Admin" : "Customer"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      renderCell: (user) => (
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
      ),
    },
  ];

  // Define form fields for updating users
  const updateUserFields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
  ];

  // Define custom actions for users
  const customUserActions = [
    {
      icon: ArrowTrendingUpIcon,
      className: "text-indigo-600 hover:text-indigo-900",
      title: "Promote to Admin",
      onClick: (user) => {
        if (!user.is_staff && !user.is_superuser) {
          if (
            window.confirm(
              "Are you sure you want to promote this user to admin?",
            )
          ) {
            promoteUser(user.id);
          }
        }
      },
    },
  ];

  return (
    <GenericCRUDManagement
      title="Manage Users"
      searchPlaceholder="Search users..."
      columns={userColumns}
      data={users || []}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      onCreate={null} // Disable create functionality for users
      onUpdate={async ({ id, data }) => {
        await updateUser({ id, userData: data });
      }}
      onDelete={async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
          await deleteUser(id);
        }
      }}
      updateFormFields={updateUserFields}
      hasCreate={false} // Disable create functionality for users
      hasUpdate={true}
      hasDelete={true}
      customRowActions={customUserActions}
    />
  );
};

export default UserManagement;
