import React from 'react';
import { Modal, Button, Typography, Row, Col, Table, Divider, Card } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import styled from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  .ant-card-body {
    padding: 24px;
  }
`;

const HeaderTitle = styled(Title)`
  text-align: center;
  margin-bottom: 24px !important;
`;

const PrintReceiptModal = ({ visible, onClose, receipt, onPrint, printRef }) => {
  const columns = [
    { 
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1
    },
    { 
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName" 
    },
    { 
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: 'right'
    },
    { 
      title: "Đơn Giá",
      dataIndex: "price",
      key: "price",
      align: 'right',
      render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    { 
      title: "Thành Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: 'right',
      render: (amount) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
  ];

  const totalAmount = receipt?.receiptProducts?.reduce(
    (sum, item) => sum + (item.quantity * item.price),
    0
  ) || 0;

  return (
    <Modal
      title={null}
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
      width={1000}
    >
      {receipt && (
        <div ref={printRef} style={{ padding: '20px' }}>
          <HeaderTitle level={2}>PHIẾU NHẬP KHO</HeaderTitle>
          
          <StyledCard>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Text strong>Mã Phiếu: </Text>
                <Text>{receipt.id}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Ngày Nhập: </Text>
                <Text>{moment(receipt.orderDate).format("DD/MM/YYYY HH:mm")}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Nhà Cung Cấp: </Text>
                <Text>{receipt.supplierName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Thương Hiệu: </Text>
                <Text>{receipt.brandName}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Ghi Chú: </Text>
                <Text>{receipt.notes || 'Không có'}</Text>
              </Col>
            </Row>
          </StyledCard>

          <Table
            columns={columns}
            dataSource={receipt.receiptProducts}
            pagination={false}
            rowKey={(record) => `${record.productId}`}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={4} align="right">
                    <Text strong>Tổng Tiền:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    <Text strong>
                      {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          <Divider />
          
          <Row gutter={24} style={{ marginTop: '40px', textAlign: 'center' }}>
            <Col span={8}>
              <Text strong>Người Lập Phiếu</Text>
              <br />
              <Text>(Ký, họ tên)</Text>
            </Col>
            <Col span={8}>
              <Text strong>Người Giao Hàng</Text>
              <br />
              <Text>(Ký, họ tên)</Text>
            </Col>
            <Col span={8}>
              <Text strong>Thủ Kho</Text>
              <br />
              <Text>(Ký, họ tên)</Text>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default PrintReceiptModal;
