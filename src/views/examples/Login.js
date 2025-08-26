import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  InputGroupText,
  Input,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import medicineContext from "../../context/medicineContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { clearMedicines } = useContext(medicineContext);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authToken);
        clearMedicines();
        toast.success("Login Successful");

        setTimeout(() => {
          navigate("/admin/index");
        }, 1500);
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/google.svg").default}
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                  <Input
                    style={{ padding: "5px" }}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={onChange}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                  <Input
                    style={{ padding: "5px" }}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={onChange}
                    required
                    minLength={5}
                  />
                </InputGroup>
              </FormGroup>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <div className="text-center">
                <Button color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/register");
              }}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
