import React, { useState, useContext, useMemo } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button, Table
} from "reactstrap";
import Header from "components/Headers/Header";
import { useReturn } from "context/ReturnContext";
import { StockContext } from "context/stockContext";

const ReturnMedicine = () => {
  const { returns, addReturn, updateReturn, deleteReturn, loading } = useReturn();
  const { stockEntries } = useContext(StockContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const [form, setForm] = useState({
    stockEntryId: "",
    medicine: "",
    batch: "",
    quantity: 1,
    reason: "",
    returnType: "customer",
    returnedBy: "",
  });

  const stockInfoMap = useMemo(() => {
    const map = {};
    stockEntries.forEach(se => {
      const medObj = se.medicine && typeof se.medicine === "object" ? se.medicine : null;
      map[se._id] = {
        medicineId: medObj ? medObj._id : se.medicine,
        medicineName: medObj ? medObj.brandName || medObj.name : se.medicine,
        batch: se.batch || "",
        availableQty: se.quantity,
        invoiceNo: se.invoiceNo,
      };
    });
    return map;
  }, [stockEntries]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && !editingItem) resetForm();
  };

  const resetForm = () => {
    setForm({
      stockEntryId: "",
      medicine: "",
      batch: "",
      quantity: 1,
      reason: "",
      returnType: "customer",
      returnedBy: "",
    });
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stockEntryId") {
      const info = stockInfoMap[value];
      setForm(prev => ({
        ...prev,
        stockEntryId: value,
        medicine: info?.medicineId || "",
        batch: info?.batch || "",
        quantity: prev.quantity > (info?.availableQty || 1) ? info.availableQty : prev.quantity,
      }));
    } else if (name === "quantity" && form.stockEntryId) {
      const maxQty = stockInfoMap[form.stockEntryId]?.availableQty ?? Infinity;
      const num = Number(value);
      setForm(prev => ({
        ...prev,
        quantity: num > maxQty ? maxQty : num,
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      date: new Date().toISOString().slice(0, 10),
    };

    if (editingItem) {
      await updateReturn(editingItem._id, payload);
    } else {
      await addReturn(payload);
    }

    toggleModal();
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      stockEntryId: item.stockEntryId || "",
      medicine: typeof item.medicine === "object" ? item.medicine._id : item.medicine,
      batch: item.batch || "",
      quantity: item.quantity,
      reason: item.reason,
      returnType: item.returnType,
      returnedBy: item.returnedBy,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteReturn(deletingItem._id);
    setDeletingItem(null);
    setIsDeleteModalOpen(false);
  };

  const getMedName = (ret) => {
    if (ret.medicine && typeof ret.medicine === "object") return ret.medicine.name || ret.medicine.brandName;
    const stockInfo = stockInfoMap[ret.stockEntryId];
    return stockInfo?.medicineName || ret.medicine;
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Return Medicine</h2>
            <Button color="primary" onClick={toggleModal}>
              + Add Return
            </Button>
          </div>

          <Table responsive bordered hover>
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Return Type</th>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Reason</th>
                <th>Returned By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center">Loading...</td></tr>
              ) : returns.length === 0 ? (
                <tr><td colSpan="8" className="text-center">No records found.</td></tr>
              ) : (
                returns.map((item, idx) => (
                  <tr key={item._id}>
                    <td>{idx + 1}</td>
                    <td>{item.returnType}</td>
                    <td>{getMedName(item)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reason}</td>
                    <td>{item.returnedBy}</td>
                    <td>{item.date}</td>
                    <td>
                      <Button size="sm" color="warning" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(item)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Add/Edit Modal */}
        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal} className="d-flex justify-content-between align-items-center fs-1"  close={<button className="close" onClick={() => setIsModalOpen(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>
            {editingItem ? "Edit Return" : "Return Medicine"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <Label>Return Type</Label>
                <Input style={{ width: "100%", borderRadius: "0.375rem", border: "1px solid lightgray", color: "gray", padding: "10px" }} type="select" name="returnType" value={form.returnType} onChange={handleChange}>
                  <option value="customer">Customer Return</option>
                  <option value="supplier">Supplier Return</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Stock Entry</Label>
                <Input
                  style={{ width: "100%", borderRadius: "0.375rem", border: "1px solid lightgray", color: "gray", padding: "10px" }}
                  type="select"
                  name="stockEntryId"
                  value={form.stockEntryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Stock</option>
                  {stockEntries.map((entry) => {
                    const medObj = entry.medicine;
                    const medName =
                      medObj && typeof medObj === "object"
                        ? medObj.brandName || medObj.name
                        : entry.medicineName || "Unknown";
                    return (
                      <option key={entry._id} value={entry._id}>
                        {entry.invoiceNo} | {medName} | Qty: {entry.quantity}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Medicine</Label>
                <Input
                  type="text"
                  value={stockInfoMap[form.stockEntryId]?.medicineName || ""}
                  disabled
                />
              </FormGroup>


              <FormGroup>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min={1}
                  max={stockInfoMap[form.stockEntryId]?.availableQty ?? ""}
                  required
                />
                {form.stockEntryId && (
                  <small className="text-muted">
                    Available: {stockInfoMap[form.stockEntryId]?.availableQty ?? 0}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Reason</Label>
                <Input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>{form.returnType === "customer" ? "Customer Name" : "Supplier Name"}</Label>
                <Input
                  type="text"
                  name="returnedBy"
                  value={form.returnedBy}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <Button color="success" type="submit" block>
                {editingItem ? "Update Return" : "Submit Return"}
              </Button>
            </Form>
          </ModalBody>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
          <ModalHeader toggle={() => setIsDeleteModalOpen(false)} className="d-flex justify-content-between align-items-center fs-1"  close={<button className="close" onClick={() => setIsDeleteModalOpen(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>Confirm Deletion</ModalHeader>
          <ModalBody>Are you sure you want to delete this return?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmDelete}>Yes, Delete</Button>
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default ReturnMedicine;
