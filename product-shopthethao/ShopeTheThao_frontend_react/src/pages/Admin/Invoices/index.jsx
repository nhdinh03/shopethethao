import React, { useEffect, useState } from "react";
import { Table, message, Row, Space, Button, Tooltip, Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTruck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import invoicesApi from "api/Admin/invoices/InvoicesApi";
import { PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const Invoices = () => {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [shippingInvoices, setShippingInvoices] = useState([]);
  const [deliveredInvoices, setDeliveredInvoices] = useState([]);
  const [cancelledInvoices, setCancelledInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Cập nhật trạng thái hóa đơn
  const updateInvoiceStatus = async (id, newStatus) => {
    try {
      await invoicesApi.updateStatus(id, newStatus);
      message.success("Cập nhật trạng thái thành công!");
      fetchInvoices(); // Cập nhật lại dữ liệu
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
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
            // onClick={() => setOpen(true)}
            className="add-btn"
          >
            Xem chi tiết
          </Button>
          <Tooltip title="Xác nhận đơn">
            <Button
              type="primary"
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
              onClick={() => updateInvoiceStatus(record.id, "SHIPPING")}
            >
              Xác nhận đơn
            </Button>
          </Tooltip>

          <Tooltip title="Hủy đơn">
            <Button
              type="danger"
              icon={<FontAwesomeIcon icon={faBan} />}
              onClick={() => updateInvoiceStatus(record.id, "CANCELLED")}
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
              onClick={() => updateInvoiceStatus(record.id, "DELIVERED")}
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
              onClick={() => updateInvoiceStatus(record.id, "CANCELLED")}
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
              onClick={() => updateInvoiceStatus(record.id, "PENDING")}
            >
              Khôi phục
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Hóa Đơn</h2>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Chờ xử lý" key="1">
          <Table
            loading={loading}
            columns={columnsPending}
            dataSource={pendingInvoices}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Đang giao hàng" key="2">
          <Table
            loading={loading}
            columns={columnsShipping}
            dataSource={shippingInvoices}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Đã giao hàng" key="3">
          <Table
            loading={loading}
            columns={columnsDelivered}
            dataSource={deliveredInvoices}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Đã hủy" key="4">
          <Table
            loading={loading}
            columns={columnsCancelled}
            dataSource={cancelledInvoices}
            rowKey="id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Invoices;
