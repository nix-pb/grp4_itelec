import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductListOrder from '../ProductListOrder';
import ProductListPending from '../ProductListPending';
import ProductListInTransit from '../ProductListInTransit';
import Header from '../Header';

const Orders = () => {
    const navigate = useNavigate();

    const [orderStatus, setOrderStatus] = useState("Pending");

    const goToHome = () => {
        navigate('/Home');
    };

    const changeOrderStatus = () => {
        // Cycle through statuses
        if (orderStatus === "Pending") {
            setOrderStatus("In Transit");
        } else if (orderStatus === "In Transit") {
            setOrderStatus("Delivered");
        } else {
            setOrderStatus("Pending");
        }
    };

    return (
        <>
            <Header />
            <div>Orders Page</div>

            <div>
                {/* Clickable section to change the order status */}
                <div 
                    style={{
                        padding: "10px", 
                        border: "1px solid #ccc", 
                        cursor: "pointer",
                        backgroundColor: "#f4f4f4",
                        display: "inline-block"
                    }} 
                    onClick={changeOrderStatus}
                >
                    Order Status: {orderStatus}
                </div>
            </div>

            <ProductListOrder />
            <ProductListPending />
            <ProductListInTransit />
        </>
    );
}

export default Orders;
