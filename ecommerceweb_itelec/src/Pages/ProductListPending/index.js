import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListPending = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Get user_id from localStorage
  const userId = localStorage.getItem('user_id'); // Ensure 'user_id' is properly stored in localStorage

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Navigate to the product detail page
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('User ID is missing. Please log in.'); // Show error if user_id is not found
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/orders_pending?user_id=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch orders: ${errorData.message || response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching pending orders:', err);
        setError(err.message);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {error && <p className="error-message">{error}</p>}

        {!error && orders.length === 0 ? (
          <p>No pending orders found for this user.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="product-card-order"
              onClick={() => handleProductClick(order.product_id)}
            >
              <div className="product-image-wrapper-order">
                {order.image ? (
                  <img
                    src={order.image}
                    alt={order.name}
                    className="product-image-order"
                  />
                ) : (
                  <div className="placeholder-image-order">No Image Available</div>
                )}
              </div>
              <div className="product-info-order">
                <h3>{order.name}</h3>
                <p className="product-status-order">Status: {order.status}</p>
              </div>
              <div className="product-info-order">
                <p className="product-price-order">PHP {order.price}</p>
                <p className="product-quantity-order">Quantity: {order.quantity}</p>
                <p className="product-purchase-date-order">
                  Purchase Date: {new Date(order.purchase_date).toLocaleDateString()}
                </p>
                <button className="buy-again-button">Buy Again</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListPending;
