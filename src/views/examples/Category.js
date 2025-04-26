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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: "Active",
  });

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Category", {
        headers: {
          Authorization: token,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load category data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      status: "Active",
    });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEdit(true);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      status: category.status,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        headers: { Authorization: token },
      };

      if (isEdit) {
        // PUT: update category
        await axios.put(
          `https://localhost:7018/api/Category/${formData.id}`,
          formData,
          headers
        );
      } else {
        // POST: create new category
        const { id, ...dataToSend } = formData; // remove id
        await axios.post("https://localhost:7018/api/Category", dataToSend, headers);
      }

      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Category/${id}`, {
        headers: { Authorization: token },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
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
                <h3 className="mb-0">Category Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Category
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Category Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="font-weight-bold">{category.name}</td>
                        <td>{category.description}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={
                                category.status === "Active"
                                  ? "bg-success"
                                  : "bg-warning"
                              }
                            />
                            {category.status}
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
                              <DropdownItem onClick={() => openEditModal(category)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(category.id)}>
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
          {isEdit ? "Edit Category" : "Add New Category"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Category Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

export default Category;
