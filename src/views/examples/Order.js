// File: Order.js
import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardFooter, Table, Container, Row, Button,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header.js";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    cartId: "",
    totalAmount: "",
    orderDate: "",
    status: "Pending"
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Order", {
        headers: { Authorization: token },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load order data.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      userId: "",
      cartId: "",
      totalAmount: "",
      orderDate: new Date().toISOString().slice(0, 16),
      status: "Pending"
    });
    setModalOpen(true);
  };

  const openEditModal = (order) => {
    setIsEdit(true);
    setFormData({
      id: order.id,
      userId: order.userId,
      cartId: order.cartId || "",
      totalAmount: order.totalAmount,
      orderDate: new Date(order.orderDate).toISOString().slice(0, 16),
      status: order.status
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
        userId: parseInt(formData.userId),
        cartId: formData.cartId ? parseInt(formData.cartId) : null,
        totalAmount: parseFloat(formData.totalAmount),
        orderDate: new Date(formData.orderDate),
        status: formData.status
      };

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/Order/${formData.id}`, data, {
          headers: { Authorization: token }
        });
      } else {
        await axios.post("https://localhost:7018/api/Order", data, {
          headers: { Authorization: token }
        });
      }

      setModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Order/${id}`, {
        headers: { Authorization: token }
      });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
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
                <h3 className="mb-0">Order Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Order
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>User ID</th>
                      <th>Cart ID</th>
                      <th>Total Amount</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.userId}</td>
                        <td>{order.cartId || "N/A"}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                        <td>{order.status}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn-icon-only text-light" size="sm">
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem onClick={() => openEditModal(order)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(order.id)}>
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

      {/* Modal Add/Edit */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {isEdit ? "Edit Order" : "Add New Order"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>User ID</Label>
              <Input type="number" name="userId" value={formData.userId} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label>Cart ID (Optional)</Label>
              <Input type="number" name="cartId" value={formData.cartId} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label>Total Amount</Label>
              <Input type="number" step="0.01" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label>Order Date</Label>
              <Input type="datetime-local" name="orderDate" value={formData.orderDate} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Input type="text" name="status" value={formData.status} onChange={handleInputChange} />
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

export default Order;
