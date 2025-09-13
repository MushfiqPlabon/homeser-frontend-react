// PaymentSuccess.jsx
// This page component is displayed after a successful payment, confirming the order
// and providing next steps for the user.

import { CheckCircleIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [_orderDetails, _setOrderDetails] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch order details from the backend
    // For now, we'll show a success message
    console.log("Payment successful for order:", orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your order has been confirmed and our
            team will contact you soon.
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
                <span className="font-medium text-green-600">Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="font-medium text-green-600">Paid</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What's Next?
            </h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will contact you within 24 hours</li>
              <li>• Service will be scheduled at your convenience</li>
              <li>• Track your order in the dashboard</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/dashboard" className="w-full btn-primary">
              View Order in Dashboard
            </Link>
            <Link to="/services" className="w-full btn-secondary">
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
