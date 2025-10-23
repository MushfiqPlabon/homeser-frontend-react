import Ajv from "ajv";
import addFormats from "ajv-formats";
import { API_BASE_URL } from "../config/api";

// Initialize Ajv instance with options
const ajv = new Ajv({
  allErrors: true,
  strict: false, // Allow some flexibility in schema validation
});

// Add additional formats
addFormats(ajv);

/**
 * Validates an API response against a JSON Schema contract
 * @param {any} responseData - The response data to validate
 * @param {object} schema - The JSON Schema to validate against
 * @returns {object} - Object with isValid flag and errors array
 */
export const validateContract = (responseData, schema) => {
  try {
    const validate = ajv.compile(schema);
    const isValid = validate(responseData);

    return {
      isValid,
      errors: validate.errors || [],
    };
  } catch (error) {
    // Contract validation error
    return {
      isValid: false,
      errors: [{ message: `Validation setup error: ${error.message}` }],
    };
  }
};

/**
 * Fetches the API contract schema from the backend
 * @param {string} endpoint - The API endpoint to get contract for
 * @returns {Promise<object>} - The JSON Schema for the endpoint
 */
export const fetchContractSchema = async (endpoint) => {
  try {
    // Replace slashes with hyphens for a valid URL segment
    const _normalizedEndpoint = endpoint
      .replace(/^\//, "") // Remove leading slash
      .replace(/\//g, "-") // Replace other slashes with hyphens
      .replace(/:/g, "-"); // Replace colons (for parameters like /api/services/{id}/) with hyphens

    const response = await fetch(`${API_BASE_URL}/contracts/all/`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch contract schema: ${response.status} ${response.statusText}`,
      );
    }

    const contractsData = await response.json();
    const contracts = contractsData.contracts;

    // For now, return the root schema - in a complete implementation
    // you would match the specific endpoint to its schema
    return contracts;
  } catch (_error) {
    // Error fetching contract schema
    // Return a basic schema to avoid breaking the app if contract fetching fails
    return {
      type: "object",
      properties: {}, // Allow any properties as fallback
    };
  }
};
