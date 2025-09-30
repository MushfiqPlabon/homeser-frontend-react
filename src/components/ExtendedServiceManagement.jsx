// ExtendedServiceManagement.jsx
// Component for managing extended services and categories with full CRUD operations

import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
  PencilIcon,
  PlusIcon,
  QueueListIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useCreateExtendedCategoryMutation,
  useCreateExtendedServiceMutation,
  useDeleteExtendedCategoryMutation,
  useDeleteExtendedServiceMutation,
  useGetExtendedCategoriesQuery,
  useGetExtendedServicesQuery,
  useUpdateExtendedCategoryMutation,
  useUpdateExtendedServiceMutation,
} from "../store/extendedApiSlice";

const ExtendedServiceManagement = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_desc: "",
    price: "",
    category: "",
    image_url: "",
    is_active: true,
  });

  // Generate unique IDs for form elements
  const serviceNameId = useId();
  const serviceShortDescId = useId();
  const serviceDescriptionId = useId();
  const servicePriceId = useId();
  const categorySelectId = useId();
  const imageUrlId = useId();
  const isActiveId = useId();

  // Services data and mutations
  const {
    data: services,
    isLoading: servicesLoading,
    isError: servicesError,
    refetch: refetchServices,
  } = useGetExtendedServicesQuery();

  const [createService, { isLoading: isCreatingService }] =
    useCreateExtendedServiceMutation();
  const [updateService, { isLoading: isUpdatingService }] =
    useUpdateExtendedServiceMutation();
  const [deleteService, { isLoading: isDeletingService }] =
    useDeleteExtendedServiceMutation();

  // Categories data and mutations
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useGetExtendedCategoriesQuery();

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateExtendedCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateExtendedCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteExtendedCategoryMutation();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create service
  const handleCreateService = async () => {
    try {
      await createService(formData);
      setFormData({
        name: "",
        description: "",
        short_desc: "",
        price: "",
        category: "",
        image_url: "",
        is_active: true,
      });
      setShowCreateModal(false);
      refetchServices();
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  // Handle update service
  const handleUpdateService = async () => {
    try {
      await updateService({ id: editingItem.id, serviceData: formData });
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        short_desc: "",
        price: "",
        category: "",
        image_url: "",
        is_active: true,
      });
      refetchServices();
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  // Handle delete service
  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        refetchServices();
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  // Handle create category
  const handleCreateCategory = async () => {
    try {
      await createCategory(formData);
      setFormData({
        name: "",
        description: "",
        short_desc: "",
        price: "",
        category: "",
        image_url: "",
        is_active: true,
      });
      setShowCreateModal(false);
      refetchCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  // Handle update category
  const handleUpdateCategory = async () => {
    try {
      await updateCategory({ id: editingItem.id, categoryData: formData });
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        short_desc: "",
        price: "",
        category: "",
        image_url: "",
        is_active: true,
      });
      refetchCategories();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will affect all services in this category.",
      )
    ) {
      try {
        await deleteCategory(categoryId);
        refetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  // Filter services based on search term
  const filteredServices =
    services?.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.short_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

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
        <h2 className="text-2xl font-bold text-gray-900">
          {activeTab === "services"
            ? "Extended Service Management"
            : "Extended Category Management"}
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              setShowCreateModal(true);
              setEditingItem(null);
              setFormData({
                name: "",
                description: "",
                short_desc: "",
                price: "",
                category: "",
                image_url: "",
                is_active: true,
              });
            }}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New {activeTab === "services" ? "Service" : "Category"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`${
              activeTab === "services"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
            Services
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`${
              activeTab === "categories"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <QueueListIcon className="h-5 w-5 mr-2" />
            Categories
          </button>
        </nav>
      </div>

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          {servicesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
            </div>
          ) : servicesError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Failed to load services</div>
              <button
                type="button"
                onClick={refetchServices}
                className="btn-primary flex items-center mx-auto"
              >
                <ArrowPathIcon className="h-5 w-5 mr-1" />
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Services ({filteredServices.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="border border-gray-200/50 rounded-lg p-4 hover:shadow-md transition-shadow backdrop-blur-sm bg-white/50"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(service);
                            setFormData({
                              name: service.name,
                              description: service.description,
                              short_desc: service.short_desc,
                              price: service.price,
                              category: service.category?.id || "",
                              image_url: service.image_url || "",
                              is_active: service.is_active,
                            });
                            setShowCreateModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={isDeletingService}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {service.short_desc}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold text-primary-600">
                        ৳{service.price}
                      </span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No services found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search to find what you're looking for."
                      : "Get started by creating a new service."}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(true);
                        setEditingItem(null);
                        setFormData({
                          name: "",
                          description: "",
                          short_desc: "",
                          price: "",
                          category: "",
                          image_url: "",
                          is_active: true,
                        });
                      }}
                      className="btn-primary"
                    >
                      <PlusIcon className="h-5 w-5 mr-1 inline" />
                      Add Service
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          {categoriesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
            </div>
          ) : categoriesError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Failed to load categories</div>
              <button
                type="button"
                onClick={refetchCategories}
                className="btn-primary flex items-center mx-auto"
              >
                <ArrowPathIcon className="h-5 w-5 mr-1" />
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Categories ({filteredCategories.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200/50 rounded-lg p-4 hover:shadow-md transition-shadow backdrop-blur-sm bg-white/50"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">
                        {category.name}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(category);
                            setFormData({
                              name: category.name,
                              description: category.description,
                              short_desc: category.short_desc || "",
                              price: "",
                              category: "",
                              image_url: category.image_url || "",
                              is_active: category.is_active,
                            });
                            setShowCreateModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeletingCategory}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {category.services_count || 0} services
                      </span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
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
                      onClick={() => {
                        setShowCreateModal(true);
                        setEditingItem(null);
                        setFormData({
                          name: "",
                          description: "",
                          short_desc: "",
                          price: "",
                          category: "",
                          image_url: "",
                          is_active: true,
                        });
                      }}
                      className="btn-primary"
                    >
                      <PlusIcon className="h-5 w-5 mr-1 inline" />
                      Add Category
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingItem
                ? `Edit ${activeTab === "services" ? "Service" : "Category"}`
                : `Create New ${activeTab === "services" ? "Service" : "Category"}`}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={serviceNameId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <input
                  id={serviceNameId}
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor={serviceShortDescId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Short Description
                </label>
                <input
                  id={serviceShortDescId}
                  type="text"
                  name="short_desc"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={formData.short_desc}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor={serviceDescriptionId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id={serviceDescriptionId}
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {activeTab === "services" && (
                <>
                  <div>
                    <label
                      htmlFor={servicePriceId}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price *
                    </label>
                    <input
                      id={servicePriceId}
                      type="number"
                      step="0.01"
                      name="price"
                      className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={categorySelectId}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id={categorySelectId}
                      name="category"
                      className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor={imageUrlId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image URL
                </label>
                <input
                  id={imageUrlId}
                  type="text"
                  name="image_url"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={isActiveId}
                  name="is_active"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor={isActiveId}
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
                  setEditingItem(null);
                  setFormData({
                    name: "",
                    description: "",
                    short_desc: "",
                    price: "",
                    category: "",
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
                onClick={
                  editingItem
                    ? activeTab === "services"
                      ? handleUpdateService
                      : handleUpdateCategory
                    : activeTab === "services"
                      ? handleCreateService
                      : handleCreateCategory
                }
                disabled={
                  activeTab === "services"
                    ? editingItem
                      ? isUpdatingService
                      : isCreatingService
                    : editingItem
                      ? isUpdatingCategory
                      : isCreatingCategory
                }
                className="btn-primary"
              >
                {activeTab === "services"
                  ? editingItem
                    ? isUpdatingService
                      ? "Updating..."
                      : "Update Service"
                    : isCreatingService
                      ? "Creating..."
                      : "Create Service"
                  : editingItem
                    ? isUpdatingCategory
                      ? "Updating..."
                      : "Update Category"
                    : isCreatingCategory
                      ? "Creating..."
                      : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtendedServiceManagement;
