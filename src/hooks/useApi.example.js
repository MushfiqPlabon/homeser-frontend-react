// Example of how to use the React Query hooks to reduce boilerplate code

// BEFORE (manual approach with useState):
/*
import { useState, useEffect } from 'react';
import { paymentAPI } from '../utils/api';

const PaymentAnalyticsComponent = ({ days }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentAnalytics = async () => {
      try {
        setLoading(true);
        const response = await paymentAPI.getAnalytics({ days });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentAnalytics();
  }, [days]);

  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  if (error) return &lt;div&gt;Error: {error}&lt;/div&gt;;
  return &lt;div&gt;{JSON.stringify(data)}&lt;/div&gt;;
};
*/

// AFTER (using React Query hook):
/*
import { usePaymentAnalytics } from '../hooks/useApi';

const PaymentAnalyticsComponent = ({ days }) => {
  const { data, loading, error } = usePaymentAnalytics({ days });

  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  if (error) return &lt;div&gt;Error: {error.message}&lt;/div&gt;;
  return &lt;div&gt;{JSON.stringify(data)}&lt;/div&gt;;
};
*/

// The React Query approach reduces the component code from ~25 lines to ~10 lines
// while providing better caching, automatic refetching, and more robust error handling
