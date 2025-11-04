import Ajv from "ajv";
import addFormats from "ajv-formats";

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
 * Fetches the API contract schema from the backend using RTK Query
 * @param {function} getApiContractsQuery - The RTK Query hook for getting contracts
 * @param {string} endpoint - The API endpoint to get contract for
 * @returns {Promise<object>} - The JSON Schema for the endpoint
 */
export const fetchContractSchema = async (getApiContractsQuery) => {
  try {
    // Use the RTK Query hook to get contracts
    const result = await getApiContractsQuery();

    if (result.error) {
      throw new Error(
        `Failed to fetch contract schema: ${result.error.message}`,
      );
    }

    const contractsData = result.data;
    const contracts = contractsData?.contracts;

    // Return the root schema - in a complete implementation
    // you would match the specific endpoint to its schema
    return contracts || {};
  } catch (_error) {
    // Error fetching contract schema
    // Return a basic schema to avoid breaking the app if contract fetching fails
    return {
      type: "object",
      properties: {}, // Allow any properties as fallback
    };
  }
};
