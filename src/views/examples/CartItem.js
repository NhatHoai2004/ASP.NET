import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    Button,
    Table,
    Container,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    CardFooter, // Add this import
    Pagination, // Add this import
    PaginationItem, // Add this import
    PaginationLink, // Add this import
} from "reactstrap";
import Header from "components/Headers/Header.js"; // Giả sử bạn có header

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    quantity: 1,
    cartId: "",
    productId: "",
    createdAt: "",
    createdBy: "admin",
  });

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/CartItem", {
        headers: {
          Authorization: token,
        },
      });

      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart item data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      quantity: 1,
      cartId: "",
      productId: "",
      createdAt: new Date().toISOString(),
      createdBy: "admin",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setFormData({
      id: item.id,
      quantity: item.quantity,
      cartId: item.cartId,
      productId: item.productId,
      createdAt: item.createdAt,
      createdBy: item.createdBy,
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
        quantity: formData.quantity,
        cartId: formData.cartId,
        productId: formData.productId,
        createdAt: formData.createdAt,
        createdBy: formData.createdBy,
      };

      if (isEdit) {
        await axios.put(
          `https://localhost:7018/api/CartItem/${formData.id}`,
          data,
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post("https://localhost:7018/api/CartItem", data, {
          headers: { Authorization: token },
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
    if (!window.confirm("Are you sure you want to delete this cart item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/CartItem/${id}`, {
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
                <h3 className="mb-0">Cart Items</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Cart Item
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Cart ID</th>
                      <th scope="col">Product ID</th>
                      <th scope="col">Quantity</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.cartId}</td>
                        <td>{item.productId}</td>
                        <td>{item.quantity}</td>
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
       
            </Card>
                   
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
          </div>
        </Row>
      </Container>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {isEdit ? "Edit Cart Item" : "Add New Cart Item"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Quantity</Label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Cart ID</Label>
              <Input
                type="text"
                name="cartId"
                value={formData.cartId}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Product ID</Label>
              <Input
                type="text"
                name="productId"
                value={formData.productId}
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

export default CartItem;
