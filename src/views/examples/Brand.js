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

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    logoUrl: "",
    status: "Active",
    createdAt: "",
    createdBy: "admin",
    logoFile: null,
  });

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Brand", {
        headers: {
          Authorization: token,
        },
      });

      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to load brand data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      name: "",
      logoUrl: "",
      status: "Active",
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      logoFile: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    setIsEdit(true);
    setFormData({
      id: brand.id,
      name: brand.name,
      logoUrl: brand.logoUrl,
      status: brand.status,
      createdAt: brand.createdAt,
      createdBy: brand.createdBy,
      logoFile: null,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logoFile: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("name", formData.name);
      form.append("status", formData.status);
      form.append("createdAt", formData.createdAt);
      form.append("createdBy", formData.createdBy);
      if (formData.logoFile) {
        form.append("logo", formData.logoFile);
      }

      // Sending the form data without specifying Content-Type
      if (isEdit) {
        await axios.put(`https://localhost:7018/api/Brand/${formData.id}`, form, {
          headers: { Authorization: token },
        });
      } else {
        await axios.post("https://localhost:7018/api/Brand", form, {
          headers: { Authorization: token },
        });
      }

      setModalOpen(false);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Brand/${id}`, {
        headers: { Authorization: token },
      });
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand.");
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
                <h3 className="mb-0">Brand Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Brand
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Logo</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((brand) => (
                      <tr key={brand.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            {brand.logoUrl ? (
                              <img
                                alt="Logo"
                                src={brand.logoUrl}
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
                                {brand.name.charAt(0)}
                              </div>
                            )}
                          </Media>
                        </th>
                        <td className="font-weight-bold">{brand.name}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={
                                brand.status === "Active"
                                  ? "bg-success"
                                  : "bg-warning"
                              }
                            />
                            {brand.status}
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
                              <DropdownItem onClick={() => openEditModal(brand)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(brand.id)}>
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
          {isEdit ? "Edit Brand" : "Add New Brand"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Brand Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
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
            <FormGroup>
              <Label>Logo (upload to update)</Label>
              <Input type="file" name="logo" onChange={handleFileChange} />
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

export default Brand;
