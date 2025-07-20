/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

*/

import { useState } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import PharMAn from "../../assets/img/brand/PharMAn.jpg";

// reactstrap components (cleaned for Bootstrap 5)
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const location = useLocation();

  const activeRoute = (routeName) =>
    location.pathname.indexOf(routeName) > -1 ? "active" : "";

  const toggleCollapse = () => setCollapseOpen((prev) => !prev);
  const closeCollapse = () => setCollapseOpen(false);

  const createLinks = (routes) => {
    const isLoggedIn = !!localStorage.getItem("token");

    return routes.map((prop, key) => {
      const isAuthRoute = prop.name === "Login" || prop.name === "Register";
      const isLogout = prop.name === "Logout";

      const shouldDisable =
        (isAuthRoute && isLoggedIn) || (!isAuthRoute && !isLoggedIn && !isLogout);

      const handleNavClick = (e) => {
        if (shouldDisable) e.preventDefault();
        else closeCollapse();
      };

      return (
        <NavItem key={key}>
          <NavLink
            to={shouldDisable ? "#" : prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={handleNavClick}
            className={`${activeRoute(prop.layout + prop.path)} ${shouldDisable ? "text-muted disabled" : ""}`}
            style={shouldDisable ? { pointerEvents: "none", opacity: 0.5 } : {}}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const { routes, logo } = props;

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        {logo ? (
          <NavbarBrand
            className="d-flex align-items-center pt-2 ps-3"
            {...navbarBrandProps}
          >
            <img
              src={PharMAn}
              alt="PharMan Logo"
              className="img-fluid"
              style={{ maxHeight: "200px", height: "auto", width: "auto" }}
            />
          </NavbarBrand>
        ) : null}

        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header (mobile only) */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img
                        alt={logo.imgAlt}
                        src={PharMAn}
                        style={{ maxHeight: "75px", height: "auto", width: "auto" }}
                      />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img
                        alt={logo.imgAlt}
                        src={PharMAn}
                        style={{ maxHeight: "75px", height: "auto", width: "auto" }}
                      />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Search Form (Mobile Only) */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <InputGroupText>
                <span className="fa fa-search" />
              </InputGroupText>
              <Input
                aria-label="Search"
                className="form-control-rounded"
                placeholder="Search"
                type="search"
              />
            </InputGroup>
          </Form>

          {/* Navigation */}
          <Nav navbar>
            {createLinks(
              routes.filter(
                (route) => route.path !== "/login" && route.path !== "/register"
              )
            )}
          </Nav>

        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
