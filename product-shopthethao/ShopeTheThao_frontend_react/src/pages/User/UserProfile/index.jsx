import React, { useState, useEffect, useRef } from "react";
import { 
  Form, Input, DatePicker, Radio, Button, Upload, message, Spin, Modal, 
  Card, Divider, Row, Col, Tabs, Avatar, Tooltip, notification
} from "antd";
import { 
  UserOutlined, HomeOutlined, MailOutlined, PhoneOutlined, UploadOutlined, 
  LockOutlined, IdcardOutlined, SaveOutlined, EditOutlined, CameraOutlined,
  SafetyCertificateOutlined, InfoCircleOutlined, CheckCircleOutlined, ManOutlined, WomanOutlined
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
    const [fieldLoading, setFieldLoading] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const profileRef = useRef(null);
    
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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const showEditMessage = () => {
        if (isEditing) {
            message.info({
                content: 'Bạn có thể chỉnh sửa thông tin. Nhớ nhấn Lưu khi hoàn tất!',
                icon: <EditOutlined style={{ color: '#1890ff' }} />,
                duration: 3,
            });
        }
    };

    useEffect(() => {
        showEditMessage();
    }, [isEditing]);

    const handleFieldChange = (fieldName) => {
        setFieldLoading(prev => ({ ...prev, [fieldName]: true }));
        setTimeout(() => {
            setFieldLoading(prev => ({ ...prev, [fieldName]: false }));
        }, 500);
    };

    const renderLeftPanel = () => (
        <div className="profile-panel left-panel">
            <Card className={`user-card ${isMobile ? 'touch-feedback' : ''}`}>
                <div className="avatar-section animate-element">
                    <Avatar size={isMobile ? 100 : 150} src={imageUrl} icon={!imageUrl && <UserOutlined />} />
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleUpload}
                    >
                        <Button icon={<CameraOutlined />} className="change-avatar-btn">
                            {isMobile ? "Đổi ảnh" : "Thay đổi ảnh đại diện"}
                        </Button>
                    </Upload>
                    <h2>{userData?.fullname}</h2>
                    <p className="email">{userData?.email}</p>
                </div>

                <div className="quick-stats">
                    <div className="stat-item">
                        <PhoneOutlined className="stat-icon" />
                        <div>
                            <label>Điện thoại</label>
                            <span>{userData?.phone}</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <HomeOutlined className="stat-icon" />
                        <div>
                            <label>Địa chỉ</label>
                            <span>{userData?.address}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <Button 
                            type="primary"
                            icon={<SaveOutlined />}
                            block
                            onClick={() => form.submit()}
                            loading={saveLoading}
                        >
                            Lưu thay đổi
                        </Button>
                    ) : (
                        <Button 
                            type="default"
                            icon={<EditOutlined />}
                            block
                            onClick={toggleEdit}
                        >
                            Chỉnh sửa thông tin
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );

    const renderRightPanel = () => (
        <div className="profile-panel right-panel">
            <Card className="profile-details">
                <Tabs defaultActiveKey="basic" size={isMobile ? "small" : "middle"}>
                    <Tabs.TabPane 
                        tab={<span><UserOutlined /> {isMobile ? "Cơ bản" : "Thông tin cơ bản"}</span>} 
                        key="basic"
                    >
                        <Row gutter={isMobile ? [8, 16] : [24, 16]}>
                            {/* Sửa lại để cột chiếm toàn bộ chiều rộng trên mobile */}
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item name="fullname" label="Họ và tên">
                                    <Input 
                                        prefix={<UserOutlined />}
                                        readOnly={!isEditing}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item name="email" label="Email">
                                    <Input 
                                        prefix={<MailOutlined />}
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item name="phone" label="Số điện thoại">
                                    <Input 
                                        prefix={<PhoneOutlined />}
                                        readOnly={!isEditing}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item name="birthday" label="Ngày sinh">
                                    <DatePicker 
                                        style={{ width: '100%' }}
                                        disabled={!isEditing}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    
                    <Tabs.TabPane 
                        tab={<span><SafetyCertificateOutlined /> {isMobile ? "Chi tiết" : "Thông tin chi tiết"}</span>} 
                        key="details"
                    >
                        <Row gutter={isMobile ? [8, 16] : [24, 16]}>
                            <Col span={24}>
                                <Form.Item name="address" label="Địa chỉ">
                                    <Input.TextArea 
                                        rows={isMobile ? 2 : 3}
                                        readOnly={!isEditing}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="gender" label="Giới tính">
                                    <Radio.Group 
                                        disabled={!isEditing}
                                        buttonStyle="solid"
                                        className="mobile-radio-group"
                                    >
                                        <Radio.Button value="M">Nam</Radio.Button>
                                        <Radio.Button value="F">Nữ</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    
                    {/* ...existing code for security tab... */}
                </Tabs>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size={isMobile ? "default" : "large"} tip="Đang tải thông tin người dùng..." />
            </div>
        );
    }

    return (
        <div className="user-profile-container" ref={profileRef}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={`profile-form ${isEditing ? 'editing' : ''}`}
                size={isMobile ? "middle" : "large"}
            >
                <div className="profile-layout">
                    {renderLeftPanel()}
                    {renderRightPanel()}
                </div>
            </Form>

            <Modal
                title={<div className="modal-title"><LockOutlined className="modal-icon" /> Đổi mật khẩu</div>}
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
                centered
                className="password-modal"
                width={isMobile ? "95%" : 520}
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
