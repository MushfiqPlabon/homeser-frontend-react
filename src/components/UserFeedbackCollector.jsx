// UserFeedbackCollector.jsx
// Component for collecting user feedback throughout the application

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { useUserFeedback } from "../utils/userFeedback";

const UserFeedbackCollector = () => {
  const { collectFeedback } = useUserFeedback();
  const feedbackTypeId = useId();
  const messageTypeId = useId();
  const ratingLabelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleFeedbackForm = () => {
    setIsOpen(!isOpen);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const feedbackData = {
        type: feedbackType,
        message,
        rating,
      };

      // Collect the feedback
      const _feedback = collectFeedback(feedbackData);

      // In a real application, you would send this to your backend
      // await sendFeedbackToBackend(feedback);

      // Reset form
      setMessage("");
      setRating(5);
      setSubmitSuccess(true);

      // Close the form after a delay
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Share Your Feedback
          </h3>

          {submitSuccess ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium">
                Thank you for your feedback!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor={feedbackTypeId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Feedback Type
                </label>
                <select
                  id={feedbackTypeId}
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">General Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="performance">Performance Issue</option>
                </select>
              </div>

              <div>
                <div
                  id={ratingLabelId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating
                </div>
                <div
                  className="flex items-center space-x-1"
                  role="radiogroup"
                  aria-labelledby={ratingLabelId}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      aria-pressed={star === rating}
                    >
                      {star <= rating ? (
                        <svg
                          className="h-6 w-6 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          role="img"
                          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                        >
                          <title>Star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-6 w-6 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          role="img"
                          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                        >
                          <title>Star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor={messageTypeId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id={messageTypeId}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Please share your feedback..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={toggleFeedbackForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Feedback"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFeedbackForm}
      className="fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      aria-label="Provide feedback"
    >
      <ChatBubbleLeftRightIcon className="h-6 w-6" />
    </button>
  );
};

export default UserFeedbackCollector;
