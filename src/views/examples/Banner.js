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

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    status: "Active",
    createdAt: "",
    createdBy: "admin",
    imageFile: null,
  });

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Banner", {
        headers: {
          Authorization: token,
        },
      });

      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Failed to load banner data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      status: "Active",
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setIsEdit(true);
    setFormData({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      status: banner.status,
      createdAt: banner.createdAt,
      createdBy: banner.createdBy,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("status", formData.status);
      form.append("createdAt", formData.createdAt);
      form.append("createdBy", formData.createdBy);
      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/Banner/${formData.id}`, form, {
          headers: { Authorization: token },
        });
      } else {
        await axios.post("https://localhost:7018/api/Banner", form, {
          headers: { Authorization: token },
        });
      }

      setModalOpen(false);
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Banner/${id}`, {
        headers: { Authorization: token },
      });
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner.");
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
                <h3 className="mb-0">Banner Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Banner
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Banner Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((banner) => (
                      <tr key={banner.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            {banner.imageUrl ? (
                              <img
                                alt="Image"
                                src={banner.imageUrl}
                                className="avatar rounded mr-3"
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
                                {banner.title.charAt(0)}
                              </div>
                            )}
                          </Media>
                        </th>
                        <td className="font-weight-bold">{banner.title}</td>
                        <td>{banner.description}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={
                                banner.status === "Active"
                                  ? "bg-success"
                                  : "bg-warning"
                              }
                            />
                            {banner.status}
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
                              <DropdownItem onClick={() => openEditModal(banner)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(banner.id)}>
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
          {isEdit ? "Edit Banner" : "Add New Banner"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Banner Title</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
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
            <FormGroup>
              <Label>Image (upload to update)</Label>
              <Input type="file" name="image" onChange={handleFileChange} />
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

export default Banner;
