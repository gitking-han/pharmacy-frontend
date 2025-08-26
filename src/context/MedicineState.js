import React, { useState, useEffect, useCallback } from "react";
import medicineContext from "./medicineContext";
import { jwtDecode } from "jwt-decode";

const MedicineState = (props) => {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("User");
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  // ✅ Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.user?.name) setUserName(decoded.user.name);
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, []);

  // ✅ Auth headers
  const getAuthHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("token"),
  }), []);

  // ✅ Fetch all medicines
  const fetchMedicines = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/medicine/all`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMedicines(data.medicines);
      } else {
        console.error("Fetch error:", data.error || data.message);
      }
    } catch (err) {
      console.error("Fetch medicines error:", err);
    }
  }, [getAuthHeaders]);

  // ✅ Add medicine
  const addMedicine = async (medicine) => {
    // Ensure salePrice is a float before sending
    const payload = {
      ...medicine,
      salePrice: parseFloat(medicine.salePrice),
      stock: parseInt(medicine.stock)
    };

    try {
      const res = await fetch(`${backendUrl}/api/medicine/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMedicines((prev) => [...prev, data.medicine]);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message };
      }
    } catch (err) {
      console.error("Add medicine error:", err);
      return { success: false, error: "Network error" };
    }
  };

  // ✅ Delete medicine
  const deleteMedicine = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/medicine/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMedicines(prev => prev.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Update medicine
  const updateMedicine = async (id, updatedData) => {
    const payload = {
      ...updatedData,
      salePrice: parseFloat(updatedData.salePrice),
      stock: parseInt(updatedData.stock),
    };

    try {
      const res = await fetch(`${backendUrl}/api/medicine/update/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMedicines(prev => prev.map(m => (m._id === id ? data.medicine : m)));
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ Get by barcode
  const getMedicineByBarcode = async (barcode) => {
    try {
      const res = await fetch(`${backendUrl}/api/medicine/barcode/${barcode}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data; // { success, medicine, message }
    } catch (err) {
      console.error("Barcode fetch error:", err);
      return { success: false, error: "Network error" };
    }
  };

  // ✅ Update stock by barcode (used after stock entry)
  const updateStockByBarcode = (barcode, quantityToAdd) => {
    setMedicines(prev =>
      prev.map(med =>
        med.barcode === barcode
          ? { ...med, stock: (med.stock || 0) + quantityToAdd }
          : med
      )
    );
  };

  // ✅ Clear all medicines (logout or refresh)
  const clearMedicines = () => setMedicines([]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return (
    <medicineContext.Provider
      value={{
        medicines,
        setMedicines,
        addMedicine,
        deleteMedicine,
        updateMedicine,
        fetchMedicines,
        getMedicineByBarcode,
        updateStockByBarcode,
        clearMedicines,
        searchQuery,
        setSearchQuery,
        userName,
      }}
    >
      {props.children}
    </medicineContext.Provider>
  );
};

export default MedicineState;
