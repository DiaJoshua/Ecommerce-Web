import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import parcel_icon from "../../assets/parcel_icon.png";
import { io } from "socket.io-client"; // Import Socket.IO client

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const socket = io("http://localhost:4000"); // Connect to Socket.IO server

  // Fetch all orders (transactions)
  const fetchAllOrders = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/transactions"); // Fetch transaction data
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const filteredOrders = data.filter((order) => order.status !== "pending");
      setOrders(filteredOrders); // Ensure data is an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  // Update the order status
  const statusHandler = async (event, transactionId) => {
    const newStatus = event.target.value;
    try {
      const response = await fetch(
        `http://localhost:4000/api/transactions/${transactionId}`,
        {
          method: "PATCH", // Using PATCH to update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }), // Send new status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state to reflect the status change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.transactionId === transactionId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    fetchAllOrders(); // Initial fetch of orders

    // Listen for updates from the server via Socket.IO
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.transactionId === updatedOrder.transactionId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect(); // Disconnect the socket
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="container">
      <div className="order add">
        <h3>Order Page</h3>
        <div className="order-list">
          {orders.length === 0 ? (
            <p>No orders available</p>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="order-item">
                <img src={parcel_icon} alt="parcel icon" />
                <div>
                  <p className="order-item-food">
                    {order.item} {/* Display the correct item */}
                  </p>

                  <p className="order-item-name">
                    {order.name || "Unknown User"}
                  </p>

                  <div className="order-item-address">
                    <p>{order.address || "Address Not Available"}</p>
                  </div>

                  <p className="order-item-phone">
                    {order.contact || "No Phone Number"}
                  </p>
                </div>

                <p>
                  Quantity: {order.quantity}
                  {/* Display the actual quantity of items ordered */}
                </p>
                <p>₱{order.amount || "Amount Not Available"}</p>

                {/* Order status update dropdown */}
                <select
                  onChange={(event) => statusHandler(event, order.transactionId)}
                  value={order.status}
                >
                  <option value="Cart Processing">Cart Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;