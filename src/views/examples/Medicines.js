import React, { useContext, useState, useRef, useEffect } from "react";
import medicineContext from "../../context/medicineContext";
import {
  Card, CardHeader, CardBody, Container, Row, Col,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, FormGroup, Label, Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Medicines = () => {
  const {
    medicines,
    deleteMedicine,
    addMedicine,
    updateMedicine,
    searchQuery,
    setSearchQuery,
    getMedicineByBarcode,
  } = useContext(medicineContext);

  const [addEditModal, setAddEditModal] = useState(false);
  const [saleModal, setSaleModal] = useState(false);

  const [form, setForm] = useState({
    brandName: "", genericName: "", strength: "", unit: "tablet",
    manufacturer: "", barcode: "", stock: 0, salePrice: 0,
  });

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const barcodeRef = useRef(null);
  const [selectedMedicinesMap, setSelectedMedicinesMap] = useState({});
  const [selectedBulkSaleItems, setSelectedBulkSaleItems] = useState([]);


  const toggleMedicineSelect = (id) => {
    setSelectedMedicinesMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isFormValid = form.brandName && form.genericName && form.barcode;
  const printSlip = (saleData) => {
    const w = window.open("", "PrintSlip", "width=600,height=600");
    const date = new Date(saleData.date).toLocaleString();

    w.document.write(`
    <html>
      <head>
        <title>Sale Receipt</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
          tfoot td { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Pharmacy Sale Slip</h2>
        <p><strong>Customer:</strong> ${saleData.customerName || "N/A"}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Sold By:</strong> ${saleData.soldBy?.name || "User"}</p>
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Barcode</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${saleData.items
        .map(
          (item) => `
              <tr>
                <td>${item.medicine.brandName}</td>
                <td>${item.medicine.barcode}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.price}</td>
                <td>Rs. ${item.total}</td>
              </tr>`
        )
        .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">Grand Total</td>
              <td>Rs. ${saleData.grandTotal}</td>
            </tr>
          </tfoot>
        </table>
        <p style="text-align:center; margin-top: 30px;">Thank you for your purchase!</p>
      </body>
    </html>
  `);
    w.document.close();
    w.print();
  };

  const toggleAddEditModal = () => {
    setAddEditModal(!addEditModal);
    if (!addEditModal) {
      setForm({
        brandName: "", genericName: "", strength: "", unit: "tablet",
        manufacturer: "", barcode: "", stock: 0, salePrice: 0,
      });
      setSelectedMedicine(null);
    }
  };

  useEffect(() => {
    if (addEditModal && !selectedMedicine) {
      setTimeout(() => barcodeRef.current?.focus(), 300);
    }
  }, [addEditModal, selectedMedicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const submission = {
        ...form,
        stock: parseInt(form.stock),
        salePrice: parseFloat(form.salePrice),
      };

      if (selectedMedicine) {
        await updateMedicine(selectedMedicine._id, submission);
        setTimeout(() => {
          toast.success("Medicine updated!");
        }, 0);
      } else {
        const existing = await getMedicineByBarcode(form.barcode);
        if (existing?.success) {
          setTimeout(() => {
            toast.error("Barcode already exists.");
          }, 0);
          setIsSaving(false);
          return;

        }
        const res = await addMedicine(submission);
        res?.success
          ? setTimeout(() => { toast.success("Medicine added!"); }, 0)
          : setTimeout(() => { toast.error(res.error || "Failed to add medicine"); }, 0);
      }
      toggleAddEditModal();
    } catch {
      setTimeout(() => { toast.error("Something went wrong."); }, 0);
    }
    setIsSaving(false);
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setForm({
      brandName: medicine.brandName,
      genericName: medicine.genericName,
      strength: medicine.strength,
      unit: medicine.unit,
      manufacturer: medicine.manufacturer,
      barcode: medicine.barcode,
      stock: medicine.stock,
      salePrice: medicine.salePrice,
    });
    setAddEditModal(true);
  };

  const confirmDelete = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteMedicine(medicineToDelete._id);
    setTimeout(() => {
      toast.success("Deleted successfully!");
    }, 0);
    setDeleteModal(false);
  };

  const openSaleModal = (medicine) => {
    setSelectedMedicine(medicine);
    setCustomerName("");
    setSaleQuantity(1);
    setSaleModal(true);
  };

  const handleConfirmSale = async () => {
    try {
      if (selectedBulkSaleItems.length > 0) {
        // ✅ Combined sale logic
        const items = selectedBulkSaleItems.map((m) => ({
          barcode: m.barcode,
          quantity: m.quantity,
        }));

        const res = await fetch("http://localhost:5000/api/sale/sell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ items, customerName }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Bulk sale successful!");
          printSlip(data.sale);
          setSelectedMedicinesMap({});
          setSelectedBulkSaleItems([]);
          setSaleModal(false);
        } else {
          toast.error(data.message || "Bulk sale failed");
        }
      } else {
        // ✅ Quick sale logic
        if (saleQuantity > selectedMedicine.stock) {
          toast.error("Not enough stock for the requested quantity.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/sale/quick-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            barcode: selectedMedicine.barcode,
            quantity: saleQuantity,
            customerName,
          }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Sale successful!");
          printSlip(data.sale);
          setSaleModal(false);
        } else {
          toast.error(data.message || "Sale failed");
        }
      }
    } catch (err) {
      toast.error("Sale failed");
      console.error("Sale error:", err);
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">
                <h3 className="mb-3 mb-md-0">Medicines List</h3>
                <div style={{ gap: "4px" }} className="d-flex align-items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "250px" }}
                  />
                  {Object.keys(selectedMedicinesMap).some((id) => selectedMedicinesMap[id]) ? (
                    <Button
                      className="w-100"
                      color="success"
                      onClick={() => {
                        const selected = medicines.filter((m) => selectedMedicinesMap[m._id]);
                        if (selected.length > 0) {
                          setSelectedBulkSaleItems(
                            selected.map((m) => ({ ...m, quantity: 1 }))
                          );
                          setCustomerName("");
                          setSaleModal(true);
                        }
                      }}
                    >
                      Confirm Sale
                    </Button>
                  ) : (
                    <Button
                      className="w-100"
                      color="primary"
                      onClick={toggleAddEditModal}
                    >
                      Add Medicine
                    </Button>
                  )}


                </div>
              </CardHeader>

              <CardBody>
                <Row>
                  {filteredMedicines.length === 0 ? (
                    <p className="mx-3">No medicines found.</p>
                  ) : (
                    filteredMedicines.map((med) => (
                      <Col lg="4" md="6" sm="12" key={med._id}>
                        <div className="card shadow-sm border border-light rounded mb-4 position-relative">
                          <div
                            className="position-absolute top-0 end-0 p-2 d-flex align-items-center"
                            style={{ gap: "10px", marginLeft: "70%", marginTop: "10px" }}
                          >
                            <Input
                              type="checkbox"
                              checked={!!selectedMedicinesMap[med._id]}
                              onChange={() => toggleMedicineSelect(med._id)}
                              className="form-check-input shadow-sm"
                              style={{
                                width: "18px",
                                height: "18px",
                                marginRight: "20px",
                                cursor: "pointer",
                              }}
                            />
                            <i
                              className="fas fa-pen text-warning hover-icon"
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(med);
                              }}
                              style={{
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                            />
                            <i
                              className="fas fa-trash text-danger hover-icon"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(med);
                              }}
                              style={{
                                fontSize: "1.1rem",
                                cursor: "pointer",
                              }}
                            />
                          </div>

                          <div
                            className="card-body pt-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => openSaleModal(med)}
                          >
                            <h4 className="card-title text-primary">{med.brandName}</h4>
                            <h6 className="text-muted">{med.genericName}</h6>
                            <hr />
                            <p><strong>Strength:</strong> {med.strength} {med.unit}</p>
                            <p><strong>Manufacturer:</strong> {med.manufacturer}</p>
                            <p><strong>Stock:</strong> {med.stock}</p>
                            <p><strong>Barcode:</strong> {med.barcode}</p>
                            <p><strong>Price:</strong> Rs. {med.salePrice?.toFixed(2)}</p>
                            <p><strong>Added:</strong> {new Date(med.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </Col>
                    ))
                  )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ➕ Add/Edit Modal */}
      <Modal isOpen={addEditModal} toggle={toggleAddEditModal}>
        <ModalHeader toggle={toggleAddEditModal}>
          {selectedMedicine ? "Update Medicine" : "Add Medicine"}
        </ModalHeader>
        <ModalBody>
          {[
            ["brandName", "Brand Name"],
            ["genericName", "Generic Name"],
            ["strength", "Strength"],
            ["manufacturer", "Manufacturer"],
            ["stock", "Stock", "number"],
            ["salePrice", "Sale Price (Rs.)", "number"],
            ["barcode", "Barcode"],
          ].map(([name, label, type = "text"]) => (
            <FormGroup key={name}>
              <Label>{label}</Label>
              <Input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                innerRef={name === "barcode" ? barcodeRef : null}
                required
                disabled={name === "barcode" && selectedMedicine}
              />
            </FormGroup>
          ))}
          <FormGroup>
            <Label>Unit</Label>
            <Input type="select" name="unit" value={form.unit} onChange={handleChange}>
              <option value="tablet">Tablet</option>
              <option value="strip">Strip</option>
              <option value="bottle">Bottle</option>
              <option value="syrup">Syrup</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={!isFormValid || isSaving}
          >
            {isSaving ? "Saving..." : selectedMedicine ? "Update" : "Add"}
          </Button>
          <Button onClick={toggleAddEditModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* 🗑 Confirm Delete */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete <strong>{medicineToDelete?.brandName}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>Yes</Button>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* 💊 Sale Modal */}
      <Modal isOpen={saleModal} toggle={() => setSaleModal(false)}>
        <ModalHeader toggle={() => setSaleModal(false)}>Confirm Sale</ModalHeader>
        <ModalBody>
          {selectedBulkSaleItems.length > 0 ? (
            <>
              <div className="bulk-sale-items">
                {selectedBulkSaleItems.map((med, idx) => (
                  <Row key={med._id} className="border-bottom py-2 align-items-center">
                    <Col md="6" xs="12" className="mb-2 mb-md-0">
                      <h6 className="mb-1">{med.brandName} <small className="text-muted">({med.genericName})</small></h6>
                      <small className="text-muted d-block">Stock: {med.stock}</small>
                      <small className="text-muted d-block">Barcode: {med.barcode}</small>
                    </Col>

                    <Col md="6" xs="12">
                      <FormGroup className="mb-0">
                        <Label for={`qty-${med._id}`} className="mb-0">Quantity</Label>
                        <Input
                          id={`qty-${med._id}`}
                          type="number"
                          min={1}
                          max={med.stock}
                          value={med.quantity || 1}
                          onChange={(e) => {
                            const updated = [...selectedBulkSaleItems];
                            updated[idx].quantity = Math.max(1, Math.min(med.stock, parseInt(e.target.value) || 1));
                            setSelectedBulkSaleItems(updated);
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                ))}
              </div>

              <FormGroup className="mt-3">
                <Label>Customer Name</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Optional"
                />
              </FormGroup>
            </>

          ) : selectedMedicine && (
            <>
              <p><strong>Brand Name:</strong> {selectedMedicine.brandName}</p>
              <p><strong>Generic Name:</strong> {selectedMedicine.genericName}</p>
              <p><strong>Strength:</strong> {selectedMedicine.strength} {selectedMedicine.unit}</p>
              <p><strong>Manufacturer:</strong> {selectedMedicine.manufacturer}</p>
              <p><strong>Stock Available:</strong> {selectedMedicine.stock}</p>
              <p><strong>Barcode:</strong> {selectedMedicine.barcode}</p>
              <p><strong>Price:</strong> Rs. {selectedMedicine.salePrice?.toFixed(2)}</p>
              <p><strong>Added:</strong> {new Date(selectedMedicine.createdAt).toLocaleDateString()}</p>

              <FormGroup>
                <Label>Customer Name</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Optional"
                />
              </FormGroup>
              <FormGroup>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={selectedMedicine.stock}
                />
              </FormGroup>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            color="success"
            onClick={handleConfirmSale}
            disabled={
              (selectedBulkSaleItems.length === 0 && !selectedMedicine) ||
              (selectedBulkSaleItems.length > 0 &&
                selectedBulkSaleItems.some((m) => m.quantity <= 0 || m.quantity > m.stock))
            }
          >
            Confirm Sale
          </Button>
          <Button onClick={() => setSaleModal(false)}>Cancel</Button>
        </ModalFooter>

      </Modal>
    </>
  );
};

export default Medicines;
