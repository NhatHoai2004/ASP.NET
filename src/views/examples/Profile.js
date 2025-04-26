import React, { useEffect, useState } from "react";
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
import UserHeader from "components/Headers/UserHeader.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    status: "",
    address: "",
    image: "",
    passwordhash: "",
    role: "",
  });

  const [tempUser, setTempUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        setUserId(id);

        const newUser = {
          fullname: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
          phone: decoded["phone"] || "",
          status: decoded["status"] || "",
          address: decoded["address"] || "",
          image: decoded["image"] || "",
          passwordhash: decoded["passwordhash"] || "",
          role: decoded["role"] || "",
        };
        setUser(newUser);
        setTempUser(newUser);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempUser((prev) => ({
          ...prev,
          image: reader.result, // giữ base64 có prefix
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Gửi cả ảnh
      const payload = { ...tempUser };

      const response = await axios.put(`https://localhost:7018/api/User/${userId}`, payload, {
        headers: {
          Authorization: `${token}`, // không dùng "Bearer" nếu backend không yêu cầu
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 204) {
        setUser(prevState => ({ ...prevState, ...tempUser }));
        setIsEditing(false);
        alert("Cập nhật thành công!");

        const updatedUser = response.data?.user;
        if (updatedUser) {
          setUser(updatedUser);
        }

        const updatedToken = response.data?.token;
        if (updatedToken) {
          localStorage.setItem("token", updatedToken);
        }
      } else {
        console.error("Cập nhật thất bại:", response);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert("Lỗi khi cập nhật profile!");
    }
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image" style={{ position: "relative", textAlign: "center" }}>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        src={tempUser.image ? tempUser.image : require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                    {isEditing && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-20px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          borderRadius: "50%",
                          padding: "5px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                        }}
                      >
                        <label htmlFor="imageUpload">
                          <i className="ni ni-camera-compact" style={{ fontSize: "18px", color: "#5e72e4" }} />
                        </label>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button className="mr-4" color="info" size="sm">
                    Connect
                  </Button>
                  <Button className="float-right" color="default" size="sm">
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <div className="text-center mt-5"></div>
              </CardBody>
            </Card>
          </Col>

          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    {!isEditing ? (
                      <Button color="primary" size="sm" onClick={handleEdit}>
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button color="success" size="sm" onClick={handleSave}>
                          Save
                        </Button>{" "}
                        <Button color="danger" size="sm" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label htmlFor="input-username">Full Name</label>
                          <Input
                            id="input-username"
                            name="fullname"
                            value={tempUser.fullname || ""}
                            onChange={handleInputChange}
                            type="text"
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label htmlFor="input-email">Email</label>
                          <Input
                            id="input-email"
                            name="email"
                            value={tempUser.email || ""}
                            onChange={handleInputChange}
                            type="email"
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label htmlFor="input-phone">Phone</label>
                          <Input
                            id="input-phone"
                            name="phone"
                            value={tempUser.phone || ""}
                            onChange={handleInputChange}
                            type="text"
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label htmlFor="input-role">Role</label>
                          <Input
                            id="input-role"
                            name="role"
                            value={tempUser.role || ""}
                            onChange={handleInputChange}
                            type="text"
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label htmlFor="input-status">Status</label>
                          <Input
                            id="input-status"
                            name="status"
                            value={tempUser.status || ""}
                            onChange={handleInputChange}
                            type="text"
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Contact information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label htmlFor="input-address">Address</label>
                          <Input
                            id="input-address"
                            name="address"
                            value={tempUser.address || ""}
                            onChange={handleInputChange}
                            type="text"
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
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
