import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Button,
  Input,
  FormGroup,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import SaleContext from "../../context/saleContext";
import Header from "components/Headers/Header.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sales = () => {
  const { cartItems } = useContext(SaleContext);
  const [sales, setSales] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const slipRef = useRef(null);
  const [printData, setPrintData] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const fetchSales = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/sale/all`, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (data.success) {
        setSales(data.sales);
      } else {
        toast.error("Failed to fetch sales");
      }
    } catch (err) {
      toast.error("Error fetching sales");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleOpenDeleteModal = (sale) => {
    setSelectedSale(sale);
    setDeleteModal(true);
  };

  const handleDeleteSale = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/sale/${selectedSale._id}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Sale deleted");
        setDeleteModal(false);
        setSelectedSale(null);
        fetchSales();
      } else {
        toast.error("Failed to delete sale");
      }
    } catch (err) {
      toast.error("Error deleting sale");
    }
  };

  const filteredSales = sales.filter((sale) => {
    if (!searchValue.trim()) return true;

    if (searchType === "name") {
      return sale.customerName?.toLowerCase().includes(searchValue.toLowerCase());
    }

    if (searchType === "date") {
      return new Date(sale.date).toISOString().slice(0, 10) === searchValue;
    }

    if (searchType === "price") {
      return sale.grandTotal.toFixed(2).includes(searchValue);
    }

    return true;
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <Header />
      <Container fluid className="mb-5">
        {/* 🔍 Filter Row */}
        <Row className="p-4 bg-white rounded shadow-lg mx-3 mx-md-auto g-2" style={{ maxWidth: "900px" }}>
          <Col xs="12" md="4">
            <FormGroup style={{ marginBottom: "0" }}>
              <Input
                style={{ padding: "10px 15px", border: "1px solid lightgray", color: "gray", borderRadius:"8px" }}
                type="select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="name">Filter by Name</option>
                <option value="date">Filter by Date</option>
                <option value="price">Filter by Price</option>
              </Input>
            </FormGroup>
          </Col>
          <Col xs="12" md="8" className="pt-md-0 pt-3">
            <FormGroup style={{ marginBottom: "0" }}>
              <Input
                type={
                  searchType === "date"
                    ? "date"
                    : searchType === "price"
                    ? "number"
                    : "text"
                }
                placeholder={`Search ${
                  searchType === "name"
                    ? "by Name"
                    : searchType === "price"
                    ? "by Price"
                    : ""
                }`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>

        {/* 📋 Sales Table */}
        <Row className="pt-3 px-3">
          <div className="col">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Previous Sales</h3>
              </CardHeader>
              <Table responsive className="align-items-center">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Customer</th>
                    <th>Grand Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale, index) => (
                      <tr key={sale._id}>
                        <td>{index + 1}</td>
                        <td>{new Date(sale.date).toLocaleString()}</td>
                        <td>
                          {sale.items.map((item, i) => (
                            <div key={i}>
                              {item.medicine?.brandName} x {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td>{sale.customerName || "-"}</td>
                        <td>Rs. {sale.grandTotal.toFixed(2)}</td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(sale)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No sales found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      {/* 🖨️ Hidden Print Slip */}
      <div ref={slipRef} style={{ display: "none" }}>
        <h2>Pharmacy Sale Slip</h2>
        <h4>{printData?.date}</h4>
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Barcode</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {printData?.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.barcode}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total">
          <strong>Grand Total: Rs. {printData?.grandTotal.toFixed(2)}</strong>
        </div>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Thank you for your purchase!
        </p>
      </div>

      {/* 🗑️ Custom Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)} className="d-flex justify-content-between align-items-center fs-1"  close={<button className="close" onClick={() => setDeleteModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this sale record for{" "}
          <strong>{selectedSale?.customerName || "Unnamed Customer"}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteSale}>
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

export default Sales;
