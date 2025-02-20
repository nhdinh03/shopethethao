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
  Card,
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
import { Col, Row as AntRow, Divider, Statistic } from "antd";

import moment from "moment";
import { invoicesApi } from "api/Admin";
import cancelReasonApi from "api/Admin/cancelReason/CancelReasonApi";
import PaginationComponent from "components/PaginationComponent";

const { Text } = Typography;
const { Option } = Select;

const Invoices = () => {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [shippingInvoices, setShippingInvoices] = useState([]);
  const [deliveredInvoices, setDeliveredInvoices] = useState([]);
  const [cancelledInvoices, setCancelledInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]); // Add this state

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Form instances
  const [updateForm] = Form.useForm();

  useEffect(() => {
    fetchInvoices();
    fetchCancelReasons(); // Add this call
  }, []);

  useEffect(() => {
    const fetchAllInvoices = async () => {
      setLoading(true);
      try {
        const [pendingRes, shippingRes, deliveredRes, cancelledRes] =
          await Promise.all([
            invoicesApi.getPending(currentPage, pageSize),
            invoicesApi.getShipping(currentPage, pageSize),
            invoicesApi.getDelivered(currentPage, pageSize),
            invoicesApi.getCancelled(currentPage, pageSize),
          ]);

        setPendingInvoices(pendingRes.data);
        setShippingInvoices(shippingRes.data);
        setDeliveredInvoices(deliveredRes.data);
        setCancelledInvoices(cancelledRes.data);
        setTotalItems(pendingRes.totalItems); // Set total items for pagination
      } catch (error) {
        message.error("Không thể tải dữ liệu hóa đơn!");
      } finally {
        setLoading(false);
      }
    };

    fetchAllInvoices();
  }, [currentPage, pageSize]);

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

  const fetchCancelReasons = async () => {
    try {
      const response = await cancelReasonApi.getList();
      console.log("Cancel reasons:", response.data); // Debug log
      setCancelReasons(response.data);
    } catch (error) {
      console.error("Error fetching cancel reasons:", error); // Debug log
      message.error("Không thể lấy danh sách lý do hủy");
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
      setInvoiceDetails({
        ...response.data,
        orderDate: moment(response.data.orderDate),
      });
      console.log(response);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy chi tiết hóa đơn!");
    }
  };
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

  // Handle status update with confirmation
  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      if (newStatus === "CANCELLED") {
        setSelectedInvoice({ id: invoiceId });
        setUpdateModal(true);
        return;
      }

      Modal.confirm({
        title: "Xác nhận thay đổi trạng thái",
        content: `Bạn có chắc muốn ${
          newStatus === "SHIPPING" ? "xác nhận" : "giao"
        } đơn hàng này?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            const numericId = getNumericId(invoiceId);
            await invoicesApi.updateStatus(numericId, {
              status: newStatus,
              cancelReasonId: null,
              note: null,
            });
            message.success("Cập nhật trạng thái thành công!");
            await fetchInvoices();
          } catch (error) {
            message.error("Cập nhật trạng thái thất bại: " + error.message);
          }
        },
      });
    } catch (error) {
      message.error("Có lỗi xảy ra: " + error.message);
    }
  };

  // Handle cancellation with reason
  const handleCancellation = async (values) => {
    try {
      setUpdateLoading(true);
      const { cancelReasonId, note } = values;

      if (!cancelReasonId) {
        message.error("Vui lòng chọn lý do hủy");
        return;
      }

      await invoicesApi.updateStatus(getNumericId(selectedInvoice.id), {
        status: "CANCELLED",
        cancelReasonId: cancelReasonId,
        note: note || null,
      });

      message.success("Đã hủy đơn hàng thành công");
      setUpdateModal(false);
      updateForm.resetFields();
      fetchInvoices();
    } catch (error) {
      message.error(
        "Hủy đơn hàng thất bại: " + (error.response?.data || error.message)
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const generateUniqueId = (() => {
    let counter = 0;
    return () => `row-${counter++}`;
  })();

  // Cancel reason modal
  const renderCancelModal = () => (
    <Modal
      title="Hủy đơn hàng"
      open={updateModal}
      onCancel={() => {
        setUpdateModal(false);
        setSelectedInvoice(null);
        updateForm.resetFields();
      }}
      footer={null}
      maskClosable={!updateLoading}
    >
      <Form
        form={updateForm}
        name="cancelForm"
        onFinish={handleCancellation}
        layout="vertical"
      >
        <Form.Item
          name="cancelReasonId"
          label="Lý do hủy"
          rules={[{ required: true, message: "Vui lòng chọn lý do hủy" }]}
        >
          <Select placeholder="Chọn lý do hủy">
            {cancelReasons.map((reason) => (
              <Select.Option key={reason.id} value={reason.id}>
                {reason.reason}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú thêm">
          <Input.TextArea
            rows={4}
            placeholder="Nhập ghi chú thêm (nếu có)"
            disabled={updateLoading}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={updateLoading}
            >
              Xác nhận hủy
            </Button>
            <Button
              onClick={() => setUpdateModal(false)}
              disabled={updateLoading}
            >
              Đóng
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

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
              onClick={() => handleStatusUpdate(record.invoiceId, "SHIPPING")}
            >
              Xác nhận đơn
            </Button>
          </Tooltip>
          <Tooltip title="Hủy đơn">
            <Button
              type="danger"
              icon={<FontAwesomeIcon icon={faBan} />}
              onClick={() => handleStatusUpdate(record.invoiceId, "CANCELLED")}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => DetailedInvoices(record.invoiceId)}
            className="add-btn"
          >
            Xem chi tiết
          </Button>
          <Tooltip title="Xác nhận giao hàng">
            <Button
              type="default"
              icon={<FontAwesomeIcon icon={faTruck} />}
              onClick={() => handleStatusUpdate(record.invoiceId, "DELIVERED")}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => DetailedInvoices(record.invoiceId)}
            className="add-btn"
          >
            Xem chi tiết
          </Button>
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
        <>
          <Table
            loading={loading}
            columns={columnsPending}
            dataSource={pendingInvoices.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            pagination={false}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              gap: 10,
            }}
          >
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <Select
              value={pageSize}
              style={{ width: 120, marginTop: 20 }}
              onChange={handlePageSizeChange}
            >
              <Select.Option value={5}>5 hàng</Select.Option>
              <Select.Option value={10}>10 hàng</Select.Option>
              <Select.Option value={20}>20 hàng</Select.Option>
              <Select.Option value={50}>50 hàng</Select.Option>
            </Select>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "Đang giao hàng",
      children: (
        <>
          <Table
            loading={loading}
            columns={columnsShipping}
            dataSource={shippingInvoices.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            pagination={false}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              gap: 10,
            }}
          >
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <Select
              value={pageSize}
              style={{ width: 120, marginTop: 20 }}
              onChange={handlePageSizeChange}
            >
              <Select.Option value={5}>5 hàng</Select.Option>
              <Select.Option value={10}>10 hàng</Select.Option>
              <Select.Option value={20}>20 hàng</Select.Option>
              <Select.Option value={50}>50 hàng</Select.Option>
            </Select>
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: "Đã giao hàng",
      children: (
        <>
          <Table
            loading={loading}
            columns={columnsDelivered}
            dataSource={deliveredInvoices.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            pagination={false}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              gap: 10,
            }}
          >
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <Select
              value={pageSize}
              style={{ width: 120, marginTop: 20 }}
              onChange={handlePageSizeChange}
            >
              <Select.Option value={5}>5 hàng</Select.Option>
              <Select.Option value={10}>10 hàng</Select.Option>
              <Select.Option value={20}>20 hàng</Select.Option>
              <Select.Option value={50}>50 hàng</Select.Option>
            </Select>
          </div>
        </>
      ),
    },
    {
      key: "4",
      label: "Đã hủy",
      children: (
        <>
          <Table
            loading={loading}
            columns={columnsCancelled}
            dataSource={cancelledInvoices.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            pagination={false}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              gap: 10,
            }}
          >
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <Select
              value={pageSize}
              style={{ width: 120, marginTop: 20 }}
              onChange={handlePageSizeChange}
            >
              <Select.Option value={5}>5 hàng</Select.Option>
              <Select.Option value={10}>10 hàng</Select.Option>
              <Select.Option value={20}>20 hàng</Select.Option>
              <Select.Option value={50}>50 hàng</Select.Option>
            </Select>
          </div>
        </>
      ),
    },
  ];

  // Replace renderInvoiceDetails with optimized version
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
          <Space align="center" className="modal-title">
            <TagOutlined />
            <span className="title-text">
              Chi tiết đơn hàng #{invoiceDetails.id}
            </span>
            {getStatusBadge(invoiceDetails.status)}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        className="invoice-detail-modal"
        footer={[
          <Button
            key="close"
            onClick={() => setIsModalVisible(false)}
            size="large"
          >
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
              <Descriptions
                column={1}
                styles={{ label: { fontWeight: "bold" } }}
              >
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
              <Descriptions
                column={1}
                styles={{ label: { fontWeight: "bold" } }}
              >
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
                rowKey={(record) => {
                  // First try to use existing IDs
                  if (record.invoice_id && record.product_id) {
                    return `${record.invoice_id}_${record.product_id}`;
                  }
                  // If either ID is missing, use generated ID
                  return record.id || generateUniqueId();
                }}
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
      {renderCancelModal()}
    </div>
  );
};

export default Invoices;
