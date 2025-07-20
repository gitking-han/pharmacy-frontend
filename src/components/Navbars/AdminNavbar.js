import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import jwtDecode from "jwt-decode"; // No longer needed
import { useContext } from "react";
import medicineContext from "../../context/medicineContext";
const AdminNavbar = (props) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // const [userName, setUserName] = useState("User");
const { userName } = useContext(medicineContext)
  const toggleLogoutModal = () => setIsLogoutModalOpen(!isLogoutModalOpen);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    toggleLogoutModal();
    setTimeout(() => {
      navigate("/auth/login");
    }, 1000);
  };

  

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <div
                    className="avatar avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px", fontWeight: "bold" }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold text-white">
                      {userName.split(" ")[0]}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={toggleLogoutModal}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} toggle={toggleLogoutModal}>
        <ModalBody className="text-center">
          <h5>Are you sure you want to logout?</h5>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="danger" onClick={handleConfirmLogout}>
            Yes, Logout
          </Button>
          <Button color="secondary" onClick={toggleLogoutModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminNavbar;
