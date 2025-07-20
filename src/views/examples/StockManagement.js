import React, { useContext, useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Container, Row, Col,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, FormGroup, Label, Input, Table,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { StockContext } from "../../context/stockContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockManagement = () => {
  const {
    stockEntries,
    fetchStockEntries,
    deleteStockEntry,
    updateStockEntry,
  } = useContext(StockContext);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [formData, setFormData] = useState({
    quantity: "",
    costPrice: "",
    expiryDate: "",
    supplier: "",
  });

  useEffect(() => {
    fetchStockEntries();
  }, []);

  const toggleEditModal = (stock) => {
    setSelectedStock(stock);
    setFormData({
      quantity: stock.quantity,
      costPrice: stock.costPrice,
      expiryDate: stock.expiryDate?.substring(0, 10),
      supplier: stock.supplier?.name || "",
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

  return (
    <>
      <ToastContainer autoClose={1500} />
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Stock Entries</h3>
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

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>
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

      {/* Custom Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this stock entry for{" "}
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
