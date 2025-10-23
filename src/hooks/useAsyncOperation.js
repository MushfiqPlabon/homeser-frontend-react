import { useState } from "react";

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (operation) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err.message || "Operation failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
