import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Row,
  Space,
  Button,
  Tooltip,
  Tabs,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Image,
  Tag,
  Descriptions,
  Empty,
  Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTruck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { PlusOutlined } from "@ant-design/icons";
import {
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  TagOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Card, Col, Row as AntRow, Divider, Statistic } from "antd";

import moment from "moment";
import { invoicesApi } from "api/Admin";

const { Text } = Typography;

const Invoices = () => {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [shippingInvoices, setShippingInvoices] = useState([]);
  const [deliveredInvoices, setDeliveredInvoices] = useState([]);
  const [cancelledInvoices, setCancelledInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const pendingResponse = await invoicesApi.getPending();
      const shippingResponse = await invoicesApi.getShipping();
      const deliveredResponse = await invoicesApi.getDelivered();
      const cancelledResponse = await invoicesApi.getCancelled();

      setPendingInvoices(pendingResponse.data);
      setShippingInvoices(shippingResponse.data);
      setDeliveredInvoices(deliveredResponse.data);
      setCancelledInvoices(cancelledResponse.data);
    } catch (error) {
      message.error("Không thể lấy danh sách hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract numeric ID from invoiceId string
  const getNumericId = (invoiceId) => {
    if (!invoiceId) return null;
    return parseInt(invoiceId.replace("#", ""));
  };

  const DetailedInvoices = async (invoiceId) => {
    try {
      const numericId = getNumericId(invoiceId);
      if (!numericId) {
        message.error("ID hóa đơn không hợp lệ!");
        return;
      }
      const response = await invoicesApi.getById(numericId);
      setInvoiceDetails(response.data);
      form.setFieldsValue({
        ...response.data,
        orderDate: moment(response.data.orderDate),
      });
      console.log(response);

      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy chi tiết hóa đơn!");
    }
  };

  // Cập nhật trạng thái hóa đơn
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const numericId = getNumericId(invoiceId);
      if (!numericId) {
        message.error("ID hóa đơn không hợp lệ!");
        return;
      }
      await invoicesApi.updateStatus(numericId, newStatus);
      message.success("Cập nhật trạng thái thành công!");
      fetchInvoices(); // Cập nhật lại dữ liệu
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  // Add new handler for edit submit
  const handleEditSubmit = async (values) => {
    try {
      await invoicesApi.update(invoiceDetails.id, values);
      message.success("Cập nhật hóa đơn thành công!");
      setIsModalVisible(false);
      fetchInvoices();
    } catch (error) {
      message.error("Cập nhật hóa đơn thất bại!");
    }
  };

  // Các cột cho bảng trạng thái PENDING
  const columnsPending = [
    { title: "Mã hóa đơn", dataIndex: "invoiceId", key: "invoiceId" },
    { title: "Ngày đặt hàng", dataIndex: "orderDate", key: "orderDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    {
      title: "Giá đơn hàng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => DetailedInvoices(record.invoiceId)}
            className="add-btn"
          >
            Xem chi tiết
          </Button>
          <Tooltip title="Xác nhận đơn">
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
              onClick={() => updateInvoiceStatus(record.invoiceId, "SHIPPING")}
            >
              Xác nhận đơn
            </Button>
          </Tooltip>

          <Tooltip title="Hủy đơn">
            <Button
              type="danger"
              icon={<FontAwesomeIcon icon={faBan} />}
              onClick={() => updateInvoiceStatus(record.invoiceId, "CANCELLED")}
              disabled={record.status === "CANCELLED"} // Disable nếu đơn đã bị hủy
            >
              Hủy đơn
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Các cột cho bảng trạng thái SHIPPING
  const columnsShipping = [
    { title: "Mã hóa đơn", dataIndex: "invoiceId", key: "invoiceId" },
    { title: "Ngày đặt hàng", dataIndex: "orderDate", key: "orderDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    {
      title: "Giá đơn hàng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xác nhận giao hàng">
            <Button
              type="default"
              icon={<FontAwesomeIcon icon={faTruck} />}
              onClick={() => updateInvoiceStatus(record.invoiceId, "DELIVERED")}
            >
              Xác nhận giao
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Các cột cho bảng trạng thái DELIVERED
  const columnsDelivered = [
    { title: "Mã hóa đơn", dataIndex: "invoiceId", key: "invoiceId" },
    { title: "Ngày đặt hàng", dataIndex: "orderDate", key: "orderDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    // { title: "Chi tiết đơn hàng", dataIndex: "customerName", key: "customerName" },
    {
      title: "Giá đơn hàng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Hủy đơn">
            <Button
              type="default"
              icon={<FontAwesomeIcon icon={faBan} />}
              onClick={() => updateInvoiceStatus(record.invoiceId, "CANCELLED")}
            >
              Hủy đơn
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Các cột cho bảng trạng thái CANCELLED
  const columnsCancelled = [
    { title: "Mã hóa đơn", dataIndex: "invoiceId", key: "invoiceId" },
    { title: "Ngày đặt hàng", dataIndex: "orderDate", key: "orderDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    {
      title: "Giá đơn hàng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Khôi phục đơn">
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
              onClick={() => updateInvoiceStatus(record.invoiceId, "PENDING")}
            >
              Khôi phục
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Define tab items with the recommended format
  const items = [
    {
      key: "1",
      label: "Chờ xử lý",
      children: (
        <Table
          loading={loading}
          columns={columnsPending}
          dataSource={pendingInvoices.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
        />
      ),
    },
    {
      key: "2",
      label: "Đang giao hàng",
      children: (
        <Table
          loading={loading}
          columns={columnsShipping}
          dataSource={shippingInvoices.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
        />
      ),
    },
    {
      key: "3",
      label: "Đã giao hàng",
      children: (
        <Table
          loading={loading}
          columns={columnsDelivered}
          dataSource={deliveredInvoices.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
        />
      ),
    },
    {
      key: "4",
      label: "Đã hủy",
      children: (
        <Table
          loading={loading}
          columns={columnsCancelled}
          dataSource={cancelledInvoices.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
        />
      ),
    },
  ];

  // Replace renderInvoiceDetails with new edit form
  const renderInvoiceDetails = () => {
    if (!invoiceDetails) return null;

    const totalAmount =
      invoiceDetails.detailedInvoices?.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      ) || 0;

    const getStatusBadge = (status) => {
      const statusConfig = {
        "Chờ xử lý": { color: "#faad14", text: "Chờ xử lý" },
        "Đang giao hàng": { color: "#1890ff", text: "Đang giao hàng" },
        "Đã giao hàng": { color: "#52c41a", text: "Đã giao hàng" },
        "Đã hủy": { color: "#ff4d4f", text: "Đã hủy" },
      };
      const config = statusConfig[status] || { color: "default", text: status };
      return <Tag color={config.color}>{config.text}</Tag>;
    };

    return (
      <Modal
        title={
          <Space align="center">
            <TagOutlined />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Chi tiết đơn hàng #{invoiceDetails.id}
            </span>
            {getStatusBadge(invoiceDetails.status)}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card
              title={
                <>
                  <CalendarOutlined /> Thông tin đơn hàng
                </>
              }
              bordered={false}
              className="invoice-card"
            >
              <Descriptions column={1} labelStyle={{ fontWeight: "bold" }}>
                <Descriptions.Item label="Mã đơn hàng">
                  #{invoiceDetails.id}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {moment(invoiceDetails.orderDate).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">
                  {invoiceDetails.note || "Không có ghi chú"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title={
                <>
                  <UserOutlined /> Thông tin khách hàng
                </>
              }
              bordered={false}
              className="invoice-card"
            >
              <Descriptions column={1} labelStyle={{ fontWeight: "bold" }}>
                <Descriptions.Item label="Tên khách hàng">
                  {invoiceDetails.fullnames}
                </Descriptions.Item>
                <Descriptions.Item label="Mã khách hàng">
                  {invoiceDetails.userId}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {invoiceDetails.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={24}>
            <Card
              title={
                <>
                  <ShoppingOutlined /> Chi tiết sản phẩm
                </>
              }
              bordered={false}
              className="invoice-card"
            >
              <Table
                dataSource={invoiceDetails.detailedInvoices}
                pagination={false}
                columns={[
                  {
                    title: "Hình ảnh",
                    dataIndex: "productImages",
                    width: 120,
                    render: (images) => (
                      <Image.PreviewGroup>
                        {images && images.length > 0 ? (
                          <Image
                            width={80}
                            height={80}
                            style={{ objectFit: "contain" }}
                            src={`http://localhost:8081/api/upload/${images[0]}`}
                            preview={{
                              mask: "Xem",
                            }}
                          />
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có ảnh"
                          />
                        )}
                      </Image.PreviewGroup>
                    ),
                  },
                  {
                    title: "Kích thước",
                    dataIndex: "productSizes",
                    render: (sizes, record) => {
                      if (!sizes || sizes.length === 0) {
                        return "Không có";
                      }

                      // Convert both prices to numbers for comparison
                      const selectedSize = sizes.find(
                        (size) =>
                          Number(size.price) === Number(record.unitPrice)
                      );

                      if (selectedSize) {
                        return (
                          <Tooltip
                            title={`Giá: ${new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(selectedSize.price)}`}
                          >
                            <Tag color="blue">{selectedSize.name}</Tag>
                          </Tooltip>
                        );
                      }

                      // If no exact match is found, show all available sizes
                      return (
                        <Tooltip title="Kích thước có sẵn">
                          <span>
                            {sizes.map((size) => (
                              <Tag key={size.id} style={{ marginRight: 4 }}>
                                {size.name}
                              </Tag>
                            ))}
                          </span>
                        </Tooltip>
                      );
                    },
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    align: "center",
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "unitPrice",
                    align: "right",
                    render: (value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value),
                  },
                  {
                    title: "Thành tiền",
                    align: "right",
                    render: (_, record) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(record.unitPrice * record.quantity),
                  },
                ]}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={5} align="right">
                        <Text strong>Tổng tiền:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong type="danger">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalAmount)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </Col>
        </Row>

        <style jsx>{`
          .invoice-card {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          .invoice-card .ant-card-head {
            background-color: #fafafa;
          }
          .ant-descriptions-item-label {
            color: #666;
          }
        `}</style>
      </Modal>
    );
  };

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Hóa Đơn</h2>
      </Row>
      <Tabs defaultActiveKey="1" items={items} />
      {renderInvoiceDetails()}
    </div>
  );
};

export default Invoices;
