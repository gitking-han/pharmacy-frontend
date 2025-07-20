import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Col,
  Label,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;

    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();

    if (json.success) {
      localStorage.setItem("token", json.authToken);
      toast.success("Signup Successful");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } else {
      toast.error(json.error || "Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg").default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>

          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    id="name"
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={credentials.name}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <InputGroup className="input-group-alternative mb-3">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label for="password">Password</Label>
                <InputGroup className="input-group-alternative">
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <div className="text-muted font-italic">
                <small>
                  password strength:{" "}
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>

              <FormGroup check className="my-4">
                <Input type="checkbox" id="customCheckRegister" />
                <Label check htmlFor="customCheckRegister">
                  <span className="text-muted">
                    I agree with the{" "}
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </span>
                </Label>
              </FormGroup>

              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
