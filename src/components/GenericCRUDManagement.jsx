/**
 * Generic CRUD Management Component
 * Provides a reusable template for management interfaces with standard CRUD operations
 */

import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const GenericCRUDManagement = ({
  title,
  searchPlaceholder,
  columns, // Array of { key, header, renderCell }
  data,
  isLoading,
  isError,
  refetch,
  onCreate,
  onUpdate,
  onDelete,
  onSearch,
  createFormFields = [],
  updateFormFields = [],
  hasCreate = true,
  hasUpdate = true,
  hasDelete = true,
  actionButtons = [],
  customRowActions = [],
  renderEmptyState = null,
  renderErrorState = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Use field names directly as identifiers instead of using useId in a loop

  // Update form data when editing item changes
  useState(() => {
    if (editingItem) {
      const newFormData = { ...editingItem };
      setFormData(newFormData);
    }
  }, [editingItem]);

  const handleCreate = async () => {
    if (onCreate) {
      try {
        await onCreate(formData);
        setFormData({});
        setShowCreateModal(false);
        refetch?.();
      } catch (error) {
        console.error("Failed to create item:", error);
      }
    }
  };

  const handleUpdate = async () => {
    if (onUpdate && editingItem) {
      try {
        await onUpdate({ id: editingItem.id, data: formData });
        setEditingItem(null);
        setFormData({});
        refetch?.();
      } catch (error) {
        console.error("Failed to update item:", error);
      }
    }
  };

  const handleDelete = async (itemId) => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this item?")
    ) {
      try {
        await onDelete(itemId);
        refetch?.();
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  // Filter data based on search term if a filter function is provided
  const filteredData = onSearch
    ? onSearch(data, searchTerm)
    : data?.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      ) || [];

  const renderFormFields = (fields, values, onChange) => {
    return fields.map((field) => (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
        </label>
        {field.type === "textarea" ? (
          <textarea
            id={field.name}
            rows={field.rows || 3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
            value={values[field.name] || ""}
            onChange={(e) =>
              onChange({ ...values, [field.name]: e.target.value })
            }
          />
        ) : field.type === "checkbox" ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              checked={!!values[field.name]}
              onChange={(e) =>
                onChange({ ...values, [field.name]: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-sm"
            />
            <label
              htmlFor={field.name}
              className="ml-2 block text-sm text-gray-900"
            >
              {field.label}
            </label>
          </div>
        ) : field.type === "select" ? (
          <select
            id={field.name}
            className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
            value={values[field.name] || ""}
            onChange={(e) =>
              onChange({ ...values, [field.name]: e.target.value })
            }
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type || "text"}
            className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
            value={values[field.name] || ""}
            onChange={(e) =>
              onChange({ ...values, [field.name]: e.target.value })
            }
          />
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="px-4 py-2 pl-10 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {hasCreate && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add {title.replace("Manage ", "")}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        renderErrorState || (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              Failed to load {title.toLowerCase()}
            </div>
            <button
              type="button"
              onClick={() => refetch?.()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        )
      ) : filteredData.length === 0 ? (
        renderEmptyState || (
          <div className="text-center py-12">
            <p className="text-gray-500">No {title.toLowerCase()} found</p>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={`${column.key || column.header}-${index}`}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30">
                    {columns.map((column, index) => (
                      <td
                        key={`${column.key || column.header}-${index}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {column.renderCell
                          ? column.renderCell(item)
                          : item[column.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {hasUpdate && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(item);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                        {hasDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                        {customRowActions.map((action, idx) => (
                          <button
                            key={`${action.title || "action"}-${idx}`}
                            type="button"
                            onClick={() => action.onClick(item)}
                            className={
                              action.className ||
                              "text-gray-600 hover:text-gray-900"
                            }
                            title={action.title}
                          >
                            {action.icon && <action.icon className="h-5 w-5" />}
                          </button>
                        ))}
                        {actionButtons.map((button, idx) => (
                          <button
                            key={`${button.title || "button"}-${idx}`}
                            type="button"
                            onClick={() => button.onClick(item)}
                            className={
                              button.className ||
                              "text-gray-600 hover:text-gray-900"
                            }
                            title={button.title}
                          >
                            {button.icon && <button.icon className="h-5 w-5" />}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {hasCreate && showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New {title.replace("Manage ", "")}
            </h3>
            <div className="space-y-4">
              {renderFormFields(createFormFields, formData, setFormData)}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({});
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="btn-primary"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {hasUpdate && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit {title.replace("Manage ", "")}
            </h3>
            <div className="space-y-4">
              {renderFormFields(updateFormFields, formData, setFormData)}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setFormData({});
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericCRUDManagement;
