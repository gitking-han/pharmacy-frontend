import { createContext, useState, useCallback } from "react";

const StockContext = createContext();

const StockProvider = ({ children }) => {
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Memoized auth headers
  const getAuthHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("token"),
  }), []);

  // ✅ Add Stock Entry
  const addStockEntry = async (entryData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/stock-entry/add", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(entryData),
      });

      const data = await res.json();

      if (data.success) {
        if (data.entry) {
          setStockEntries((prev) => [...prev, data.entry]);
        }
        return { success: true, message: data.message || "Stock entry added" };
      } else {
        return { success: false, message: data.message || "Failed to add stock entry" };
      }
    } catch (error) {
      return { success: false, message: "Network error while adding stock" };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all Stock Entries
  const fetchStockEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stock-entry/all", {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (data.success) {
        setStockEntries(data.entries || []);
      } else {
        console.error("Fetch error:", data.message || data.error);
      }
    } catch (error) {
      console.error("Network error while fetching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Stock Entry
  const deleteStockEntry = async (id) => {
    
    try {
      const res = await fetch(`http://localhost:5000/api/stock-entry/delete/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (data.success) {
        console.log("Stock entry deleted");
        fetchStockEntries();
      } else {
        console.log(data.error || "Failed to delete");
      }
    } catch (err) {
      console.log("Server error");
    }
  };

  const updateStockEntry = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stock-entry/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Stock entry updated");
        fetchStockEntries();
      } else {
        console.log(data.error || "Update failed");
      }
    } catch (err) {
      console.log("Server error");
    }
  };

  return (
    <StockContext.Provider
      value={{
        stockEntries,
        setStockEntries,
        addStockEntry,
        fetchStockEntries,
        deleteStockEntry,
        updateStockEntry,
        loading,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export { StockContext, StockProvider };
