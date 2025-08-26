import React, { useContext, useState } from "react";
import {
  Card, CardBody, CardTitle, CardText, Row, Col, Container, Badge, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, Input
} from "reactstrap";

import Header from "components/Headers/Header.js";

import { SupplierContext } from "../../context/supplierContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Suppliers = () => {
  const {
    suppliers,
    addSupplier,
    deleteSupplier,
    updateSupplier
  } = useContext(SupplierContext);




  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [editSupplierModal, setEditSupplierModal] = useState(false);

  const [supplierToEdit, setSupplierToEdit] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });


  const handleAddSupplier = async () => {
    const { name, email, contact, address } = newSupplier;
    if (!name || !email || !contact || !address) {
      toast.error("Please fill in all fields.");
      return;
    }

    await addSupplier(newSupplier);
    toast.success("Supplier added successfully");
    setAddSupplierModal(false);
    setNewSupplier({ name: "", email: "", contact: "", address: "" });
  };

  const confirmDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    await deleteSupplier(supplierToDelete._id);
    toast.success("Supplier deleted", { autoClose: 1000 });
    setDeleteModal(false);
    setSupplierToDelete(null);
  };


  const openEditModal = (supplier) => {
    setSupplierToEdit(supplier);
    setEditSupplierModal(true);
  };

  const handleUpdateSupplier = async () => {
    const { _id, name, email, contact, address } = supplierToEdit;
    if (!name || !email || !contact || !address) {
      toast.error("All fields are required");
      return;
    }

    await updateSupplier(_id, { name, email, contact, address });
    toast.success("Supplier updated");
    setEditSupplierModal(false);
  };

  return (
    <>
      <Header />
      <ToastContainer autoClose={500} />
      <Container className="mt--5 position-relative" fluid>
        <Row className="mb-4 align-items-stretch">
          <Col xs="12">
            <Card className="bg-white shadow border-0 w-100">
              <CardBody className="py-3 px-0 px-md-5 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div className="w-100 w-md-75">
                  <h2 className="text-dark mb-2">Suppliers</h2>
                  <p className="text-muted mb-0">
                    Manage and view all registered suppliers.
                  </p>
                </div>
                <div className="w-50 w-md-auto mt-3 mt-md-0">
                  <Button
                    color="primary"
                    className="w-100 w-md-auto"
                    onClick={() => setAddSupplierModal(true)}
                  >
                    + Add Supplier
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>


        <Row>
          {suppliers.map((supplier) => (
            <Col lg="4" md="6" sm="12" key={supplier._id} className="mb-4">
              <Card className="shadow border-0 h-100 card-hover">
                <CardBody>
                  <CardTitle tag="h4" className="text-dark font-weight-bold mb-3">
                    {supplier.name}
                  </CardTitle>
                  <CardText className="text-muted mb-2">
                    <i className="ni ni-email-83 text-primary me-2" /> {supplier.email}
                  </CardText>
                  <CardText className="text-muted mb-2">
                    <i className="ni ni-mobile-button text-success me-2" /> {supplier.contact}
                  </CardText>
                  <CardText className="text-muted mb-3">
                    <i className="ni ni-pin-3 text-warning me-2" /> {supplier.address}
                  </CardText>
                  <Badge style={{ color: "white" }} color="success" className="px-3 py-1 rounded-pill">Active</Badge>

                  <div className="mt-3 d-flex justify-content-between">

                    <Button color="warning" size="sm" onClick={() => openEditModal(supplier)}>Edit</Button>
                    <Button color="danger" size="sm" onClick={() => confirmDelete(supplier)}>Delete</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Add Supplier Modal */}
      <Modal isOpen={addSupplierModal} toggle={() => setAddSupplierModal(false)}>
        <ModalHeader className="d-flex justify-content-between align-items-center fs-1" close={<button className="close" onClick={() => setAddSupplierModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>Add New Supplier</ModalHeader>
        <ModalBody>
          <Form>
            <Input className="mb-2" placeholder="Name" value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} />
            <Input className="mb-2" placeholder="Email" value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} />
            <Input className="mb-2" placeholder="Contact" value={newSupplier.contact}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })} />
            <Input className="mb-2" placeholder="Address" value={newSupplier.address}
              onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleAddSupplier}>Add</Button>
          <Button onClick={() => setAddSupplierModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal isOpen={editSupplierModal} toggle={() => setEditSupplierModal(false)}>
        <ModalHeader className="d-flex justify-content-between align-items-center fs-1" close={<button className="close" onClick={() => setEditSupplierModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>Edit Supplier</ModalHeader>
        <ModalBody>
          <Input className="mb-2" placeholder="Name" value={supplierToEdit?.name || ""}
            onChange={(e) => setSupplierToEdit({ ...supplierToEdit, name: e.target.value })} />
          <Input className="mb-2" placeholder="Email" value={supplierToEdit?.email || ""}
            onChange={(e) => setSupplierToEdit({ ...supplierToEdit, email: e.target.value })} />
          <Input className="mb-2" placeholder="Contact" value={supplierToEdit?.contact || ""}
            onChange={(e) => setSupplierToEdit({ ...supplierToEdit, contact: e.target.value })} />
          <Input className="mb-2" placeholder="Address" value={supplierToEdit?.address || ""}
            onChange={(e) => setSupplierToEdit({ ...supplierToEdit, address: e.target.value })} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateSupplier}>Update</Button>
          <Button onClick={() => setEditSupplierModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)} className="d-flex justify-content-between align-items-center fs-1"  close={<button className="close" onClick={() => setDeleteModal(false)} style={{ fontSize: "2rem" }}>
          ×
        </button>}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete <strong>{supplierToDelete?.name}</strong>?
          This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <style>{`
        .card-hover:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
          box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
};

export default Suppliers;
