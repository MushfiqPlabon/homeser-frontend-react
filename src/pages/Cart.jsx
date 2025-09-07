import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  TrashIcon, 
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, loading, removeFromCart, addToCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const handleRemoveItem = async (serviceId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(serviceId);
    }
  };

  const handleUpdateQuantity = async (serviceId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(serviceId);
      return;
    }
    
    if (change > 0) {
      await addToCart(serviceId, 1);
    } else {
      // For decreasing quantity, we need to remove and re-add with correct quantity
      await removeFromCart(serviceId);
      if (newQuantity > 0) {
        await addToCart(serviceId, newQuantity);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingBagIcon className="h-8 w-8 mr-3 text-primary-600" />
              Shopping Cart
            </h1>
          </div>

          {isEmpty ? (
            /* Empty Cart */
            <div className="px-6 py-12 text-center">
              <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any services to your cart yet.
              </p>
              <Link to="/services" className="btn-primary">
                Browse Services
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Service Image */}
                      <div className="flex-shrink-0">
                        {item.service.image_url ? (
                          <img
                            src={item.service.image_url}
                            alt={item.service.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.service.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.service.short_desc}
                        </p>
                        <p className="text-primary-600 font-semibold mt-1">
                          ৳{item.price} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.service.id, item.quantity, -1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.service.id, item.quantity, 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ৳{item.total_price}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Remove from cart"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">৳{cart.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span className="font-semibold">৳{cart.tax}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">৳{cart.total}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/services"
                    className="btn-secondary flex-1 text-center"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/checkout"
                    className="btn-primary flex-1 text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;