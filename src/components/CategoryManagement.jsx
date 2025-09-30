// CategoryManagement.jsx
// Component for managing service categories in admin panel

import {
  PencilIcon,
  PlusIcon,
  QueueListIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useCreateExtendedCategoryMutation,
  useDeleteExtendedCategoryMutation,
  useGetExtendedCategoriesQuery,
  useUpdateExtendedCategoryMutation,
} from "../store/extendedApiSlice";

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Generate unique IDs for form elements
  const categoryNameId = useId();
  const categoryDescriptionId = useId();
  const categoryImageUrlId = useId();
  const categoryIsActiveId = useId();

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetExtendedCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateExtendedCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateExtendedCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteExtendedCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  const handleCreateCategory = async () => {
    try {
      await createCategory(formData);
      setFormData({
        name: "",
        description: "",
        image_url: "",
        is_active: true,
      });
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory({ id: editingCategory.id, categoryData: formData });
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        image_url: "",
        is_active: true,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will affect all services in this category.",
      )
    ) {
      try {
        await deleteCategory(categoryId);
        refetch();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  // Filter categories based on search term
  const filteredCategories =
    categories?.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search categories..."
            className="px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Category
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load categories</div>
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
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
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <QueueListIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.services_count || 0} services
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            category.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(category);
                            setFormData({
                              name: category.name,
                              description: category.description,
                              image_url: category.image_url || "",
                              is_active: category.is_active,
                            });
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <QueueListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No categories found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search to find what you're looking for."
                  : "Get started by creating a new category."}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-1 inline" />
                  Add Category
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Category
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={categoryNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  id={categoryNameId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={categoryDescriptionId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id={categoryDescriptionId}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={categoryImageUrlId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  id={categoryImageUrlId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={categoryIsActiveId}
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={categoryIsActiveId}
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    name: "",
                    description: "",
                    image_url: "",
                    is_active: true,
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCreating}
                className="btn-primary"
              >
                {isCreating ? "Creating..." : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Category
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={categoryNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  id={categoryNameId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={categoryDescriptionId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id={categoryDescriptionId}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={categoryImageUrlId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  id={categoryImageUrlId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={categoryIsActiveId}
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={categoryIsActiveId}
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setFormData({
                    name: "",
                    description: "",
                    image_url: "",
                    is_active: true,
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateCategory}
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? "Updating..." : "Update Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
