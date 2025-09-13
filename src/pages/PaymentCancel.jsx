// PaymentCancel.jsx
// This page component is displayed when the user has cancelled the payment process,
// informing them that no charges were made and offering options to return to the cart.

import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";

const PaymentCancel = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <ExclamationTriangleIcon className="h-10 w-10 text-yellow-600" />
          </div>

          {/* Cancel Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h2>
          <p className="text-gray-600 mb-6">
            You have cancelled the payment process. Your order has not been
            placed and no charges have been made.
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
                <span className="font-medium text-yellow-600">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What Happened?
            </h3>
            <p className="text-sm text-blue-700 text-left">
              You chose to cancel the payment during the checkout process. Your
              cart items are still saved and you can complete the purchase
              anytime.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/checkout" className="w-full btn-primary">
              Complete Payment
            </Link>
            <Link
              to="/cart"
              className="w-full btn-secondary flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <Link
              to="/services"
              className="w-full text-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Changed your mind? You can always complete your purchase later
              from your cart.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
