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

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    orderId: "",
    productId: "",
    quantity: "",
    unitPrice: "",
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/OrderDetail", {
        headers: {
          Authorization: token,
        },
      });

      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order detail data. Check authentication or API.");
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7018/api/Product", {
        headers: { Authorization: token },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7018/api/Order", {
        headers: { Authorization: token },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchProducts();
    fetchOrders();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      orderId: "",
      productId: "",
      quantity: "",
      unitPrice: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (orderDetail) => {
    setIsEdit(true);
    setFormData({
      id: orderDetail.id,
      orderId: orderDetail.orderId,
      productId: orderDetail.productId,
      quantity: orderDetail.quantity,
      unitPrice: orderDetail.unitPrice,
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
      const data = {
        orderId: formData.orderId,
        productId: formData.productId,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
      };

      const config = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json", // Set content type to JSON
        },
      };

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/OrderDetail/${formData.id}`, data, config);
      } else {
        await axios.post("https://localhost:7018/api/OrderDetail", data, config);
      }

      setModalOpen(false);
      fetchOrderDetails();
    } catch (error) {
      console.error("Error saving order detail:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order detail?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/OrderDetail/${id}`, {
        headers: { Authorization: token },
      });
      fetchOrderDetails();
    } catch (error) {
      console.error("Error deleting order detail:", error);
      alert("Failed to delete order detail.");
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
                <h3 className="mb-0">Order Detail Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Order Detail
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Unit Price</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((orderDetail) => (
                      <tr key={orderDetail.id}>
                        <td>{orderDetail.orderId}</td>
                        <td>
                          {products.find((product) => product.id === orderDetail.productId)?.name || "Unknown"}
                        </td>
                        <td>{orderDetail.quantity}</td>
                        <td>{orderDetail.unitPrice}</td>
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
                              <DropdownItem onClick={() => openEditModal(orderDetail)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(orderDetail.id)}>
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
          {isEdit ? "Edit Order Detail" : "Add Order Detail"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="orderId">Order ID</Label>
              <Input
                type="text"
                id="orderId"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="Order ID"
              />
            </FormGroup>
            <FormGroup>
              <Label for="productId">Product</Label>
              <Input
                type="select"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
              >
                <option value="">-- Select Product --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
              />
            </FormGroup>
            <FormGroup>
              <Label for="unitPrice">Unit Price</Label>
              <Input
                type="number"
                id="unitPrice"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Unit Price"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {isEdit ? "Update" : "Add"} Order Detail
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default OrderDetail;
