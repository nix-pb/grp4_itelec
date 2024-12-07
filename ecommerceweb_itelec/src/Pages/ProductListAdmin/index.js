import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confirmation from './Confirmation/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const ProductListAdmin = ({ selectedCategory }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Get the userId from localStorage
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        console.log('Fetched userId:', userId); // Log userId for debugging
        if (!userId) {
            console.error('No userId found in localStorage');
        }
    }, [userId]);

    // Function to handle product click (Navigate to Edit page)
    const handleProductClick = (id) => {
        navigate(`/EditProduct/${id}`);
    };

    // Function to open delete modal
    const openDeleteModal = (id) => {
        setProductToDelete(id);
        setIsModalOpen(true);
    };

    // Function to close delete modal
    const closeModal = () => {
        setIsModalOpen(false);
        setProductToDelete(null);
    };

    // Fetch products for the logged-in seller
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/user-products?user_id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProducts();
        }
    }, [userId]);

    // Function to delete the product
    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/user-products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error("Failed to delete product: " + data.message);
                return;
            }

            const data = await response.json(); // Parse the success message
            toast.success(data.message); // Show success message as a toast

            // Remove the product from the local state
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
            closeModal(); // Close the modal after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product'); // Show error message as a toast
        }
    };

    // Filter products based on category if selected
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    return (
        <div>
            <div className='category_title'></div>
            <div className="product-list">
                {loading ? (
                    <p>Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p>No products found in this category or matching your seller ID.</p>
                ) : (
                    filteredProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="product-card" 
                            onClick={() => handleProductClick(product.id)} 
                        >
                            <button 
                                className="cross-button" 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering product click
                                    openDeleteModal(product.id); // Open the delete modal
                                }} 
                            >
                                ×
                            </button>
                            <div className="product-image-wrapper">
                                {product.image ? (
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="product-image" 
                                    />
                                ) : (
                                    <div className="placeholder-image">No Image Available</div>
                                )}
                            </div>
                            <h3>{product.name}</h3>
                            <strong>PHP</strong> {product.price} / <i className="term">{product.term_value} {product.term_id}</i>
                        </div>
                    ))
                )}
            </div>

            {/* Render the confirmation modal */}
            <Confirmation 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onConfirm={() => {
                    if (productToDelete) {
                        handleDeleteProduct(productToDelete); // Call delete function
                    }
                }} 
            />

            <ToastContainer /> {/* Toast container for displaying toasts */}
        </div>
    );
};

export default ProductListAdmin;