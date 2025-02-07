import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Form,
  Modal,
  Popconfirm,
  message,
  Image,
  Tag,
  Tooltip,
  Select,
  Table,
  Row,
  Upload,
  Col,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import uploadApi from "api/service/uploadApi";
import PaginationComponent from "components/PaginationComponent";
import { useCategories, useSizes } from "hooks";
import { productsApi } from "api/Admin";
import styles from "..//index.scss";


const Products = () => {
  const { Title, Text } = Typography;
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [FileListBanner, setFileListBanner] = useState([]);
  const [FileList, setFileList] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  //api
  const sizes = useSizes();
  const categories = useCategories();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resProducts = await productsApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        setProducts(resProducts.data);
        setTotalItems(resProducts.totalItems);
      } catch (error) {
        setProducts([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setWorkSomeThing([!workSomeThing]);
      let image1 =
        values.image1?.fileList?.length > 0
          ? await uploadApi.post(values.image1.fileList[0].originFileObj)
          : editingProduct?.image1;

      let image2 =
        values.image2?.fileList?.length > 0
          ? await uploadApi.post(values.image2.fileList[0].originFileObj)
          : editingProduct?.image2;

      const newProduct = {
        ...values,
        categorie: { id: values.categorie },
        image1,
        image2,
        status: values.totalQuantity > 0,
      };

      const sizes = values.sizes.map((size) => ({
        size: { id: size.size },
        quantity: size.quantity,
        price: size.price,
      }));
      newProduct.sizes = sizes;

      // Nếu đang chỉnh sửa sản phẩm
      if (editingProduct) {
        await productsApi.update(editingProduct.id, newProduct);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productsApi.create(newProduct);
        message.success("Thêm sản phẩm thành công!");
      }

      form.setFieldsValue({ sizes: [] });
      setOpen(false);
      form.resetFields();
      setEditingProduct(null);
      setFileListBanner([]);
      setFileList([]);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu sản phẩm vui lòng thực hiện lại Kích cở!");
    }
  };

  const handleSizeChange = (value, name) => {
    const sizes = form.getFieldValue("sizes") || [];
    // Kiểm tra nếu kích cỡ đã tồn tại trong danh sách, ngoại trừ phần tử hiện tại (name)
    const sizeExists = sizes.some(
      (size, index) => index !== name && size.size === value
    );
    if (sizeExists) {
      message.error("Kích cỡ này đã tồn tại trong danh sách! Không thể thêm!");
      return;
    }
    // Nếu chưa có, cập nhật lại kích cỡ
    const updatedSizes = sizes.map((size, index) =>
      index === name ? { ...size, size: value } : size
    );
    form.setFieldsValue({
      sizes: updatedSizes,
    });
  };

  const handleEdit = (record) => {
    const newUploadFiles1 = record.image1
      ? [
          {
            uid: `${record.id}-1`,
            name: record.image1,
            url: `http://localhost:8081/api/upload/${encodeURIComponent(
              record.image1
            )}`,
          },
        ]
      : [];

    const newUploadFiles2 = record.image2
      ? [
          {
            uid: `${record.id}-2`,
            name: record.image2,
            url: `http://localhost:8081/api/upload/${encodeURIComponent(
              record.image2
            )}`,
          },
        ]
      : [];

    // Cập nhật danh sách ảnh vào state
    setFileListBanner(newUploadFiles1);
    setFileList(newUploadFiles2);
    setOpen(true);
    setEditingProduct(record);

    form.setFieldsValue({
      ...record,
      categorie: record.categorie?.id,
      sizes: record.sizes.map((size) => ({
        size: size.size.id,
        quantity: size.quantity,
        price: size.price,
      })),
    });

    const totalQuantity = calculateTotalQuantity(record.sizes);
    setTotalQuantity(totalQuantity);
  };

  // 🔥 Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await productsApi.delete(id);
      message.success("Xóa sản phẩm thành công!");
      setWorkSomeThing([!workSomeThing]);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      message.error("Không thể xóa sản phẩm!");
    }
  };

  const calculateTotalQuantity = (sizes) => {
    return sizes.reduce((total, size) => total + (size.quantity || 0), 0);
  };

  const handleSizeQuantityChange = (value, index) => {
    const sizes = form.getFieldValue("sizes") || [];
    sizes[index].quantity = value;
    const updatedTotalQuantity = calculateTotalQuantity(sizes);
    form.setFieldsValue({ sizes, totalQuantity: updatedTotalQuantity });
    setTotalQuantity(updatedTotalQuantity);
  };

  const handleModalCancel = () => {
    setOpen(false);
    setEditingProduct(null);
    form.resetFields();
    setFileListBanner([]);
    setFileList([]);

    setTimeout(() => {
      form.setFieldsValue({ sizes: [] });
    }, 0);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview); // Set the preview image URL or base64 string
    setPreviewOpen(true); // Open the preview modal
  };

  //phan trang 50
  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  // Cấu hình cột bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text || "Không có mô tả"} placement="top">
          <Text strong>
            <span className="ellipsis-text">
              {text?.length > 15
                ? `${text.substring(0, 15)}...`
                : text || "Không có Tên sản phẩm"}
            </span>
          </Text>
        </Tooltip>
      ),
    },

    {
      title: "Tổng Sản Phẩm",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: ["categorie", "name"],
      key: "categorie",
      render: (text) => (
        <Tooltip title={text || "Không có mô tả"} placement="top">
          <span className="ellipsis-text">
            {text?.length > 15
              ? `${text.substring(0, 15)}...`
              : text || "Không có mô tả"}
          </span>
        </Tooltip>
      ),
    },

    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text || "Không có mô tả"} placement="top">
          <span className="ellipsis-text">
            {text?.length > 20
              ? `${text.substring(0, 20)}...`
              : text || "Không có mô tả"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "totalQuantity",
      key: "status",
      render: (totalQuantity) => (
        <Tag color={totalQuantity > 0 ? "green" : "red"}>
          {totalQuantity > 0 ? "Còn sản phẩm" : "Hết sản phẩm"}
        </Tag>
      ),
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image1",
      key: "image1",

      render: (_, record) => (
        <Space size="middle">
          {record.image1 ? (
            <Image
              width={105}
              height={80}
              style={{ objectFit: "contain" }}
              src={`http://localhost:8081/api/upload/${record.image1}`}
              alt="Ảnh sản phẩm"
            />
          ) : (
            <span>Không có ảnh</span>
          )}
        </Space>
      ),
    },

    {
      title: "Hình ảnh 2",
      dataIndex: "image2",
      key: "image2",
      render: (_, record) => (
        <Space size="middle">
          {record.image2 ? (
            <Image
              width={105}
              height={80}
              style={{ objectFit: "contain" }}
              src={`http://localhost:8081/api/upload/${record.image2}`}
              alt="Ảnh sản phẩm"
            />
          ) : (
            <span>Không có ảnh</span>
          )}
        </Space>
      ),
    },

    {
      title: "Giá Góc",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Kích cỡ | Số Lượng | Giá tiền",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) => (
        <Space direction="vertical" size="small">
          {sizes.map((size, index) => (
            <div key={index}>
              <strong>{size.size?.name}</strong> - {size.quantity} chiếc -{" "}
              {size.price.toLocaleString()} VND
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space key={record.id} size="middle">
          <Tooltip>
            <FontAwesomeIcon
              icon={faEdit}
              style={{ color: "#28a745", cursor: "pointer", fontSize: "16px" }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip>
              <FontAwesomeIcon
                icon={faTrashAlt}
                style={{
                  color: "#dc3545",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              />
            </Tooltip>


          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Sản phẩm</h2>
        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
              setTimeout(() => {
                form.setFieldsValue({ sizes: [] });
              }, 0);
            }}
            className="add-btn"
          >
            Thêm sản phẩm
          </Button>
        </div>

        <Modal
          title={
            <div className={styles.modalTitle}>
              {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </div>
          }
          open={open}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          centered
          className={styles.modalWidth} // Áp dụng kích thước chuẩn
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                  ]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Mô tả sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả sản phẩm!",
                    },
                  ]}
                >
                  <Input.TextArea rows={2} placeholder="Nhập mô tả sản phẩm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="totalQuantity" label="Tổng số lượng">
                  <Input value={totalQuantity} disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="categorie"
                  label="Chọn danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Chọn danh mục"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={categories?.map((categorie) => ({
                      value: categorie.id,
                      label: categorie.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Upload ảnh */}
            <Row gutter={16} justify="space-between">
              <Col span={12}>
                <Form.Item
                  label={<span>Hình ảnh 1</span>}
                  name="image1"
                  rules={[
                    { required: true, message: "Vui lòng tải lên hình ảnh 1!" },
                  ]}
                >
                  <Upload
                    beforeUpload={() => false}
                    accept=".png, .jpg, .jpeg"
                    listType="picture-card"
                    fileList={FileListBanner}
                    onChange={({ fileList }) => setFileListBanner(fileList)}
                    onPreview={handlePreview}
                    maxCount={1}
                  >
                    {FileListBanner.length < 1 && "+ Upload"}
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<span>Hình ảnh 2</span>}
                  name="image2"
                  rules={[
                    { required: true, message: "Vui lòng tải lên hình ảnh 2!" },
                  ]}
                >
                  <Upload
                    beforeUpload={() => false}
                    accept=".png, .jpg, .jpeg"
                    listType="picture-card"
                    fileList={FileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    onPreview={handlePreview}
                    maxCount={1}
                  >
                    {FileList.length < 1 && "+ Upload"}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="price"
                  label="Giá sản phẩm"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                    {
                      validator: (_, value) => {
                        if (!value || isNaN(value) || value < 1000) {
                          return Promise.reject(
                            new Error(
                              "Giá sản phẩm không thể nhỏ hơn 1,000 VND!"
                            )
                          );
                        }
                        if (value > 1000000000) {
                          return Promise.reject(
                            new Error(
                              "Giá sản phẩm không thể vượt quá 1 tỷ VND!"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1000}
                    max={1000000000}
                    step={1000}
                    placeholder="Nhập giá sản phẩm (VND)"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.List
              name="sizes"
              initialValue={
                editingProduct
                  ? editingProduct.sizes.map((size) => ({
                      size: size.size.id,
                      quantity: size.quantity,
                      price: size.price,
                    }))
                  : []
              }
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row key={key} gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "size"]}
                          label="Kích cỡ"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn kích cỡ!",
                            },
                          ]}
                        >
                          <Select
                            options={sizes.map((size) => ({
                              value: size.id,
                              label: size.name,
                            }))}
                            onChange={(value) => handleSizeChange(value, name)} // Đảm bảo mỗi lần thay đổi gọi hàm kiểm tra trùng
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Số lượng"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng lớn hơn 1!",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            min={1}
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              handleSizeQuantityChange(value, name);
                            }}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          label="Giá"
                        >
                          <Input type="number" min={0} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Button
                          type="danger"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                          block
                        >
                          Xoá kích cỡ
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Thêm kích cỡ
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
          <Modal
            open={previewOpen}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img
              alt="example"
              style={{
                width: "100%",
                objectFit: "contain",
              }}
              src={previewImage}
              onError={() => setPreviewImage(null)}
            />
          </Modal>
        </Modal>
      </Row>

      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        dataSource={products.map((product, index) => ({
          ...product,
          key: product.id ?? `product-${index}`,
          totalQuantity: calculateTotalQuantity(product.sizes),
        }))}
      />

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
  );
};

export default Products;
