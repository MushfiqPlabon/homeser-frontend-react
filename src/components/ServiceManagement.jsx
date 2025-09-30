// ServiceManagement.jsx
// Component for managing services in admin panel

import {
  BuildingStorefrontIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useCreateExtendedServiceMutation,
  useDeleteExtendedServiceMutation,
  useGetExtendedServicesQuery,
  useUpdateExtendedServiceMutation,
} from "../store/extendedApiSlice";

const ServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Generate unique IDs for form elements
  const serviceNameId = useId();
  const shortDescriptionId = useId();
  const descriptionId = useId();
  const priceId = useId();
  const categoryId = useId();
  const imageId = useId();
  const _isActiveId = useId();
  const editServiceNameId = useId();
  const editShortDescriptionId = useId();
  const editDescriptionId = useId();
  const editPriceId = useId();
  const editCategoryId = useId();
  const editImageId = useId();
  const _editIsActiveId = useId();

  const {
    data: services,
    isLoading,
    isError,
    refetch,
  } = useGetExtendedServicesQuery();
  const [createService, { isLoading: isCreating }] =
    useCreateExtendedServiceMutation();
  const [updateService, { isLoading: isUpdating }] =
    useUpdateExtendedServiceMutation();
  const [deleteService, { isLoading: isDeleting }] =
    useDeleteExtendedServiceMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_desc: "",
    price: "",
    category: "",
    image_url: "",
    is_active: true,
  });

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
      refetch();
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  const handleUpdateService = async () => {
    try {
      await updateService({ id: editingService.id, serviceData: formData });
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        short_desc: "",
        price: "",
        category: "",
        image_url: "",
        is_active: true,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        refetch();
      } catch (error) {
        console.error("Failed to delete service:", error);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search services..."
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
            Add Service
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load services</div>
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
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
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
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <BuildingStorefrontIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {service.short_desc}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ৳{service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.category?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            service.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(service);
                            setFormData({
                              name: service.name,
                              description: service.description,
                              short_desc: service.short_desc,
                              price: service.price,
                              category: service.category?.id || "",
                              image_url: service.image_url || "",
                              is_active: service.is_active,
                            });
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id)}
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

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Service
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={serviceNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Name
                </label>
                <input
                  id={serviceNameId}
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
                  htmlFor={shortDescriptionId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Short Description
                </label>
                <input
                  id={shortDescriptionId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.short_desc}
                  onChange={(e) =>
                    setFormData({ ...formData, short_desc: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={descriptionId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id={descriptionId}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={priceId}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    id={priceId}
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={categoryId}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category ID
                  </label>
                  <input
                    id={categoryId}
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={imageId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  id={imageId}
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
                  id={isActiveId}
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
                onClick={handleCreateService}
                disabled={isCreating}
                className="btn-primary"
              >
                {isCreating ? "Creating..." : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Service
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={editServiceNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Name
                </label>
                <input
                  id={editServiceNameId}
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
                  htmlFor={editShortDescriptionId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Short Description
                </label>
                <input
                  id={editShortDescriptionId}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.short_desc}
                  onChange={(e) =>
                    setFormData({ ...formData, short_desc: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={editDescriptionId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id={editDescriptionId}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={editPriceId}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    id={editPriceId}
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={editCategoryId}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category ID
                  </label>
                  <input
                    id={editCategoryId}
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={editImageId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  id={editImageId}
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
                  id={_editIsActiveId}
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={_editIsActiveId}
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
                  setEditingService(null);
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
                onClick={handleUpdateService}
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? "Updating..." : "Update Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
