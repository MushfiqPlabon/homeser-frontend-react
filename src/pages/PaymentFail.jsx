// PaymentFail.jsx
// This page component is displayed when a payment attempt has failed,
// providing information about the failure and options to retry or seek support.

import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";

const PaymentFail = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Fail Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>

          {/* Fail Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your payment could not be processed. Please try again
            or contact support if the problem persists.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Order Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">#{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-red-600">Payment Failed</span>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">
              Common Issues
            </h3>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Network connectivity issues</li>
              <li>• Card expired or blocked</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/checkout"
              className="w-full btn-primary flex items-center justify-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Try Again
            </Link>
            <Link to="/cart" className="w-full btn-secondary">
              Back to Cart
            </Link>
            <Link
              to="/services"
              className="w-full text-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@homeser.com"
                className="text-primary-600 hover:text-primary-500"
              >
                support@homeser.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
