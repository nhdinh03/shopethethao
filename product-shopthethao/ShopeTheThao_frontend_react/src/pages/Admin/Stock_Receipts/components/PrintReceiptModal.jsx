import React from 'react';
import { Modal, Button, Typography, Row, Col, Table, Divider } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';

const { Title, Text } = Typography;

const PrintReceiptModal = ({ visible, onClose, receipt, onPrint, printRef }) => {
  const columns = [
    { title: "Tên Sản Phẩm", dataIndex: "productName", key: "productName" },
    { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn Giá", dataIndex: "price", key: "price" },
    { title: "Thành Tiền", dataIndex: "totalAmount", key: "totalAmount" },
  ];

  return (
    <Modal
      title="Chi Tiết Phiếu Nhập Kho"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="print" type="primary" onClick={onPrint}>
          <FontAwesomeIcon icon={faPrint} /> In Phiếu
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      {receipt && (
        <div ref={printRef}>
          <Title level={4}>Thông Tin Phiếu Nhập Kho</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Mã Phiếu: </Text>
              <Text>{receipt.id}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Ngày Nhập: </Text>
              <Text>{moment(receipt.orderDate).format("DD/MM/YYYY")}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Nhà Cung Cấp: </Text>
              <Text>{receipt.supplierName}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Thương Hiệu: </Text>
              <Text>{receipt.brandName}</Text>
            </Col>
          </Row>
          <Divider />

          <Title level={5}>Danh Sách Sản Phẩm</Title>
          <Table
            columns={columns}
            dataSource={receipt.receiptProducts}
            pagination={false}
            rowKey={(record) => `${record.productId}`}
          />
        </div>
      )}
    </Modal>
  );
};

export default PrintReceiptModal;
