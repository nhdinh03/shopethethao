import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Upload,
  message,
  Modal,
  Card,
  Divider,
  Row,
  Col,
  Avatar,
  notification,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  SaveOutlined,
  EditOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  IdcardOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./UserProfile.scss";
import authApi from "api/Admin/Auth/auth"; // Giả định đây là API của bạn
import Loading from "pages/Loading/loading"; // Giả định đây là component loading
import { motion } from "framer-motion";

const UserProfile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Breakpoints linh hoạt cho responsive
  const [screenSize, setScreenSize] = useState({
    is4k: window.innerWidth >= 2560,
    isLaptop: window.innerWidth >= 1024 && window.innerWidth < 2560,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isMobileL: window.innerWidth >= 425 && window.innerWidth < 768,
    isMobileM: window.innerWidth >= 375 && window.innerWidth < 425,
    isMobileS: window.innerWidth < 375,
  });

  // Tải dữ liệu người dùng khi component khởi tạo
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await authApi.getUser();
        if (storedUser) {
          setUserData(storedUser);
          form.setFieldsValue({
            ...storedUser,
            birthday: storedUser.birthday ? moment(storedUser.birthday) : null,
          });
          if (storedUser.image) setImageUrl(`/uploads/${storedUser.image}`);
        } else {
          message.error("Không thể tải thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Đã xảy ra lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [form]);

  // Theo dõi kích thước màn hình để điều chỉnh responsive
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        is4k: window.innerWidth >= 2560,
        isLaptop: window.innerWidth >= 1024 && window.innerWidth < 2560,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isMobileL: window.innerWidth >= 425 && window.innerWidth < 768,
        isMobileM: window.innerWidth >= 375 && window.innerWidth < 425,
        isMobileS: window.innerWidth < 375,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Điều chỉnh kích thước avatar theo breakpoint
  const getAvatarSize = () => {
    if (screenSize.is4k) return 180;
    if (screenSize.isLaptop) return 120;
    if (screenSize.isTablet) return 100;
    return 90;
  };

  // Xử lý lưu thông tin
  const handleSubmit = (values) => {
    setSaveLoading(true);
    const updatedUser = {
      ...values,
      birthday: values.birthday.format("YYYY-MM-DD"),
      id: userData.id,
      password: userData.password,
    };
    setTimeout(() => {
      setUserData(updatedUser);
      setSaveLoading(false);
      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      setIsEditing(false);
    }, 800);
  };

  // Xử lý đổi mật khẩu
  const handlePasswordChange = async (values) => {
    setChangePasswordLoading(true);
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu xác nhận không khớp!");
        return;
      }
      const response = await authApi.changePassword({
        id: userData.id,
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu đã được cập nhật",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Đổi mật khẩu thất bại",
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Kiểm tra file ảnh trước khi upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) message.error("Chỉ được tải lên file hình ảnh!");
    if (!isLt2M) message.error("Hình ảnh phải nhỏ hơn 2MB!");
    return isImage && isLt2M;
  };

  // Xử lý upload ảnh
  const handleUpload = ({ file }) => {
    if (file.status === "done") {
      const url = URL.createObjectURL(file.originFileObj);
      setImageUrl(url);
      message.success("Tải ảnh lên thành công");
    }
  };

  // Chuyển đổi chế độ chỉnh sửa
  const toggleEdit = () => {
    if (isEditing) form.submit();
    else {
      setIsEditing(true);
      message.info("Bạn có thể chỉnh sửa thông tin");
    }
  };

  // Các tab nội dung
  const renderProfileContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card title="Thông tin cơ bản" className="profile-card">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      readOnly={!isEditing}
                      size={screenSize.is4k ? "large" : "middle"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      readOnly={!isEditing}
                      size={screenSize.is4k ? "large" : "middle"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="email" label="Email">
                    <Input prefix={<MailOutlined />} readOnly />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="birthday"
                    label="Ngày sinh"
                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      disabled={!isEditing}
                      style={{ width: "100%" }}
                      size={screenSize.is4k ? "large" : "middle"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                  >
                    <Radio.Group disabled={!isEditing}>
                      <Radio value="M">Nam</Radio>
                      <Radio value="F">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </motion.div>
        );
      case "address":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card title="Địa chỉ" className="profile-card">
              <Form.Item
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input.TextArea
                  rows={4}
                  readOnly={!isEditing}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </Form.Item>
            </Card>
          </motion.div>
        );
      case "security":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card title="Bảo mật" className="profile-card">
              <div className="security-item">
                <LockOutlined /> Mật khẩu
                <Button
                  type="primary"
                  onClick={() => setPasswordModalVisible(true)}
                  icon={<LockOutlined />}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <motion.div
          className="avatar-container"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar
            size={getAvatarSize()}
            src={imageUrl}
            icon={<UserOutlined />}
          />
          {isEditing && (
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUpload}
            >
              <Button className="camera-button" icon={<CameraOutlined />} />
            </Upload>
          )}
        </motion.div>
        <div className="profile-info">
          <h2>{userData?.fullname}</h2>
          <p>{userData?.email}</p>
          <Button
            type={isEditing ? "primary" : "default"}
            icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={toggleEdit}
            loading={saveLoading}
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </Button>
        </div>
        <div className="profile-navigation">
          <Button
            onClick={() => setActiveTab("basic")}
            type={activeTab === "basic" ? "primary" : "default"}
          >
            Thông tin cơ bản
          </Button>
          <Button
            onClick={() => setActiveTab("address")}
            type={activeTab === "address" ? "primary" : "default"}
          >
            Địa chỉ
          </Button>
          <Button
            onClick={() => setActiveTab("security")}
            type={activeTab === "security" ? "primary" : "default"}
          >
            Bảo mật
          </Button>
        </div>
      </div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {renderProfileContent()}
      </Form>
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form form={passwordForm} onFinish={handlePasswordChange} layout="vertical">
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: "Nhập mật khẩu hiện tại!" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: "Xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu không khớp!");
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={changePasswordLoading}>
            Xác nhận
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;