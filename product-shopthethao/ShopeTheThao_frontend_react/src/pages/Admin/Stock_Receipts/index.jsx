import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  message,
  Button,
  Space,
  Modal,
  Tooltip,
  Row,
  Typography,
  Card,
  Form,
  InputNumber,
  Select,
  DatePicker,
  Col,
  Divider,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faPlus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { productsApi, suppliersApi, stock_ReceiptsAPi } from "api/Admin";
import moment from "moment";
import "..//index.scss";
import brandsApi from "api/Admin/Brands/Brands";
import PaginationComponent from "components/PaginationComponent"; // Your custom pagination component

const { Title, Text } = Typography;
const { Option } = Select;

const Stock_Receipts = () => {
  const printRef = useRef(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brand, setBrand] = useState([]);
  const [stockReceipts, setStockReceipts] = useState([]);

    const [searchText, setSearchText] = useState("");
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [totalItems, setTotalItems] = useState(0); // Total number of items for pagination
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stockReceiptsRes = await stock_ReceiptsAPi.getByPage(
          currentPage,
          pageSize,
          searchText,
        );
        setStockReceipts(stockReceiptsRes.data);
        setTotalItems(stockReceiptsRes.totalItems);

        const productsRes = await productsApi.getAll();
        setProducts(productsRes.data);

        const suppliersRes = await suppliersApi.getAll();
        setSuppliers(suppliersRes.data);

        const brandsRes = await brandsApi.getAll();
        setBrand(brandsRes.data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Không thể lấy danh sách dữ liệu. Vui lòng thử lại!");
      }
    };
    fetchData();
  }, [currentPage, pageSize,searchText, workSomeThing]); // Trigger fetch when page or page size changes

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to page 1 when page size is changed
  };

  const handleViewReceipt = (record) => {
    setSelectedReceipt(record);
    setPrintModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddNew = () => {
    form.resetFields();
    setEditMode(false);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      id: record.id,
      productId: record.product?.id,
      supplierId: record.supplier?.id,
      brandId: record.brand?.id,
      orderDate: moment(record.orderDate),
      quantity: record.quantity,
      price: record.price,
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { productId, supplierId, brandId, ...restValues } = values;
      const res = {
        ...restValues,
        product: { id: productId },
        supplier: { id: supplierId },
        brand: { id: brandId },
      };

      if (editMode) {
        await stock_ReceiptsAPi.update(res.id, res);
        message.success("Cập nhật phiếu nhập thành công!");
      } else {
        delete res.id;
        await stock_ReceiptsAPi.create(res);
        message.success("Thêm phiếu nhập thành công!");
      }
      setModalVisible(false);
      form.resetFields();
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu phiếu nhập!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await stock_ReceiptsAPi.delete(id);
      message.success(response.data || "Xóa Phiếu nhập kho thành công!");
      console.log(response);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể xóa phiếu nhập!");
    }
  };

  return (
    <div className="stock-receipts-container">
      <Row justify="space-between">
        <Title level={2}>📦 Quản lý Phiếu Nhập Kho</Title>
        <Button
          type="primary"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleAddNew}
        >
          Nhập Phiếu Mới
        </Button>
      </Row>
      <Card className="receipts-table">
        <Table
          columns={[
            { title: "🆔 ID", dataIndex: "id", key: "id", align: "center" },
            {
              title: "📅 Ngày nhập",
              dataIndex: "orderDate",
              key: "orderDate",
              align: "center",
            },
            {
              title: "🏷️ Sản phẩm",
              dataIndex: ["product", "name"],
              key: "product.name",
              align: "center",
            },
            {
              title: "🏢 Nhà cung cấp",
              dataIndex: ["supplier", "name"],
              key: "supplier.name",
              align: "center",
            },
            {
              title: "🏢 Thương Hiệu",
              dataIndex: ["brand", "name"],
              key: "brand.name",
              align: "center",
            },
            {
              title: "📂 Loại sản phẩm",
              dataIndex: ["product", "categorie", "name"],
              key: "product.categorie.name",
              align: "center",
            },
            {
              title: "📦 Số lượng",
              dataIndex: "quantity",
              key: "quantity",
              align: "center",
            },
            {
              title: "💰 Tổng Giá nhập",
              dataIndex: "price",
              key: "price",
              align: "center",
              render: (price) => `${price.toLocaleString()} VND`,
            },
            {
              title: "⚙️ Hành động",
              key: "actions",
              align: "center",
              render: (_, record) => (
                <Space size="middle">
                  <Tooltip title="In Phiếu Nhập">
                    <Button
                      type="default"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                      onClick={() => handleViewReceipt(record)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Button
                      type="primary"
                      icon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => handleEdit(record)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      danger
                      icon={<FontAwesomeIcon icon={faTrashAlt} />}
                      onClick={() => handleDelete(record.id)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          pagination={false}
          loading={loading}
          dataSource={stockReceipts.map((receipt) => ({
            ...receipt,
            key: receipt.id,
          }))}
        />
      </Card>

      {/* Modal to Add/Edit Stock Receipt */}
      <Modal
        title={
          editMode ? "✏️ Sửa Phiếu nhập kho Nhập" : "🆕 Nhập Phiếu nhập kho Mới"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
      >
        <Form layout="vertical" form={form}>
          {/* Form Fields */}
          <Form.Item name="id" hidden>
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="📦 Chọn Sản Phẩm"
            name="productId"
            rules={[{ required: true, message: "Chọn sản phẩm!" }]}
          >
            <Select placeholder="Chọn sản phẩm">
              {products.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="🏢 Nhà cung cấp"
            name="supplierId"
            rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}
          >
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="🏢 Thương hiệu"
            name="brandId"
            rules={[{ required: true, message: "Chọn thương hiệu!" }]}
          >
            <Select placeholder="Chọn thương hiệu">
              {brand.map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="📅 Ngày nhập"
            name="orderDate"
            rules={[{ required: true, message: "Chọn ngày nhập!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="📦 Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Nhập số lượng!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="💰 Giá nhập"
            name="price"
            rules={[{ required: true, message: "Nhập giá nhập!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi Tiết Phiếu Nhập Kho"
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={[
          <Button
            key="print"
            type="primary"
            icon={<FontAwesomeIcon icon={faPrint} />}
            onClick={handlePrint}
            style={{ marginRight: 8 }}
          >
            In Phiếu Nhập
          </Button>,
          <Button key="close" onClick={() => setPrintModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedReceipt && (
          <div ref={printRef} className="printable-receipt">
            <Card
              style={{
                padding: 20,
                borderRadius: 8,
                border: "1px solid #e8e8e8",
              }}
            >
              {/* Thông tin chung */}
              <Title level={4} style={{ marginBottom: 16, color: "#333" }}>
                Thông Tin Phiếu Nhập
              </Title>
              <Row gutter={[16, 16]} style={{ fontSize: 14 }}>
                <Col span={12}>
                  <Text strong>🆔 Mã phiếu: </Text> {selectedReceipt.id}
                </Col>
                <Col span={12}>
                  <Text strong>📅 Ngày nhập: </Text>{" "}
                  {moment(selectedReceipt.orderDate).format("DD/MM/YYYY")}
                </Col>
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              {/* Thông tin sản phẩm */}
              <Title level={4} style={{ marginBottom: 16, color: "#333" }}>
                Thông Tin Sản Phẩm
              </Title>
              <Row gutter={[16, 16]} style={{ fontSize: 14 }}>
                <Col span={12}>
                  <Text strong>Tên sản phẩm: </Text>{" "}
                  {selectedReceipt.product?.name}
                </Col>
                <Col span={12}>
                  <Text strong>Danh mục: </Text>{" "}
                  {selectedReceipt.product?.categorie?.name}
                </Col>
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              {/* Thông tin nhà cung cấp */}
              <Title level={4} style={{ marginBottom: 16, color: "#333" }}>
                Nhà Cung Cấp & Thương Hiệu
              </Title>
              <Row gutter={[16, 16]} style={{ fontSize: 14 }}>
                <Col span={12}>
                  <Text strong>Nhà cung cấp: </Text>{" "}
                  {selectedReceipt.supplier?.name}
                </Col>
                <Col span={12}>
                  <Text strong>Thương hiệu: </Text>{" "}
                  {selectedReceipt.brand?.name}
                </Col>
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              {/* Thông tin giá nhập */}
              <Title level={4} style={{ marginBottom: 16, color: "#333" }}>
                Chi Tiết Giá Nhập
              </Title>
              <Row gutter={[16, 16]} style={{ fontSize: 14 }}>
                <Col span={12}>
                  <Text strong>Số lượng: </Text> {selectedReceipt.quantity}
                </Col>
                <Col span={12}>
                  <Text strong>Tổng giá nhập: </Text>{" "}
                  {selectedReceipt.price.toLocaleString()} VND
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>

      <div className="table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            gap: 10,
          }}
        >
          {/* Gọi component phân trang */}
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* Dropdown chọn số lượng hàng */}
          <Select
            value={pageSize}
            style={{ width: 120, marginTop: 20 }}
            onChange={handlePageSizeChange} // ✅ Gọi hàm mới để reset trang về 1
          >
            <Select.Option value={5}>5 hàng</Select.Option>
            <Select.Option value={10}>10 hàng</Select.Option>
            <Select.Option value={20}>20 hàng</Select.Option>
            <Select.Option value={50}>50 hàng</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Stock_Receipts;
