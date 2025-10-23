/**
 * Free-Tier Usage Monitoring Dashboard
 * Business Value: Prevents service interruption from exceeding limits
 * Cost Optimization: Maintains 100% free-tier compliance
 * Risk Management: Early warning system for usage spikes
 */

import {
  ChartBarIcon,
  CheckCircleIcon,
  CloudIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const UsageMonitoringDashboard = () => {
  const [usageData, setUsageData] = useState({
    vercel: { used: 0, limit: 1000000, percentage: 0 },
    supabase: { used: 0, limit: 10000, percentage: 0 },
    redis: { used: 0, limit: 256, percentage: 0 },
    cloudinary: { used: 0, limit: 25, percentage: 0 },
  });

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsageData = useCallback(async () => {
    try {
      // Simulate API call to backend usage tracking
      const response = await fetch("/api/usage-metrics/");
      const data = await response.json();

      const processedData = {
        vercel: {
          used: data.vercel_invocations || 0,
          limit: 1000000,
          percentage: ((data.vercel_invocations || 0) / 1000000) * 100,
          label: "Vercel Invocations",
          unit: "calls",
        },
        supabase: {
          used: data.supabase_mau || 0,
          limit: 10000,
          percentage: ((data.supabase_mau || 0) / 10000) * 100,
          label: "Supabase MAU",
          unit: "users",
        },
        redis: {
          used: data.redis_memory || 0,
          limit: 256,
          percentage: ((data.redis_memory || 0) / 256) * 100,
          label: "Redis Memory",
          unit: "MB",
        },
        cloudinary: {
          used: data.cloudinary_credits || 0,
          limit: 25,
          percentage: ((data.cloudinary_credits || 0) / 25) * 100,
          label: "Cloudinary Credits",
          unit: "credits",
        },
      };

      setUsageData(processedData);

      // Generate alerts for high usage
      const newAlerts = [];
      Object.entries(processedData).forEach(([service, data]) => {
        if (data.percentage > 90) {
          newAlerts.push({
            service,
            level: "critical",
            message: `${data.label} at ${data.percentage.toFixed(1)}% capacity`,
          });
        } else if (data.percentage > 80) {
          newAlerts.push({
            service,
            level: "warning",
            message: `${data.label} approaching limit (${data.percentage.toFixed(1)}%)`,
          });
        }
      });

      setAlerts(newAlerts);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch usage data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsageData();
    const interval = setInterval(fetchUsageData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchUsageData]);

  const getStatusColor = (percentage) => {
    if (percentage > 90) return "text-red-600 bg-red-100";
    if (percentage > 80) return "text-yellow-600 bg-yellow-100";
    if (percentage > 60) return "text-blue-600 bg-blue-100";
    return "text-green-600 bg-green-100";
  };

  const getProgressColor = (percentage) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 80) return "bg-yellow-500";
    if (percentage > 60) return "bg-blue-500";
    return "bg-green-500";
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Free-Tier Usage Monitor
        </h3>
        <div className="text-sm text-gray-500">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={`alert-${alert.service}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                p-3 rounded-lg flex items-center
                ${
                  alert.level === "critical"
                    ? "bg-red-50 border border-red-200"
                    : "bg-yellow-50 border border-yellow-200"
                }
              `}
            >
              <ExclamationTriangleIcon
                className={`w-5 h-5 mr-3 ${
                  alert.level === "critical"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  alert.level === "critical"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {alert.message}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(usageData).map(([service, data]) => (
          <motion.div
            key={service}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{data.label}</h4>
              <span
                className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${getStatusColor(data.percentage)}
              `}
              >
                {data.percentage.toFixed(1)}%
              </span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                  {data.used.toLocaleString()} {data.unit}
                </span>
                <span>
                  {data.limit.toLocaleString()} {data.unit}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${getProgressColor(data.percentage)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${data.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {data.limit - data.used > 0
                ? `${(data.limit - data.used).toLocaleString()} ${data.unit} remaining`
                : "Limit exceeded!"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {alerts.length === 0 ? (
              <>
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  All services within limits
                </span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  {alerts.length} service{alerts.length > 1 ? "s" : ""} need
                  attention
                </span>
              </>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <CloudIcon className="w-4 h-4 inline mr-1" />
            100% Free-Tier Compliant
          </div>
        </div>
      </div>

      {/* Optimization Tips */}
      {alerts.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Optimization Tips:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enable Redis TTL cleanup to reduce memory usage</li>
            <li>• Implement request batching to reduce Vercel invocations</li>
            <li>• Use image compression to optimize Cloudinary usage</li>
            <li>• Cache frequently accessed data to reduce database queries</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UsageMonitoringDashboard;
