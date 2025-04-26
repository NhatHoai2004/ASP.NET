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

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    status: "Pending",  // Set default status to "Pending"
    createdAt: new Date().toISOString(),
    createdBy: "admin",
  });

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Contact", {
        headers: {
          Authorization: token,
        },
      });

      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Failed to load contact data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Open modal for adding new contact
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
      status: "Pending",  // Default to "Pending"
      createdAt: new Date().toISOString(),
      createdBy: "admin",
    });
    setModalOpen(true);
  };

  // Open modal for editing existing contact
  const openEditModal = (contact) => {
    setIsEdit(true);
    setFormData({
      id: contact.id, // Add id to formData for editing
      fullName: contact.fullName,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      createdAt: contact.createdAt,
      createdBy: contact.createdBy,
    });
    setModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (isEdit) {
        // When editing, include the id in the URL
        await axios.put(
          `https://localhost:7018/api/Contact/${formData.id}`, // Send id in the URL
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        // When adding new contact, no id is needed
        await axios.post("https://localhost:7018/api/Contact", formData, {
          headers: { Authorization: token },
        });
      }

      setModalOpen(false);
      fetchContacts();
    } catch (error) {
      console.error("Error saving contact:", error);
      if (error.response && error.response.data) {
        console.log("Validation errors:", error.response.data.errors);
      }
      alert("Something went wrong while saving.");
    }
  };

  // Handle deleting a contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Contact/${id}`, {
        headers: { Authorization: token },
      });
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact.");
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
                <h3 className="mb-0">Contact Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Contact
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Full Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>{contact.fullName}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={
                                contact.status === "Unread"
                                  ? "bg-warning"
                                  : contact.status === "Pending"
                                  ? "bg-primary"
                                  : "bg-success"
                              }
                            />
                            {contact.status}
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
                              <DropdownItem onClick={() => openEditModal(contact)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(contact.id)}>
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
                <Pagination
                  className="pagination justify-content-end mb-0"
                  listClassName="justify-content-end mb-0"
                >
                  <PaginationItem disabled>
                    <PaginationLink href="#" tabIndex="-1">
                      <i className="fas fa-angle-left" />
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem active>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">
                      <i className="fas fa-angle-right" />
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal for Add/Edit */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {isEdit ? "Edit Contact" : "Add New Contact"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Message</Label>
              <Input
                type="textarea"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Input
                type="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
              </Input>
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

export default Contact;
