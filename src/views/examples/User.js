import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header.js";

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    image: "",
    passwordHash: "",
    phone: "",
    address: "",
    role: "Customer",
    status: "Active",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/User", {
        headers: {
          Authorization: token,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load user data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      fullName: "",
      email: "",
      image: "",
      passwordHash: "",
      phone: "",
      address: "",
      role: "Customer",
      status: "Active",
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEdit(true);
    setFormData({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
      passwordHash: user.passwordHash,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("passwordHash", formData.passwordHash);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("role", formData.role);
      form.append("status", formData.status);
      if (formData.image) {
        form.append("image", formData.image);
      }

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/User/${formData.id}`, form, {
          headers: { Authorization: token },
        });
      } else {
        await axios.post("https://localhost:7018/api/User", form, {
          headers: { Authorization: token },
        });
      }

      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/User/${id}`, {
        headers: { Authorization: token },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between">
                <h3 className="mb-0">User Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add User
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Full Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Address</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            {user.image ? (
                              <img
                                alt="User Image"
                                src={user.image}
                                className="avatar rounded-circle mr-3"
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                className="avatar rounded-circle mr-3 bg-secondary text-white text-center d-flex align-items-center justify-content-center"
                                style={{
                                  width: 60,
                                  height: 60,
                                  fontSize: 24,
                                }}
                              >
                                {user.fullName.charAt(0)}
                              </div>
                            )}
                          </Media>
                        </th>
                        <td className="font-weight-bold">{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.address}</td>
                        <td>{user.role}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={user.status === "Active" ? "bg-success" : "bg-warning"}
                            />
                            {user.status}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={() => openEditModal(user)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(user.id)}>
                                <i className="fas fa-trash text-danger mr-2" />
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <CardFooter className="py-4">
                <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end">
                  <PaginationItem className="disabled">
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fas fa-angle-left" />
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="active">
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fas fa-angle-right" />
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {isEdit ? "Edit User" : "Add User"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <Label for="passwordHash">Password</Label>
              <Input
                type="password"
                id="passwordHash"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleInputChange}
                placeholder="Password"
              />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
            </FormGroup>
            <FormGroup>
              <Label for="role">Role</Label>
              <Input
                type="select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="image">Image</Label>
              <Input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            {isEdit ? "Update" : "Add"}
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default User;
