import React, { useContext, useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, FormGroup, Label, Input, Table,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { StockContext } from "../../context/stockContext";
import { SupplierContext } from "../../context/supplierContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockManagement = () => {
  const {
    stockEntries,
    fetchStockEntries,
    deleteStockEntry,
    updateStockEntry,
    addStockEntry,
  } = useContext(StockContext);

  const { suppliers, fetchSuppliers } = useContext(SupplierContext);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [formData, setFormData] = useState({
    quantity: "",
    costPrice: "",
    expiryDate: "",
    supplier: "",
  });

  const [addFormData, setAddFormData] = useState({
    supplierId: "",
    invoiceNo: "",
    invoiceDate: "",
    barcode: "",
    quantity: "",
    costPrice: "",
    mrp: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchStockEntries();
    fetchSuppliers();
  }, []);

  const toggleEditModal = (stock) => {
    setSelectedStock(stock);
    setFormData({
      quantity: stock.quantity,
      costPrice: stock.costPrice,
      expiryDate: stock.expiryDate?.substring(0, 10),
      supplier: stock.supplier?._id || "",
    });
    setEditModal(true);
  };

  const toggleDeleteModal = (stock) => {
    setSelectedStock(stock);
    setDeleteModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateStockEntry(selectedStock._id, formData);
      toast.success("Stock updated successfully");
      setEditModal(false);
      setSelectedStock(null);
      fetchStockEntries();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteStockEntry(selectedStock._id);
      toast.success("Stock deleted successfully");
      setDeleteModal(false);
      setSelectedStock(null);
      fetchStockEntries();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete stock");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddChange = (e) => {
    setAddFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async () => {
    try {
      const batch = {
        barcode: addFormData.barcode,
        quantity: addFormData.quantity,
        costPrice: addFormData.costPrice,
        mrp: addFormData.mrp,
        expiryDate: addFormData.expiryDate,
      };

      await addStockEntry({
        supplierId: addFormData.supplierId,
        invoiceNo: addFormData.invoiceNo,
        invoiceDate: addFormData.invoiceDate,
        batches: [batch],
      });

      toast.success("Stock added successfully");
      setAddModal(false);
      fetchStockEntries();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add stock");
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} />
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Stock Entries</h3>
                <Button color="primary" size="xl" onClick={() => setAddModal(true)}>
                  Add Stock
                </Button>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Medicine</th>
                      <th>Barcode</th>
                      <th>Quantity</th>
                      <th>Cost Price</th>
                      <th>MRP</th>
                      <th>Expiry</th>
                      <th>Supplier</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockEntries.map((stock) => (
                      <tr key={stock._id}>
                        <td>{stock.medicine?.brandName}</td>
                        <td>{stock.barcode}</td>
                        <td>{stock.quantity}</td>
                        <td>Rs {stock.costPrice}</td>
                        <td>Rs {stock.mrp}</td>
                        <td>{stock.expiryDate?.substring(0, 10) || "N/A"}</td>
                        <td>{stock.supplier?.name}</td>
                        <td>
                          <Button
                            size="sm"
                            color="info"
                            className="mr-2"
                            onClick={() => toggleEditModal(stock)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => toggleDeleteModal(stock)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {stockEntries.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          No stock entries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Stock Modal */}
      <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
        <ModalHeader toggle={() => setAddModal(!addModal)} className="d-flex justify-content-between align-items-center fs-1" close={<button className="close" onClick={() => setAddModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>Add Stock</ModalHeader>
        <ModalBody>
          <FormGroup className="mb-3">
            <Label>Supplier</Label>
            <Input
              style={{ width: "100%", borderRadius: "0.375rem", border: "1px solid lightgray", color: "gray", padding: "10px" }}
              type="select"
              name="supplierId"
              value={addFormData.supplierId}
              onChange={handleAddChange}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option style={{ border: "1px solid lightgray" }} key={s._id} value={s._id}>{s.name}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Invoice No</Label>
            <Input
              type="text"
              name="invoiceNo"
              value={addFormData.invoiceNo}
              onChange={handleAddChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Invoice Date</Label>
            <Input
              type="date"
              name="invoiceDate"
              value={addFormData.invoiceDate}
              onChange={handleAddChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Barcode</Label>
            <Input
              type="text"
              name="barcode"
              value={addFormData.barcode}
              onChange={handleAddChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={addFormData.quantity}
              onChange={handleAddChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Cost Price</Label>
            <Input
              type="number"
              name="costPrice"
              value={addFormData.costPrice}
              onChange={handleAddChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>MRP</Label>
            <Input
              type="number"
              name="mrp"
              value={addFormData.mrp}
              onChange={handleAddChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Expiry Date</Label>
            <Input
              type="date"
              name="expiryDate"
              value={addFormData.expiryDate}
              onChange={handleAddChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddSubmit}>
            Add
          </Button>
          <Button color="secondary" onClick={() => setAddModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)} className="d-flex justify-content-between align-items-center fs-1" close={<button className="close" onClick={() => setEditModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>
          Edit Stock Entry
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Cost Price</Label>
            <Input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Expiry Date</Label>
            <Input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Supplier</Label>
            <Input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)} className="d-flex justify-content-between align-items-center fs-1"  close={<button className="close" onClick={() => setDeleteModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this stock entry for {" "}
          <strong>{selectedStock?.medicine?.brandName}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default StockManagement;
