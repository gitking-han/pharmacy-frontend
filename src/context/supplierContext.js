import { createContext, useState, useEffect, useCallback } from "react";

const SupplierContext = createContext();

const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Auth headers
  const getAuthHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("token"),
  }), []);

  // ✅ Fetch suppliers
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.suppliers || []);
        console.log("Supplier fetch response:", data);

      } else {
        console.error("Fetch suppliers error:", data.message || data.error);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // ✅ Add supplier
  const addSupplier = async (supplierData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers/add", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(supplierData),
      });
      const data = await res.json();

      if (data.success) {
        setSuppliers((prev) => [...prev, data.supplier]);
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error };
      }
    } catch (err) {
      console.error("Add Supplier Error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete supplier
  const deleteSupplier = async (id) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers((prev) => prev.filter((s) => s._id !== id));
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error };
      }
    } catch (err) {
      console.error("Delete Supplier Error:", err);
      return { success: false, error: err.message };
    }
  };

  // ✅ Update supplier
  const updateSupplier = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) {
        // Option 1: re-fetch all
        await fetchSuppliers();
        return { success: true };
      } else {
        return { success: false, message: data.message || data.error };
      }
    } catch (err) {
      console.error("Update Supplier Error:", err);
      return { success: false, error: err.message };
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        setSuppliers,
        addSupplier,
        fetchSuppliers,
        loading,
        deleteSupplier,
        updateSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export { SupplierContext, SupplierProvider };
