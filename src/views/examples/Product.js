import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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

const Product = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    brandId: "",
    categoryId: "",
    imageUrl: "",
    status: "Active",
    createdAt: "",
    createdBy: "admin",
    imageFile: null,
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }
      const response = await axios.get("https://localhost:7018/api/Product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load product data. Please check authentication or API.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7018/api/Brand", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(response.data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7018/api/Category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      salePrice: "",
      stock: "",
      brandId: "",
      categoryId: "",
      imageUrl: "",
      status: "Active",
      createdAt: new Date().toISOString(),
      createdBy: "admin",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEdit(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      brandId: product.brandId,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      status: product.status,
      createdAt: product.createdAt,
      createdBy: product.createdBy,
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
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("salePrice", formData.salePrice);
      form.append("stock", formData.stock);
      form.append("brandId", formData.brandId);
      form.append("categoryId", formData.categoryId);
      form.append("status", formData.status);
      form.append("createdAt", formData.createdAt);
      form.append("createdBy", formData.createdBy);
      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }

      const headers = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/Product/${formData.id}`, form, headers);
      } else {
        await axios.post("https://localhost:7018/api/Product", form, headers);
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
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
                <h3 className="mb-0">Product Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Product
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : loading ? (
                <div className="text-center p-3">Loading...</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Price</th>
                      <th scope="col">Sale Price</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Brand</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            {product.imageUrl ? (
                              <img
                                alt="Image"
                                src={product.imageUrl}
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
                                {product.name.charAt(0)}
                              </div>
                            )}
                          </Media>
                        </th>
                        <td className="font-weight-bold">{product.name}</td>
                        <td>{product.description}</td>
                        <td className="text-right">{product.price}</td>
                        <td className="text-right">{product.salePrice}</td>
                        <td className="text-right">{product.stock}</td>
                        <td>{brands.find(b => b.id === product.brandId)?.name || "Unknown"}</td>
                        <td>{categories.find(c => c.id === product.categoryId)?.name || "Unknown"}</td>
                        <td>
                          <Badge color="" className="badge-dot">
                            <i
                              className={product.status === "Active" ? "bg-success" : "bg-warning"}
                            />
                            {product.status}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              role="button"
                              size="sm"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() => openEditModal(product)}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(product.id)}
                              >
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
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                      Previous
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {isEdit ? "Edit Product" : "Add Product"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Product Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="salePrice">Sale Price</Label>
              <Input
                type="number"
                name="salePrice"
                id="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="stock">Stock</Label>
              <Input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="brandId">Brand</Label>
              <Input
                type="select"
                name="brandId"
                id="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="categoryId">Category</Label>
              <Input
                type="select"
                name="categoryId"
                id="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="image">Product Image</Label>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={handleFileChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                id="status"
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
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {isEdit ? "Update Product" : "Add Product"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Product;
