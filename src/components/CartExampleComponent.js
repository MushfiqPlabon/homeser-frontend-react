import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../store/apiSlice";
import { useAuth } from "../context/AuthContext";

const CartExampleComponent = () => {
  const { isAuthenticated } = useAuth();
  
  // Fetch cart data only for authenticated users
  const { data: cart, isLoading, isError, error } = useGetCartQuery(undefined, {
    skip: !isAuthenticated // Only fetch cart data for authenticated users
  });

  // Cart mutations
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();
  const [updateQuantity, { isLoading: isUpdating }] =
    useUpdateCartItemQuantityMutation();

  // Handle loading and error states
  if (!isAuthenticated) return <div>Please log in to view your cart.</div>;
  if (isLoading) return <div>Loading cart...</div>;
  if (isError)
    return <div>Error: {error?.data?.message || "Failed to load cart"}</div>;

  // Cart data
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  // Handler functions
  const handleAddToCart = (serviceId, quantity, service) => {
    addToCart({ serviceId, quantity, service });
  };

  const handleRemoveFromCart = (serviceId) => {
    removeFromCart(serviceId);
  };

  const handleUpdateQuantity = (serviceId, quantity) => {
    updateQuantity({ serviceId, quantity });
  };

  return (
    <div>
      <h2>Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.service.id} className="cart-item">
              <h3>{item.service.name}</h3>
              <p>Price: ${item.price}</p>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateQuantity(item.service.id, item.quantity - 1)
                  }
                  disabled={isUpdating}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateQuantity(item.service.id, item.quantity + 1)
                  }
                  disabled={isUpdating}
                >
                  +
                </button>
              </div>
              <p>Total: ${item.total_price}</p>
              <button
                type="button"
                onClick={() => handleRemoveFromCart(item.service.id)}
                disabled={isRemoving}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cart-summary">
            <p>Subtotal: ${subtotal}</p>
            <p>Tax: ${tax}</p>
            <p>Total: ${total}</p>
          </div>
        </div>
      )}

      {/* Example of adding to cart */}
      <button
        type="button"
        onClick={() =>
          handleAddToCart(1, 1, { id: 1, name: "Sample Service", price: 25.99 })
        }
        disabled={isAdding}
      >
        Add Sample Service to Cart
      </button>
    </div>
  );
};

export default CartExampleComponent;
