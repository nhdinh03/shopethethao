import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Upload,
  message,
  Spin,
  Modal,
  Card,
  Divider,
  Row,
  Col,
  Avatar,
  Tooltip,
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
} from "@ant-design/icons";
import moment from "moment";
import "./UserProfile.scss";
import authApi from "api/Admin/Auth/auth";
import Loading from "pages/Loading/loading";

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
  
  // Enhanced responsive breakpoints
  const [screenSize, setScreenSize] = useState({
    is4k: window.innerWidth >= 2560,
    isLaptop: window.innerWidth >= 1024 && window.innerWidth < 2560,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isMobileL: window.innerWidth >= 425 && window.innerWidth < 768,
    isMobileM: window.innerWidth >= 375 && window.innerWidth < 425,
    isMobileS: window.innerWidth < 375,
  });

  // Replace the mock data loading with actual user data from localStorage
  useEffect(() => {
    try {
      const storedUser = authApi.getUser();
      if (storedUser) {
        setUserData(storedUser);

        // Set form values from user data
        form.setFieldsValue({
          ...storedUser,
          birthday: storedUser.birthday ? moment(storedUser.birthday) : null,
        });

        // Set image URL if available
        if (storedUser.image) {
          setImageUrl(`/uploads/${storedUser.image}`);
        }
      } else {
        message.error("Không thể tải thông tin người dùng");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      message.error("Đã xảy ra lỗi khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  }, [form]);

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

  // Dynamically calculate avatar size based on screen size
  const getAvatarSize = () => {
    if (screenSize.is4k) return 150;
    if (screenSize.isLaptop) return 100;
    if (screenSize.isTablet) return 90;
    if (screenSize.isMobileL) return 80;
    return 70; // For mobile M and S
  };

  const handleSubmit = (values) => {
    setSaveLoading(true);

    const updatedUser = {
      ...values,
      birthday: values.birthday.format("YYYY-MM-DD"),
      id: userData.id,
      password: userData.password,
    };

    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);

      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật",
        placement: "bottomRight",
      });

      setIsEditing(false);
    }, 800);
  };

  const handlePasswordChange = async (values) => {
    try {
      setChangePasswordLoading(true);

      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu xác nhận không khớp!");
        setChangePasswordLoading(false);
        return;
      }

      // Log the request payload for debugging
      const requestPayload = {
        id: userData.id, // Make sure we're using the correct user ID
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      };

      console.log("Password change request payload:", requestPayload);

      // Send the password change request
      const response = await authApi.changePassword(requestPayload);

      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });

      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error("Password change error:", error);
      // Log the error response data for debugging
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }

      // Display appropriate error message
      const errorMessage =
        error.response?.data?.message || "Đổi mật khẩu không thành công";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên file hình ảnh!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
    }
    return isImage && isLt2M;
  };

  const handleUpload = (info) => {
    if (info.file.status === "done") {
      // In real app, this would come from server response
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
      message.success(`${info.file.name} đã được tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      form.submit();
    } else {
      setIsEditing(true);
      message.info({
        content: "Bạn có thể chỉnh sửa thông tin của mình",
        duration: 2,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-container">
            <Avatar
              size={getAvatarSize()}
              src={imageUrl}
              icon={!imageUrl && <UserOutlined />}
              className="user-avatar"
            />
            {isEditing && (
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleUpload}
                className="avatar-upload"
              >
                <button className="camera-button">
                  <CameraOutlined />
                </button>
              </Upload>
            )}
          </div>

          <div className="profile-info">
            <h2 className="user-name">{userData.fullname}</h2>
            <p className="user-email">{userData.email}</p>

            <Button
              type={isEditing ? "primary" : "default"}
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={toggleEdit}
              loading={saveLoading}
              className="edit-button"
            >
              {isEditing ? "Lưu thông tin" : "Chỉnh sửa"}
            </Button>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={`profile-form ${isEditing ? "editing" : ""}`}
      >
        <div className="profile-content">
          <Card className="profile-card basic-info" title="Thông tin cơ bản">
            <Row gutter={[screenSize.isMobileM || screenSize.isMobileS ? 12 : 24, screenSize.is4k ? 24 : 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fullname"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    readOnly={!isEditing}
                    className={!isEditing ? "readonly-input" : ""}
                    size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    readOnly={!isEditing}
                    className={!isEditing ? "readonly-input" : ""}
                    size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="email" label="Email">
                  <Input
                    prefix={<MailOutlined />}
                    readOnly
                    className="readonly-input"
                    size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabled={!isEditing}
                    className={!isEditing ? "readonly-input" : ""}
                    suffixIcon={<CalendarOutlined />}
                    size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
                >
                  <Radio.Group disabled={!isEditing} className="gender-group">
                    <Radio value="M">
                      <span className="gender-label">
                        <IdcardOutlined /> Nam
                      </span>
                    </Radio>
                    <Radio value="F">
                      <span className="gender-label">
                        <IdcardOutlined /> Nữ
                      </span>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card className="profile-card address-info" title="Địa chỉ">
            <Form.Item
              name="address"
              label="Địa chỉ liên hệ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea
                rows={screenSize.isMobileS ? 2 : 3}
                readOnly={!isEditing}
                className={!isEditing ? "readonly-input" : ""}
                placeholder="Nhập địa chỉ của bạn"
                size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
              />
            </Form.Item>
          </Card>

          <Card className="profile-card security-info" title="Bảo mật">
            <div className="security-content">
              <div className="password-section">
                <div className="password-info">
                  <LockOutlined className="security-icon" />
                  <div className="security-text">
                    <h3>Mật khẩu</h3>
                    <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                  </div>
                </div>
                <Button
                  type="primary"
                  onClick={() => setPasswordModalVisible(true)}
                  className="change-password-btn"
                  size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Form>

      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        centered
        className="password-modal"
        width={screenSize.is4k ? 600 : screenSize.isMobileL || screenSize.isMobileM || screenSize.isMobileS ? "95%" : 520}
      >
        <Form
          layout="vertical"
          onFinish={handlePasswordChange}
          form={passwordForm}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
              size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
            />
          </Form.Item>

          <Divider />

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
              size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
            />
          </Form.Item>

          <div className="modal-buttons">
            <Button
              key="cancel"
              onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
              size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
            >
              Hủy
            </Button>
            <Button
              style={{ left: 20 }}
              key="submit"
              type="primary"
              htmlType="submit"
              loading={changePasswordLoading}
              size={screenSize.is4k ? "large" : screenSize.isMobileM || screenSize.isMobileS ? "small" : "middle"}
            >
              Xác nhận
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
