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

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    imageUrl: "",
    status: "Active",
    createdAt: "",
    createdBy: "admin",
    imageFile: null,
  });

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Blog", {
        headers: {
          Authorization: token,
        },
      });

      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blog data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      title: "",
      content: "",
      imageUrl: "",
      status: "Active",
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setIsEdit(true);
    setFormData({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      status: blog.status,
      createdAt: blog.createdAt,
      createdBy: blog.createdBy,
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
      form.append("content", formData.content);
      form.append("status", formData.status);
      form.append("createdAt", formData.createdAt);
      form.append("createdBy", formData.createdBy);
      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/Blog/${formData.id}`, form, {
          headers: { Authorization: token },
        });
      } else {
        await axios.post("https://localhost:7018/api/Blog", form, {
          headers: { Authorization: token },
        });
      }

      setModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Blog/${id}`, {
        headers: { Authorization: token },
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog.");
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
                <h3 className="mb-0">Blog Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Blog
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Title</th>
                      <th scope="col">Content</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            {blog.imageUrl ? (
                              <img
                                alt="Image"
                                src={blog.imageUrl}
                                className="avatar rounded mr-3"
                                style={{ width: 60, height: 60, objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                className="avatar rounded-circle mr-3 bg-secondary text-white text-center d-flex align-items-center justify-content-center"
                                style={{ width: 60, height: 60, fontSize: 24 }}
                              >
                                {blog.title.charAt(0)}
                              </div>
                            )}
                          </Media>
                        </th>
                        <td className="font-weight-bold">{blog.title}</td>
                        <td>{blog.content}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={
                                blog.status === "Active"
                                  ? "bg-success"
                                  : "bg-warning"
                              }
                            />
                            {blog.status}
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
                              <DropdownItem onClick={() => openEditModal(blog)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(blog.id)}>
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
                <Pagination className="pagination justify-content-end mb-0">
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
          {isEdit ? "Edit Blog" : "Add New Blog"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Blog Title</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Content</Label>
              <Input
                type="textarea"
                name="content"
                value={formData.content}
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

export default Blog;
