import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { ProfileContext } from "../../context/ProfileContext";

const UserHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { profile, saveProfile } = useContext(ProfileContext);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatarUrl: "",
    address: { line1: "", city: "", state: "", zip: "", country: "" },
    about: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatarUrl: profile.avatarUrl || "",
        address: {
          line1: profile.address?.line1 || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zip: profile.address?.zip || "",
          country: profile.address?.country || "",
        },
        about: profile.about || "",
      });
    }
  }, [profile]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile(formData);
    toggleModal();
  };

  return (
    <>
      {/* Header section */}
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage:
            "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <span className="mask bg-gradient-default opacity-8" />
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">
                Hello {profile?.firstName || "User"}
              </h1>
              <p className="text-white mt-0 mb-5">
                This is your profile page. You can see the progress you've made
                with your work and manage your projects or assigned tasks.
              </p>
              <Button color="info" onClick={toggleModal}>
                Edit profile
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Edit Profile</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Username</Label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Avatar URL</Label>
                  <Input
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="Enter avatar URL"
                  />
                </FormGroup>
              </Col>
            </Row>
            <h5 className="mt-3">Address</h5>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label>Address Line</Label>
                  <Input
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={handleChange}
                    placeholder="Enter address line"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>City</Label>
                  <Input
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>State</Label>
                  <Input
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Zip</Label>
                  <Input
                    name="address.zip"
                    value={formData.address.zip}
                    onChange={handleChange}
                    placeholder="Enter zip code"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Country</Label>
                  <Input
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>About</Label>
              <Input
                type="textarea"
                rows="4"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Write something about yourself"
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserHeader;
