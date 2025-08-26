import React, { createContext, useContext, useState, useEffect } from "react";

const ReturnContext = createContext();

export const useReturn = () => useContext(ReturnContext);

export const ReturnProvider = ({ children }) => {
  const [returns, setReturns] = useState([]);

  // 🔄 Fetch all returns from backend
  const fetchReturns = async () => {
    try {
      const res = await fetch("/api/return/all");
      const data = await res.json();
      setReturns(data);
    } catch (error) {
      console.error("Error fetching returns:", error);
    }
  };

  // ➕ Add return (must include stockEntryId)
  const addReturn = async (returnData) => {
    try {
      const res = await fetch("/api/return/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnData),
      });
      const data = await res.json();
      if (res.ok) {
        setReturns((prev) => [...prev, data]);
      } else {
        console.error("Add return failed:", data?.error);
      }
    } catch (error) {
      console.error("Error adding return:", error);
    }
  };

  // 🗑️ Delete return
  const deleteReturn = async (id) => {
    try {
      const res = await fetch(`/api/return/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReturns((prev) => prev.filter((ret) => ret._id !== id));
      } else {
        const data = await res.json();
        console.error("Delete return failed:", data?.error);
      }
    } catch (error) {
      console.error("Error deleting return:", error);
    }
  };

  // ✏️ Update return (also supports updating stock)
  const updateReturn = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/return/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setReturns((prev) =>
          prev.map((ret) => (ret._id === id ? data : ret))
        );
      } else {
        console.error("Update return failed:", data?.error);
      }
    } catch (error) {
      console.error("Error updating return:", error);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <ReturnContext.Provider
      value={{
        returns,
        addReturn,
        deleteReturn,
        updateReturn,
        fetchReturns,
      }}
    >
      {children}
    </ReturnContext.Provider>
  );
};
