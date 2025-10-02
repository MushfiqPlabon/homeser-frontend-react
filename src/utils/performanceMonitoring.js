// utils/performanceMonitoring.js
// Utility for monitoring application performance and collecting user feedback

import React from "react";

/**
 * Performance monitoring utility for tracking component render times and user interactions
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTime = {};
  }

  /**
   * Start timing a specific operation
   * @param {string} operationId - Unique identifier for the operation
   */
  startTiming(operationId) {
    this.startTime[operationId] = performance.now();
  }

  /**
   * End timing an operation and record the duration
   * @param {string} operationId - Unique identifier for the operation
   * @param {string} operationName - Descriptive name for the operation
   * @returns {number} Duration in milliseconds
   */
  endTiming(operationId, operationName) {
    if (!this.startTime[operationId]) {
      console.warn(
        `PerformanceMonitor: No start time recorded for operation ${operationId}`,
      );
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - this.startTime[operationId];

    // Record the metric
    if (!this.metrics[operationName]) {
      this.metrics[operationName] = [];
    }
    this.metrics[operationName].push(duration);

    // Clean up the start time
    delete this.startTime[operationId];

    return duration;
  }

  /**
   * Record a custom metric
   * @param {string} metricName - Name of the metric
   * @param {number} value - Value of the metric
   */
  recordMetric(metricName, value) {
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = [];
    }
    this.metrics[metricName].push(value);
  }

  /**
   * Get average value for a metric
   * @param {string} metricName - Name of the metric
   * @returns {number} Average value
   */
  getAverage(metricName) {
    const values = this.metrics[metricName];
    if (!values || values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Get median value for a metric
   * @param {string} metricName - Name of the metric
   * @returns {number} Median value
   */
  getMedian(metricName) {
    const values = this.metrics[metricName];
    if (!values || values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Get percentile value for a metric
   * @param {string} metricName - Name of the metric
   * @param {number} percentile - Percentile to calculate (0-100)
   * @returns {number} Percentile value
   */
  getPercentile(metricName, percentile) {
    const values = this.metrics[metricName];
    if (!values || values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.floor((percentile / 100) * (sorted.length - 1));

    return sorted[index];
  }

  /**
   * Get all metrics data
   * @returns {Object} Metrics data
   */
  getMetrics() {
    const result = {};

    for (const [metricName, values] of Object.entries(this.metrics)) {
      if (values.length > 0) {
        result[metricName] = {
          count: values.length,
          average: this.getAverage(metricName),
          median: this.getMedian(metricName),
          p95: this.getPercentile(metricName, 95),
          p99: this.getPercentile(metricName, 99),
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    }

    return result;
  }

  /**
   * Clear all metrics data
   */
  clearMetrics() {
    this.metrics = {};
  }

  /**
   * Log metrics to console for debugging
   */
  logMetrics() {
    if (import.meta.env.DEV) {
      console.table(this.getMetrics());
    }
  }
}

// Create a singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export React hook for easier integration
export const usePerformanceMonitor = () => {
  return performanceMonitor;
};

// Export the class and instance for direct usage
export default performanceMonitor;

// Utility hook for measuring component render times
export const useRenderTimer = (componentName) => {
  const monitor = usePerformanceMonitor();

  // Start timing when component mounts
  React.useEffect(() => {
    const operationId = `${componentName}_${Date.now()}`;
    monitor.startTiming(operationId);

    // End timing when component unmounts
    return () => {
      monitor.endTiming(operationId, `${componentName}_render`);
    };
  }, [componentName, monitor]);
};

// Utility function for measuring function execution times
export const measureFunctionExecution = async (fn, functionName) => {
  const monitor = performanceMonitor;
  const operationId = `${functionName}_${Date.now()}`;

  monitor.startTiming(operationId);
  try {
    const result = await fn();
    monitor.endTiming(operationId, `${functionName}_execution`);
    return result;
  } catch (error) {
    monitor.endTiming(operationId, `${functionName}_execution`);
    throw error;
  }
};

// Utility function for measuring API call times
export const measureApiCall = async (apiCall, endpointName) => {
  const monitor = performanceMonitor;
  const operationId = `${endpointName}_${Date.now()}`;

  monitor.startTiming(operationId);
  try {
    const result = await apiCall();
    monitor.endTiming(operationId, `${endpointName}_api_call`);
    return result;
  } catch (error) {
    monitor.endTiming(operationId, `${endpointName}_api_call`);
    throw error;
  }
};
