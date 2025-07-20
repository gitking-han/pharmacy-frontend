import React, { useState } from "react";
import SaleContext from "./saleContext";

const SaleState = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // { barcode, name, price, quantity, total }
  const [grandTotal, setGrandTotal] = useState(0);

  const calculateGrandTotal = (items) =>
    items.reduce((acc, item) => acc + item.total, 0);

  // ✅ Add or update item in cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.barcode === item.barcode);
      let updated;

      if (existing) {
        updated = prevItems.map((i) =>
          i.barcode === item.barcode
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                total: (i.quantity + item.quantity) * i.price,
              }
            : i
        );
      } else {
        updated = [...prevItems, { ...item, total: item.quantity * item.price }];
      }

      setGrandTotal(calculateGrandTotal(updated));
      return updated;
    });
  };

  // ✅ Remove item
  const removeFromCart = (barcode) => {
    const updated = cartItems.filter((item) => item.barcode !== barcode);
    setCartItems(updated);
    setGrandTotal(calculateGrandTotal(updated));
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCartItems([]);
    setGrandTotal(0);
  };

  // ✅ Submit sale — accepts optional customer name
  const submitSale = async (customerName = "") => {
    try {
      const response = await fetch("http://localhost:5000/api/sale/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            barcode: item.barcode,
            quantity: item.quantity,
          })),
          customerName: customerName.trim() !== "" ? customerName.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const sale = data.sale;

        // Optional: Restore name/barcode in response if not populated from backend
        for (let i = 0; i < sale.items.length; i++) {
          const cartItem = cartItems.find(
            (c) => c.barcode === sale.items[i].medicine?.barcode
          );
          if (cartItem) {
            sale.items[i].medicine.brandName = cartItem.name;
            sale.items[i].medicine.barcode = cartItem.barcode;
          }
        }

        clearCart();

        return {
          success: true,
          message: "Sale successful!",
          sale: sale, // For slip
        };
      } else {
        return {
          success: false,
          message: data.message || "Sale failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Server error: " + error.message,
      };
    }
  };

    // ✅ Get all previous sales
  const fetchAllSales = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sale/all", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      return data.success ? data.sales : [];
    } catch (error) {
      console.error("Error fetching sales:", error);
      return [];
    }
  };

  // ✅ Get a single sale by ID
  const getSaleById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sale/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      return data.success ? data.sale : null;
    } catch (error) {
      console.error("Error fetching sale:", error);
      return null;
    }
  };

  // ✅ Update a sale (e.g. update customer name)
  const updateSale = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sale/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: "Update failed." };
    }
  };

  // ✅ Delete a sale
  const deleteSale = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sale/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: "Deletion failed." };
    }
  };


  return (
    <SaleContext.Provider
      value={{
        cartItems,
        grandTotal,
        addToCart,
        removeFromCart,
        clearCart,
        submitSale,
        fetchAllSales, // 👈 new
        getSaleById,   // 👈 new
        updateSale,    // 👈 new
        deleteSale,    // 👈 new
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export default SaleState;
