import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Dùng import với named export
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Thêm state cho Remember me
  const navigate = useNavigate(); // Tạo instance của useNavigate

  // Khi trang được tải lại, kiểm tra xem đã có thông tin đăng nhập chưa
  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedRememberMe === "true") {
      setFullName(storedFullName || "");
      setPassword(storedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:7018/api/Auth/login", {
        fullName,
        password,
      });

      const { token } = response.data;

      // Giải mã token để lấy thông tin user và role
      const decoded = jwtDecode(token); // Sử dụng jwtDecode như bình thường

      // Trích xuất role từ token
      const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Kiểm tra claim đúng

      // Kiểm tra xem user có phải là admin không
      if (userRole === "admin") {
        // Lưu token vào localStorage
        localStorage.setItem("token", token);

        // Nếu "Remember me" được tích, lưu thông tin đăng nhập
        if (rememberMe) {
          localStorage.setItem("fullName", fullName);
          localStorage.setItem("password", password);
          localStorage.setItem("rememberMe", true);
        } else {
          // Nếu không tích "Remember me", xóa thông tin lưu trong localStorage
          localStorage.removeItem("fullName");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberMe");
        }

        alert("Welcome Admin");

        // Chuyển hướng đến trang quản trị
        navigate("/admin/index"); // Dùng navigate để chuyển hướng
      } else {
        alert("Bạn không có quyền truy cập hệ thống. Vui lòng đăng nhập với tài khoản admin.");
      }
    } catch (error) {
      alert("Đăng nhập thất bại: " + (error.response?.data || "Lỗi không xác định"));
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/github.svg").default}
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../../assets/img/icons/common/google.svg").default}
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form role="form" onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} // Cập nhật state rememberMe
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
