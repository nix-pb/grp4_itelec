import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, name, price, term_value, term_id, description, image, seller_id } = location.state || {}; // Destructure seller_id from state

  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setPurchaseDate(e.target.value);
  };

  // Handle order confirmation
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
  
    const user_id = localStorage.getItem('user_id');
    let hasError = false;
  
    // Check for missing fields and show error messages
    if (!user_id) {
      toast.error("User information is missing. Please log in first.");
      hasError = true;
    }
  
    if (!id) {
      toast.error("Product ID is missing.");
      hasError = true;
    }
  
    if (!name) {
      toast.error("Product name is missing.");
      hasError = true;
    }
  
    if (!price) {
      toast.error("Product price is missing.");
      hasError = true;
    }
  
    if (!quantity || quantity <= 0) {
      toast.error("Quantity must be greater than 0.");
      hasError = true;
    }
  
    if (!purchaseDate) {
      toast.error("Purchase date is required.");
      hasError = true;
    }
  
    if (!seller_id) {
      toast.error("Seller ID is missing.");
      hasError = true;
    }
  
    if (hasError) {
      return; // Stop the order submission if any field is invalid
    }
  
    const orderData = {
      user_id: user_id,
      product_id: id,
      name: name,
      price: price,
      quantity: quantity,
      purchase_date: purchaseDate,
      image: image,  // Pass the image to the backend as well
      seller_id: seller_id, // Add seller_id to the order data
    };
  
    try {
      const response = await fetch('http://localhost:5001/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      const responseData = await response.json(); // Get the response data
  
      if (!response.ok) {
        // If the response is not OK, show the error message from the backend
        toast.error(`Failed to place order: ${responseData.message || "Unknown error"}`);
        return;
      }
  
      toast.success("Your order has been processed successfully!");
      setTimeout(() => navigate('/home'), 3000); // Redirect after success
    } catch (error) {
      // Log error and display toast for frontend issues
      console.error('Error placing order:', error);
      toast.error("There was an issue placing your order. Please try again later.");
    }
  };
  

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        toast.error("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
    else setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>Product not found!</div>;

  return (
    <div className="order-form">
      <h2>Order Form</h2>
      {id && name && price ? (
        <form onSubmit={handleConfirmOrder}>
          <p><strong>Product Name:</strong> {name}</p>
          <p><strong>Product Price:</strong> PHP {price} / {term_value} {term_id}</p>
          <p><strong>Description:</strong> {description}</p>

          {image ? (
            <div className="product-image-container">
              <img src={image} alt={name} className="product-image" />
            </div>
          ) : (
            <div className="product-image-container">
              <img src="https://via.placeholder.com/150" alt="Placeholder" className="product-image" />
            </div>
          )}

          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            required
          />

          <label htmlFor="purchaseDate">Purchase Date:</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={purchaseDate}
            onChange={handleDateChange}
            required
          />

          <button type="submit">Confirm Order</button>
        </form>
      ) : (
        <p>Product details not available.</p>
      )}
      <ToastContainer
        closeButton={false} // Remove the close button
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OrderForm;
