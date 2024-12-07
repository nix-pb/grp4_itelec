import React, { useState, useEffect } from "react";
// import Card from "./card";
import axios from 'axios';

const Payment = ({ totalItems = 0, subtotal = 0, shippingFee = 50 }) => {
  const totalAmount = subtotal + shippingFee;
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState("Cash on Delivery");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);


  const [change, setChange] = useState("");


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/payment-methods');
        //console.log(response.data)
        setPaymentMethods(response.data);
      } catch (err) {
        //setError(err.message);
      } finally {
        //setLoading(false);
      }
    };

    getData();
  }, []);

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      setVoucherApplied(true);
      alert(`Voucher "${voucherCode}" applied!`);
    } else {
      alert("Please enter a valid voucher code.");
    }
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    // Add any order placement logic here
  };

  const handleAmountChange = (e) => {
    setChange(totalAmount - e.target.value);
  }

  return (
    <div
      style={{
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        // padding: "20px",
      }}
    >
      {/* <Card> */}
      <div style={{
        //padding: "20px",
        // maxWidth: "500px",
        margin: "auto"
      }}>
        <label>Select Payment Method</label>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          {paymentMethods && paymentMethods.map((paymentMethod, index) => (
            <div
              key={paymentMethod.id || index} // Use index as fallback if id is not unique
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selectedPayment === paymentMethod.name ? "#f0f0f0" : "transparent", // Changed "Cash on Delivery" to use `paymentMethod.name`
              }}
            >
              <img
                src={paymentMethod.imagePath || "cod.png"} // Use a dynamic source if available, or fallback to "cod.png"
                alt={paymentMethod.name}
                style={{ width: "20px", height: "20px", marginRight: "10px" }}
              />
              <span style={{ color: !paymentMethod.isActive ? 'gray' : 'inherit', cursor: !paymentMethod.isActive ? 'not-allowed' : 'pointer' }}>
                {paymentMethod.name}
              </span>

              <input
                type="radio"
                disabled={!paymentMethod.isActive}
                value={paymentMethod.name}
                checked={selectedPayment === paymentMethod.name || paymentMethod.isDefault}
                onChange={() => handlePaymentChange(paymentMethod.name)}
                style={{ marginLeft: "auto" }}
              />
            </div>
          ))}

        </div>

        {/* <h4>Voucher</h4>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter voucher code"
              style={{
                flex: "1",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleApplyVoucher}
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div> */}

        {voucherApplied && (
          <p style={{ color: "green", fontWeight: "bold" }}>
            Voucher "{voucherCode}" has been applied!
          </p>
        )}

        <label>Order Summary</label>
        <div style={{ textAlign: "left", marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ color: "grey", fontSize: "14px" }}>Subtotal ({totalItems} {(totalItems > 1) ? 'Items' : 'Item'})</span>

            <span>
              ₱{new Intl.NumberFormat('en-PH', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(subtotal)}
            </span>

          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ color: "grey", fontSize: "14px" }}>Shipping Fee</span>
            <span>
              ₱{new Intl.NumberFormat('en-PH', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(shippingFee)}
            </span>
          </div>
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: "10px" }}>
            <span>TOTAL</span>
            ₱{new Intl.NumberFormat('en-PH', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(totalAmount)}
          </div>
        </div>
        {/* {selectedPayment !== 'Cash' &&
            <button
              onClick={handlePlaceOrder}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
                fontSize: "16px",
              }}
            >
              Place Order
            </button>
          } */}

        {selectedPayment === 'Cash' &&
          <div>
            <h4>Receive Payment</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <input
                id="paymentInput"
                type="text"
                onChange={handleAmountChange}
                placeholder="Enter amount"
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  outline: "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "1rem",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                aria-label="Amount input field"
              />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "grey", fontSize: "14px" }}>Change:</span>

                <span>
                  ₱{new Intl.NumberFormat('en-PH', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(change)}
                </span>

              </div>
              {/* <button
                  onClick={() => {
                    if (change) {
                      alert("Payment processed!");
                    } else {
                      alert("Please enter an amount before applying.");
                    }
                  }}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.3s, transform 0.2s",
                    fontSize: "1rem",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                  onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Submit
                </button> */}
            </div>
          </div>
        }
      </div>
      <br/>
      {/* </Card> */}
    </div>
  );
};


export default Payment;
