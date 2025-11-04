// ServiceManagement.jsx
// Component for managing services in admin panel using generic CRUD component

import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import GenericCRUDManagement from "./GenericCRUDManagement";
import {
  useCreateExtendedServiceMutation,
  useDeleteExtendedServiceMutation,
  useGetExtendedServicesQuery,
  useUpdateExtendedServiceMutation,
} from "../store/extendedApiSlice";

const ServiceManagement = () => {
  const {
    data: services,
    isLoading,
    isError,
    refetch,
  } = useGetExtendedServicesQuery();
  const [createService] = useCreateExtendedServiceMutation();
  const [updateService] = useUpdateExtendedServiceMutation();
  const [deleteService] = useDeleteExtendedServiceMutation();

  // Define columns for the services table
  const serviceColumns = [
    {
      key: "service_info",
      header: "Service",
      renderCell: (service) => (
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10">
            <BuildingStorefrontIcon className="h-10 w-10 text-gray-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {service.name}
            </div>
            <div className="text-sm text-gray-500">{service.short_desc}</div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      renderCell: (service) => `৳${service.price}`,
    },
    {
      key: "category",
      header: "Category",
      renderCell: (service) => service.category?.name || "N/A",
    },
    {
      key: "is_active",
      header: "Status",
      renderCell: (service) => (
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
      ),
    },
  ];

  // Define form fields for creating services
  const createServiceFields = [
    { name: "name", label: "Service Name", type: "text" },
    { name: "short_desc", label: "Short Description", type: "text" },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    { name: "price", label: "Price", type: "number", step: "0.01" },
    { name: "category", label: "Category ID", type: "number" },
    { name: "image_url", label: "Image URL", type: "text" },
    { name: "is_active", label: "Active", type: "checkbox" },
  ];

  // Define form fields for updating services
  const updateServiceFields = [
    { name: "name", label: "Service Name", type: "text" },
    { name: "short_desc", label: "Short Description", type: "text" },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    { name: "price", label: "Price", type: "number", step: "0.01" },
    { name: "category", label: "Category ID", type: "number" },
    { name: "image_url", label: "Image URL", type: "text" },
    { name: "is_active", label: "Active", type: "checkbox" },
  ];

  return (
    <GenericCRUDManagement
      title="Manage Services"
      searchPlaceholder="Search services..."
      columns={serviceColumns}
      data={services || []}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      onCreate={async (formData) => {
        await createService(formData);
      }}
      onUpdate={async ({ id, data }) => {
        await updateService({ id, serviceData: data });
      }}
      onDelete={async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
          await deleteService(id);
        }
      }}
      createFormFields={createServiceFields}
      updateFormFields={updateServiceFields}
      hasCreate={true}
      hasUpdate={true}
      hasDelete={true}
    />
  );
};

export default ServiceManagement;
