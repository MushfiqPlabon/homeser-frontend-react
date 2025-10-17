// CreateServicePage.jsx
// This page component allows service providers to create new services

import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCreateServiceProviderServiceMutation } from "../store/extendedApiSlice";
import {
  sanitizeServiceDescription,
  sanitizeServiceName,
  sanitizeTextareaInput,
  validateServiceCategory,
  validateServicePrice,
} from "../utils/inputSanitization";

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [createService, { isLoading }] =
    useCreateServiceProviderServiceMutation();

  // Rate limiting - prevent spam submissions
  const lastSubmissionTime = useRef(0);
  const MIN_SUBMISSION_INTERVAL = 3000; // 3 seconds between submissions

  const nameId = useId();
  const categoryId = useId();
  const shortDescId = useId();
  const descriptionId = useId();
  const priceId = useId();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    short_desc: "",
    description: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { id: 1, name: "Cleaning" },
    { id: 2, name: "Plumbing" },
    { id: 3, name: "Electrical" },
    { id: 4, name: "Gardening" },
    { id: 5, name: "Painting" },
    { id: 6, name: "Carpentry" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input based on field type
    let sanitizedValue = value;
    switch (name) {
      case "name":
        sanitizedValue = sanitizeServiceName(value);
        break;
      case "short_desc":
        sanitizedValue = sanitizeServiceDescription(value, 300);
        break;
      case "description":
        sanitizedValue = sanitizeTextareaInput(value);
        break;
      case "price":
        // For price, we keep it as is but validate on submit
        sanitizedValue = value;
        break;
      case "category":
        // Keep category as is but validate on submit
        sanitizedValue = value;
        break;
      default:
        sanitizedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Service name must be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.short_desc.trim()) {
      newErrors.short_desc = "Short description is required";
    } else if (formData.short_desc.length < 10) {
      newErrors.short_desc = "Short description must be at least 10 characters";
    } else if (formData.short_desc.length > 300) {
      newErrors.short_desc =
        "Short description must be less than 300 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else {
      try {
        validateServicePrice(formData.price);
      } catch (_error) {
        newErrors.price = "Price must be a positive number";
      }
    }

    // Validate category
    if (formData.category) {
      try {
        validateServiceCategory(formData.category, categories);
      } catch (_error) {
        newErrors.category = "Please select a valid category";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rate limiting check
    const currentTime = Date.now();
    if (currentTime - lastSubmissionTime.current < MIN_SUBMISSION_INTERVAL) {
      setErrors({
        submit: `Please wait ${Math.ceil((MIN_SUBMISSION_INTERVAL - (currentTime - lastSubmissionTime.current)) / 1000)} seconds before submitting again.`,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Update last submission time
    lastSubmissionTime.current = currentTime;

    try {
      // Sanitize and validate all data before sending
      const serviceName = sanitizeServiceName(formData.name);
      const serviceShortDesc = sanitizeServiceDescription(
        formData.short_desc,
        300,
      );
      const serviceDescription = sanitizeTextareaInput(formData.description);
      const servicePrice = validateServicePrice(formData.price);
      const serviceCategory = validateServiceCategory(
        formData.category,
        categories,
      );

      const serviceData = {
        name: serviceName,
        category: serviceCategory,
        short_desc: serviceShortDesc,
        description: serviceDescription,
        price: servicePrice,
      };

      await createService(serviceData).unwrap();
      navigate("/dashboard?activeTab=services"); // Navigate back to the dashboard services tab
    } catch (error) {
      console.error("Error creating service:", error);

      // Reset submission time on error to allow retry
      lastSubmissionTime.current = 0;

      let errorMessage = "Failed to create service. Please try again.";

      // Handle specific error cases
      if (error?.data?.name) {
        setErrors({ name: error.data.name[0] });
      } else if (error?.data?.price) {
        setErrors({ price: error.data.price[0] });
      } else if (error?.data?.category) {
        setErrors({ category: error.data.category[0] });
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      setErrors({
        submit: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Service
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new service to your portfolio as a service provider
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label
                htmlFor={nameId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Name *
              </label>
              <input
                type="text"
                id={nameId}
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? "border-red-500" : ""}`}
                placeholder="e.g., Home Cleaning, Plumbing Repair"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor={categoryId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category *
              </label>
              <select
                id={categoryId}
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? "border-red-500" : ""}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor={shortDescId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Short Description *
              </label>
              <input
                type="text"
                id={shortDescId}
                name="short_desc"
                value={formData.short_desc}
                onChange={handleChange}
                className={`input-field ${errors.short_desc ? "border-red-500" : ""}`}
                placeholder="Brief description of your service (10-300 characters)"
              />
              {errors.short_desc && (
                <p className="mt-1 text-sm text-red-600">{errors.short_desc}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.short_desc.length}/300 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor={descriptionId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Detailed Description *
              </label>
              <textarea
                id={descriptionId}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`input-field ${errors.description ? "border-red-500" : ""}`}
                placeholder="Detailed description of your service (20-2000 characters)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor={priceId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price (BDT) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id={priceId}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`input-field pl-10 ${errors.price ? "border-red-500" : ""}`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">৳</span>
                </div>
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard?activeTab=services")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;
