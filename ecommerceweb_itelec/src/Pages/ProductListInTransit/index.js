import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const ProductListPending = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Get user_id from localStorage
  const userId = localStorage.getItem('user_id'); // Use 'user_id' key from localStorage
  console.log('User ID from localStorage:', userId); // Log userId for debugging

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Navigate to the specific product detail page
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        console.error('User ID is not available in localStorage');
        setError('User ID is missing. Please log in.');
        return;
      }

      const url = `http://localhost:5001/api/orders_intransit?user_id=${userId}`;
      console.log('Fetching orders for userId:', userId); // Log userId being passed
      console.log('API URL:', url); // Log API endpoint

      try {
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch orders:', response.status, errorData);
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Orders:', data);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      }
    };

    fetchOrders();
  }, [userId]);

  console.log('All Orders:', orders);

  return (
    <div className="product-list-container-order">
      <div className="product-list-order">
        {error && <p className="error-message">{error}</p>} {/* Show any error message */}

        {orders.length === 0 ? (
          <p>No pending orders found for this user.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="product-card-order"
              onClick={() => handleProductClick(order.id)}
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
