import React, { useContext } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { ProfileContext } from "../../context/ProfileContext";

const Profile = () => {
  const { profile } = useContext(ProfileContext);

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          {/* Left side card */}
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={
                          profile?.avatarUrl
                            ? profile.avatarUrl
                            : require("../../assets/img/theme/team-4-800x800.jpg")
                        }
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">{profile?.friends || 22}</span>
                        <span className="description">Friends</span>
                      </div>
                      <div>
                        <span className="heading">{profile?.photos || 10}</span>
                        <span className="description">Photos</span>
                      </div>
                      <div>
                        <span className="heading">{profile?.comments || 89}</span>
                        <span className="description">Comments</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    {`${profile?.firstName || "First"} ${profile?.lastName || "Last"}`}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {profile?.address?.city || "City"}, {profile?.address?.country || "Country"}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {profile?.username || "Username"}
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    {profile?.email || "Email not set"}
                  </div>
                  <hr className="my-4" />
                  <p>{profile?.about || "No description available."}</p>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Show more
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Right side card */}
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="primary" size="sm">
                      Settings
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.username || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.email || ""}
                            readOnly
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.firstName || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.lastName || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />

                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label className="form-control-label">
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.address?.line1 || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.address?.city || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.address?.country || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">
                            Postal code
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profile?.address?.zip || ""}
                            readOnly
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />

                  {/* About me */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        value={profile?.about || ""}
                        readOnly
                        type="textarea"
                        rows="4"
                      />
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
