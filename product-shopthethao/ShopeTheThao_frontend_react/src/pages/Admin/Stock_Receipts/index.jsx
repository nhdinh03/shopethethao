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
  faMoneyBillWave,
  faShoppingCart,
  faIndustry,
  faTags,
  faBox,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { productsApi, suppliersApi, stock_ReceiptsAPi } from "api/Admin";
import moment from "moment";
import "..//index.scss";

import PaginationComponent from "components/PaginationComponent"; // Your custom pagination component
import {
  CalendarOutlined,
  DollarOutlined,
  NumberOutlined,
  PlusOutlined,
  RedoOutlined,
  TagOutlined,
  TrademarkOutlined,
} from "@ant-design/icons";
import brandsApi from "api/Admin/Brands/Brands";
import styles from "..//modalStyles.module.scss";
import dayjs from "dayjs";
const { Title, Text } = Typography;
const { Option } = Select;

const Stock_Receipts = () => {
  const printRef = useRef(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stockReceipts, setStockReceipts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [totalItems, setTotalItems] = useState(0); // Total number of items for pagination
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stockReceiptsRes = await stock_ReceiptsAPi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        const stockReceipts = stockReceiptsRes.data.map((receipt) => ({
          ...receipt,
        }));
        setStockReceipts(stockReceipts);
        setTotalItems(stockReceiptsRes.totalItems);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Không thể lấy danh sách dữ liệu. Vui lòng thử lại!");
      }
    };

    fetchData();
  }, [currentPage, pageSize, searchText, workSomeThing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await productsApi.getAll();
        setProducts(productsRes.data);
        const suppliersRes = await suppliersApi.getAll();
        setSuppliers(suppliersRes.data);
        const brandsRes = await brandsApi.getAll();
        setBrands(brandsRes.data);
      } catch (error) {
        message.error("Không thể lấy danh sách dữ liệu. Vui lòng thử lại!");
      }
    };

    fetchData();
  }, []);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to page 1 when page size is changed
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
      supplierId: record.supplierId,
      brandId: record.brandId,
      orderDate: record.orderDate ? dayjs(record.orderDate) : null,
      receiptProducts: record.receiptProducts || [],
    });

    setEditMode(record);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { receiptProducts, supplierId, brandId, orderDate, ...restValues } =
        values;

      // Parse supplierId and brandId as integers
      const parsedSupplierId = parseInt(supplierId, 10);
      const parsedBrandId = parseInt(brandId, 10);

      // Validate parsed values
      if (isNaN(parsedSupplierId) || isNaN(parsedBrandId)) {
        message.error("Supplier ID và Brand ID phải là số nguyên!");
        return;
      }

      // Kiểm tra ngày nhập kho không ở trong quá khứ
      if (moment(orderDate).isBefore(moment(), "day")) {
        message.error("Ngày nhập kho không được ở trong quá khứ!");
        return;
      }

      // Kiểm tra số lượng và giá sản phẩm
      const invalidProducts = receiptProducts.filter((product) => {
        return product.quantity <= 0 || product.price <= 0;
      });

      if (invalidProducts.length > 0) {
        message.error("Số lượng và giá sản phẩm phải lớn hơn 0!");
        return;
      }

      const processedProducts = receiptProducts.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
        totalAmount: product.quantity * product.price,
      }));

      const res = {
        ...restValues,
        supplierId: parsedSupplierId,
        brandId: parsedBrandId,
        orderDate: values.orderDate
          ? values.orderDate.format("YYYY-MM-DD")
          : null,
        receiptProducts: processedProducts,
      };

      console.log("Sending request payload:", res);

      // Kiểm tra chế độ sửa hay thêm mới
      if (editMode) {
        await stock_ReceiptsAPi.update(editMode.id, res);
        message.success("Cập nhật phiếu nhập kho thành công!");
      } else {
        await stock_ReceiptsAPi.create(res);
        message.success("Thêm phiếu nhập kho thành công!");
      }

      setWorkSomeThing([!workSomeThing]); // Trigger to refresh the data
      setEditMode(null);
      setModalVisible(false); // Close modal
      form.resetFields(); // Reset form fields
    } catch (error) {
      message.error("Lỗi khi lưu phiếu nhập kho!");
    }
  };

  const handleViewReceipt = (record) => {
    console.log(record); // Check the structure of the `record`
    setSelectedReceipt(record);
    setPrintModalVisible(true);
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

  const columns = [
    { title: "🆔 ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "📅 Ngày nhập",
      dataIndex: "orderDate",
      key: "orderDate",
      align: "center",
      render: (orderDate) => moment(orderDate).format("DD/MM/YYYY"),
    },
    {
      title: "🏢 Nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      align: "center",
    },
    {
      title: "🏢 Thương Hiệu",
      dataIndex: "brandName",
      key: "brandName",
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productNames",
      key: "productNames",
      align: "center",
      render: (productNames) => (
        <div>
          {productNames?.map((product, index) => (
            <div key={index}>{product}</div>
          ))}
        </div>
      ),
    },

    {
      title: "⚙️ Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
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
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<FontAwesomeIcon icon={faPrint} />}
              onClick={() => handleViewReceipt(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Phiếu Nhập Kho</h2>

        <div className="header-container">
          <Button
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAddNew}
          >
            Nhập Phiếu Mới
          </Button>
          s{" "}
        </div>

        <Modal
          title={editMode ? "Sửa Phiếu Nhập Kho" : "Thêm Phiếu Nhập Kho"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleModalOk}
          className={styles.modalWidth}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="🏢 Nhà cung cấp"
              name="supplierId"
              rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}
            >
              <Select placeholder="Chọn nhà cung cấp">
                {suppliers.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name} {/* Hiển thị tên nhà cung cấp */}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="🏢 Thương Hiệu"
              name="brandId"
              rules={[{ required: true, message: "Chọn thương hiệu!" }]}
            >
              <Select placeholder="Chọn thương hiệu">
                {brands.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name} {/* Hiển thị tên thương hiệu */}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày nhập kho"
              name="orderDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày nhập kho" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                // Nếu là chế độ thêm mới (editMode là null), cấm chọn ngày quá khứ
                disabledDate={(current) =>
                  editMode
                    ? false
                    : current && current.isBefore(moment().startOf("day"))
                }
              />
            </Form.Item>

            <Form.List
              name="receiptProducts"
              initialValue={[]}
              rules={[
                {
                  validator: async (_, fields) => {
                    if (!fields || fields.length < 1) {
                      return Promise.reject(
                        new Error("Ít nhất phải có một sản phẩm!")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(
                    ({ fieldKey, fieldName, name, fieldClassName }) => (
                      <Row gutter={16} key={fieldKey}>
                        {" "}
                        {/* Use fieldKey instead of fieldName */}
                        <Col span={8}>
                          <Form.Item
                            {...fieldClassName}
                            label="Sản phẩm"
                            name={[name, "productId"]}
                            rules={[
                              { required: true, message: "Chọn sản phẩm!" },
                            ]}
                          >
                            <Select placeholder="Chọn sản phẩm">
                              {products.map((product) => (
                                <Option key={product.id} value={product.id}>
                                  {product.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...fieldClassName}
                            label="Số lượng"
                            name={[name, "quantity"]}
                            rules={[
                              { required: true, message: "Nhập số lượng!" },
                            ]}
                          >
                            <InputNumber min={1} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...fieldClassName}
                            label="Giá"
                            name={[name, "price"]}
                            rules={[{ required: true, message: "Nhập giá!" }]}
                          >
                            <InputNumber min={0} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: "right" }}>
                          <Button
                            danger
                            onClick={() => remove(name)}
                            icon={<FontAwesomeIcon icon={faTrashAlt} />}
                          />
                        </Col>
                      </Row>
                    )
                  )}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                  >
                    Thêm sản phẩm
                  </Button>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
        <Modal
          title="Chi Tiết Phiếu Nhập Kho"
          open={printModalVisible}
          onCancel={() => setPrintModalVisible(false)}
          footer={[
            <Button key="print" type="primary" onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} /> In Phiếu
            </Button>,
            <Button key="close" onClick={() => setPrintModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          {selectedReceipt && (
            <div ref={printRef}>
              <Title level={4}>Thông Tin Phiếu Nhập Kho</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Mã Phiếu: </Text>
                  <Text>{selectedReceipt.id}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày Nhập: </Text>
                  <Text>
                    {moment(selectedReceipt.orderDate).format("DD/MM/YYYY")}
                  </Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Nhà Cung Cấp: </Text>
                  <Text>{selectedReceipt.supplierName}</Text>{" "}
                  {/* Hiển thị nhà cung cấp */}
                </Col>
                <Col span={12}>
                  <Text strong>Thương Hiệu: </Text>
                  <Text>{selectedReceipt.brandName}</Text>{" "}
                  {/* Hiển thị thương hiệu */}
                </Col>
              </Row>
              <Divider />

              <Title level={5}>Danh Sách Sản Phẩm</Title>
              <Table
                columns={[
                  {
                    title: "Tên Sản Phẩm",
                    dataIndex: "productName",
                    key: "productName",
                  },
                  { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
                  { title: "Đơn Giá", dataIndex: "price", key: "price" },
                  {
                    title: "Thành Tiền",
                    dataIndex: "totalAmount",
                    key: "totalAmount",
                  },
                ]}
                dataSource={selectedReceipt.receiptProducts}
                pagination={false}
                rowKey={(record) => `${record.productId}`}
              />
            </div>
          )}
        </Modal>
      </Row>
      <div className="table-container">
        <Table
          columns={columns}
          pagination={false}
          loading={loading}
          dataSource={stockReceipts.map((receipt) => ({
            ...receipt,
            key: receipt.id,
            productNames: receipt.receiptProducts?.map(
              (product) => product.productName
            ),
            totalAmount: receipt.receiptProducts?.map(
              (product) =>
                `${product.quantity} x ${product.price} = ${product.totalAmount}`
            ),
          }))}
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
            onChange={handlePageSizeChange} // Reset to page 1 when page size changes
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
