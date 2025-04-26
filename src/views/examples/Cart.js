import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import axios from "axios";
import Header from "components/Headers/Header.js";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
  });

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Cart", {
        headers: {
          Authorization: token,
        },
      });

      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      userId: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (cartItem) => {
    setIsEdit(true);
    setFormData({
      id: cartItem.id,
      userId: cartItem.userId,
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
        userId: formData.userId,
        createdBy: "Admin" // Thêm thông tin người tạo, có thể thay đổi bằng cách lấy tên người dùng thực tế
      };

      if (isEdit) {
        await axios.put(`https://localhost:7018/api/Cart/${formData.id}`, data, {
          headers: { 
            Authorization: token,
            "Content-Type": "application/json", 
          },
        });
      } else {
        await axios.post("https://localhost:7018/api/Cart", data, {
          headers: { 
            Authorization: token,
            "Content-Type": "application/json", 
          },
        });
      }

      setModalOpen(false);
      fetchCartItems();
    } catch (error) {
      console.error("Error saving cart item:", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item from the cart?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Cart/${id}`, {
        headers: { Authorization: token },
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Failed to delete cart item.");
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
                <h3 className="mb-0">Cart Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Item to Cart
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">User Id</th>
                      <th scope="col">Created By</th>
                      <th scope="col">Created At</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.userId}</td>
                        <td>{item.createdBy}</td> {/* Hiển thị tên người tạo */}
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
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
                              <DropdownItem onClick={() => openEditModal(item)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(item.id)}>
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
          {isEdit ? "Edit Cart Item" : "Add New Cart Item"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>User Id</Label>
              <Input
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
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

export default Cart;
