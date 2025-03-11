import React, { useState, useEffect } from "react";
import { 
  Form, Input, DatePicker, Radio, Button, Upload, message, Spin, Modal, 
  Card, Divider, Row, Col, Tabs, Avatar, Tooltip, notification
} from "antd";
import { 
  UserOutlined, HomeOutlined, MailOutlined, PhoneOutlined, UploadOutlined, 
  LockOutlined, IdcardOutlined, SaveOutlined, EditOutlined, CameraOutlined,
  SafetyCertificateOutlined, InfoCircleOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import "./UserProfile.scss";

const { TabPane } = Tabs;

const UserProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    // Mock user data - in real application, fetch from API
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockUserData = {
                id: "123123",
                phone: "0928372811",
                fullname: "21323",
                address: "Phú Thứ, Cái Răng, Cần Thơ",
                email: "dinhn1hpc03073@gmail.com",
                password: "$2a$10$JUBG78WGAzoslnq0l/7mj.1Z5Qos7WxBvuMX18n25qzuoTqZPuWI2",
                birthday: "2025-02-02",
                gender: "M",
                image: "4056086a-8bcc-4718-b79d-06877280d582_Áo bóng đá chính hãng Liverpool thứ 3 1.jpg",
            };
            
            setUserData(mockUserData);
            setImageUrl(`/uploads/${mockUserData.image}`);
            form.setFieldsValue({
                ...mockUserData,
                birthday: moment(mockUserData.birthday),
            });
            setLoading(false);
        }, 100);
    }, [form]);

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
            setSubmitSuccess(true);
            
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Thông tin cá nhân của bạn đã được cập nhật',
                placement: 'bottomRight'
            });
            
            setIsEditing(false);
            
            // Reset success state after animation
            setTimeout(() => setSubmitSuccess(false), 2000);
        }, 800);
    };

    const handlePasswordChange = (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }
        
        console.log("Password changed:", values);
        
        notification.success({
            message: 'Đổi mật khẩu thành công',
            description: 'Mật khẩu của bạn đã được cập nhật',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        
        setPasswordModalVisible(false);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên file hình ảnh!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }
        return isImage && isLt2M;
    };

    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            // In real app, this would come from server response
            setImageUrl(URL.createObjectURL(info.file.originFileObj));
            message.success(`${info.file.name} đã được tải lên thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} tải lên thất bại.`);
        }
    };
    
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Đang tải thông tin người dùng..." />
            </div>
        );
    }

    const tooltips = {
        email: "Email dùng để đăng nhập và nhận thông báo",
        phone: "Số điện thoại dùng để liên hệ và xác thực",
        address: "Địa chỉ dùng để giao hàng",
    };

    return (
        <div className="user-profile-container">
            <div className="profile-header-wrapper">
                <div className="profile-header-content">
                    <div className="profile-avatar">
                        <div className="avatar-upload">
                            <Avatar 
                                size={100} 
                                src={imageUrl} 
                                icon={!imageUrl && <UserOutlined />}
                            />
                            <div className="upload-overlay">
                                <Upload
                                    name="avatar"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleUpload}
                                    customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                                >
                                    <Tooltip title="Thay đổi ảnh đại diện">
                                        <Button shape="circle" icon={<CameraOutlined />} className="camera-button" />
                                    </Tooltip>
                                </Upload>
                            </div>
                        </div>
                        <div className="user-brief-info">
                            <h2>{userData?.fullname}</h2>
                            <p>{userData?.email}</p>
                        </div>
                    </div>
                    
                    <div className="profile-actions">
                        {isEditing ? (
                            <Button 
                                type="primary" 
                                onClick={() => form.submit()} 
                                icon={<SaveOutlined />}
                                className="save-button"
                                loading={saveLoading}
                            >
                                {saveLoading ? 'Đang lưu...' : 'Lưu thông tin'}
                            </Button>
                        ) : (
                            <Button 
                                onClick={toggleEdit} 
                                icon={<EditOutlined />}
                                className="edit-button"
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className={`profile-main ${submitSuccess ? 'submit-success' : ''}`}>
                <Card bordered={false} className="profile-card">
                    <Tabs defaultActiveKey="basic" className="profile-tabs">
                        <TabPane 
                            tab={<span><IdcardOutlined /> Thông tin cơ bản</span>}
                            key="basic"
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                className={isEditing ? "editing-form" : "viewing-form"}
                                initialValues={{
                                    gender: "M",
                                }}
                                scrollToFirstError
                            >
                                <Row gutter={24}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={
                                                <span className="form-label">
                                                    <UserOutlined /> ID tài khoản
                                                    <Tooltip title="ID tài khoản không thể thay đổi">
                                                        <InfoCircleOutlined className="info-icon" />
                                                    </Tooltip>
                                                </span>
                                            }
                                            name="id"
                                        >
                                            <Input disabled className="disabled-input" />
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span className="form-label"><MailOutlined /> Email</span>}
                                            name="email"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email!' },
                                                { type: 'email', message: 'Email không hợp lệ!' }
                                            ]}
                                            tooltip={isEditing ? tooltips.email : ""}
                                        >
                                            <Input readOnly={!isEditing} className={!isEditing ? "readonly-input" : ""} />
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span className="form-label"><UserOutlined /> Họ và tên</span>}
                                            name="fullname"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                        >
                                            <Input readOnly={!isEditing} className={!isEditing ? "readonly-input" : ""} />
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span className="form-label"><PhoneOutlined /> Số điện thoại</span>}
                                            name="phone"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                                            ]}
                                            tooltip={isEditing ? tooltips.phone : ""}
                                        >
                                            <Input readOnly={!isEditing} className={!isEditing ? "readonly-input" : ""} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <SafetyCertificateOutlined /> Thông tin chi tiết
                                    </h3>
                                    
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                label={<span className="form-label"><HomeOutlined /> Địa chỉ</span>}
                                                name="address"
                                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                                tooltip={isEditing ? tooltips.address : ""}
                                            >
                                                <Input.TextArea 
                                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                                    readOnly={!isEditing}
                                                    className={!isEditing ? "readonly-input" : ""}
                                                />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                label={<span className="form-label">Ngày sinh</span>}
                                                name="birthday"
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                                            >
                                                <DatePicker 
                                                    format="DD/MM/YYYY" 
                                                    style={{ width: '100%' }} 
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "readonly-input" : ""}
                                                />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                label={<span className="form-label">Giới tính</span>}
                                                name="gender"
                                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                            >
                                                <Radio.Group disabled={!isEditing} className="gender-radio-group">
                                                    <Radio value="M">Nam</Radio>
                                                    <Radio value="F">Nữ</Radio>
                                                    <Radio value="O">Khác</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                
                                {isEditing && (
                                    <div className="form-actions">
                                        <Button type="default" onClick={toggleEdit}>
                                            Hủy
                                        </Button>
                                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saveLoading}>
                                            {saveLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                    </div>
                                )}
                            </Form>
                            
                            {!isEditing && (
                                <div className="security-section">
                                    <h3 className="form-section-title">
                                        <LockOutlined /> Bảo mật
                                    </h3>
                                    <p className="password-status">
                                        Mật khẩu được mã hóa an toàn
                                    </p>
                                    <Button
                                        type="primary"
                                        onClick={() => setPasswordModalVisible(true)}
                                        icon={<LockOutlined />}
                                        className="change-password-btn"
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </div>
                            )}
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
            
            <Modal
                title={<div className="modal-title"><LockOutlined className="modal-icon" /> Đổi mật khẩu</div>}
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
                centered
                className="password-modal"
            >
                <Form layout="vertical" onFinish={handlePasswordChange}>
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined className="field-icon" />} 
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </Form.Item>
                    
                    <Divider />
                    
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                        extra="Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số"
                    >
                        <Input.Password 
                            prefix={<LockOutlined className="field-icon" />} 
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined className="field-icon" />}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                    </Form.Item>
                    
                    <div className="modal-footer">
                        <Button key="cancel" onClick={() => setPasswordModalVisible(false)}>
                            Hủy
                        </Button>
                        <Button key="submit" type="primary" htmlType="submit">
                            Cập nhật mật khẩu
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile;
