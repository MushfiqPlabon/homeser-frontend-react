// utils/userFeedback.js
// Utility for collecting and managing user feedback

import React from "react";

/**
 * User feedback collection utility
 */
class UserFeedbackCollector {
  constructor() {
    this.feedback = [];
    this.listeners = [];
  }

  /**
   * Collect user feedback
   * @param {Object} feedbackData - Feedback data
   * @param {string} feedbackData.type - Type of feedback (e.g., 'bug', 'feature_request', 'general')
   * @param {string} feedbackData.message - Feedback message
   * @param {number} feedbackData.rating - Optional rating (1-5)
   * @param {Object} feedbackData.metadata - Optional metadata
   */
  collectFeedback(feedbackData) {
    const feedback = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: feedbackData.type,
      message: feedbackData.message,
      rating: feedbackData.rating,
      metadata: feedbackData.metadata || {},
    };

    this.feedback.push(feedback);

    // Notify listeners
    this.listeners.forEach((listener) => {
      listener(feedback);
    });

    // In a real application, you would send this to your backend
    // For now, we'll just log it to the console
    console.log("User Feedback Collected:", feedback);

    return feedback;
  }

  /**
   * Get all collected feedback
   * @returns {Array} Array of feedback objects
   */
  getFeedback() {
    return [...this.feedback];
  }

  /**
   * Clear all collected feedback
   */
  clearFeedback() {
    this.feedback = [];
  }

  /**
   * Add a listener for feedback events
   * @param {Function} listener - Function to call when feedback is collected
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   * @param {Function} listener - Listener to remove
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Send feedback to backend (placeholder)
   * @param {Object} feedback - Feedback data to send
   */
  async sendFeedbackToBackend(feedback) {
    try {
      // For now, just simulate a successful send
      console.log("Feedback sent to backend:", feedback);
      return { success: true };
    } catch (error) {
      console.error("Error sending feedback to backend:", error);
      return { success: false, error: error.message };
    }
  }
}

// Create a singleton instance
const userFeedbackCollector = new UserFeedbackCollector();

// Export React hook for easier integration
export const useUserFeedback = () => {
  const [feedback, setFeedback] = React.useState(
    userFeedbackCollector.getFeedback(),
  );

  React.useEffect(() => {
    const listener = (newFeedback) => {
      setFeedback((prev) => [...prev, newFeedback]);
    };

    userFeedbackCollector.addListener(listener);

    return () => {
      userFeedbackCollector.removeListener(listener);
    };
  }, []);

  return {
    feedback,
    collectFeedback: userFeedbackCollector.collectFeedback.bind(
      userFeedbackCollector,
    ),
    getFeedback: userFeedbackCollector.getFeedback.bind(userFeedbackCollector),
    clearFeedback: userFeedbackCollector.clearFeedback.bind(
      userFeedbackCollector,
    ),
    sendFeedbackToBackend: userFeedbackCollector.sendFeedbackToBackend.bind(
      userFeedbackCollector,
    ),
  };
};

// Export the class and instance for direct usage
export default userFeedbackCollector;
