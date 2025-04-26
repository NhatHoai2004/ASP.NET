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

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    orderId: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    paymentDate: new Date().toISOString(),
  });

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const response = await axios.get("https://localhost:7018/api/Payment", {
        headers: {
          Authorization: token,
        },
      });

      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to load payment data. Check authentication or API.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      orderId: "",
      paymentMethod: "",
      paymentStatus: "Pending",
      paymentDate: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const openEditModal = (payment) => {
    setIsEdit(true);
    setFormData({
      id: payment.id,
      orderId: payment.orderId,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      paymentDate: payment.paymentDate,
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

      // Dữ liệu cần gửi dưới dạng JSON thay vì FormData
      const formattedDate = new Date(formData.paymentDate).toISOString();
      const data = {
        orderId: formData.orderId,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        paymentDate: formattedDate,
      };

      if (isEdit) {
        // Chỉnh sửa thông tin khi có id
        data.id = formData.id;  // Chỉ thêm id khi chỉnh sửa
        await axios.put(`https://localhost:7018/api/Payment/${formData.id}`, data, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
          },
        });
      } else {
        // Thêm mới khi không có id
        await axios.post("https://localhost:7018/api/Payment", data, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
          },
        });
      }

      setModalOpen(false);
      fetchPayments();
    } catch (error) {
      // Kiểm tra chi tiết lỗi từ API
      if (error.response) {
        console.error("Error details:", error.response.data);
        alert("Error: " + error.response.data.message); // Thêm thông báo chi tiết về lỗi
      } else {
        console.error("Error:", error.message);
        alert("Something went wrong while saving.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7018/api/Payment/${id}`, {
        headers: { Authorization: token },
      });
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment.");
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
                <h3 className="mb-0">Payment Table</h3>
                <Button color="primary" onClick={openAddModal}>
                  <i className="fas fa-plus mr-2" />
                  Add Payment
                </Button>
              </CardHeader>

              {error ? (
                <div className="text-danger p-3">{error}</div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Payment Method</th>
                      <th scope="col">Payment Status</th>
                      <th scope="col">Payment Date</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.orderId}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>{payment.paymentStatus}</td>
                        <td>{new Date(payment.paymentDate).toLocaleString()}</td>
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
                              <DropdownItem onClick={() => openEditModal(payment)}>
                                <i className="fas fa-edit text-warning mr-2" />
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(payment.id)}>
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
          {isEdit ? "Edit Payment" : "Add Payment"}
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
              <Label for="paymentMethod">Payment Method</Label>
              <Input
                type="text"
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                placeholder="Payment Method"
              />
            </FormGroup>
            <FormGroup>
              <Label for="paymentStatus">Payment Status</Label>
              <Input
                type="select"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="paymentDate">Payment Date</Label>
              <Input
                type="datetime-local"
                id="paymentDate"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Save Payment
          </Button>{" "}
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Payment;
