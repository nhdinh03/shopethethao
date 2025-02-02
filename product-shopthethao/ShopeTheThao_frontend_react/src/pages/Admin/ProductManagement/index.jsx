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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import productsApi from "../../..//api/Admin/Products/productsApi";
import uploadApi from "..//..//..//api/service/uploadApi";
import PaginationComponent from "../../..//components/PaginationComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { categoriesApi } from "..//..//..//api/Admin";
import "./Products.module.scss";

const ProductManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [products, setProducts] = useState([]);
  const [categoriesName, setCategoriesName] = useState();
  const [workSomeThing, setWorkSomeThing] = useState(false); // cập nhật danh sách

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [FileListBanner, setFileListBanner] = useState([]);
  const [FileList, setFileList] = useState([]);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

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
        const resCategories = await categoriesApi.getAll();
        setCategoriesName(resCategories.data || []);
        // console.log(resCategories);
      } catch (error) {
        setProducts([]);
        setTotalItems(0);
        setCategoriesName([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchText, workSomeThing]);

  // 🔥 Xử lý chỉnh sửa sản phẩm
  const handleEdit = (record) => {
    console.log("🔥 Dữ liệu sản phẩm đang chỉnh sửa:", record);

    // Kiểm tra và tạo danh sách file từ ảnh cũ
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
    setFileListBanner(newUploadFiles1); // Danh sách ảnh của image1
    setFileList(newUploadFiles2); // Danh sách ảnh của image2
    setOpen(true);
    setEditingProduct(record);

    // Đặt giá trị vào form
    form.setFieldsValue({
      ...record,
      categorie: record.categorie?.id,
    });
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
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

  // 🔥 Thêm hoặc cập nhật sản phẩm
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
  
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
        status: values.quantity > 0, // ✅ Cập nhật trạng thái dựa trên số lượng
      };
  
      if (editingProduct) {
        await productsApi.update(editingProduct.id, newProduct);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productsApi.create(newProduct);
        message.success("Thêm sản phẩm thành công!");
      }
  
      setWorkSomeThing([!workSomeThing]);
      setOpen(false);
      form.resetFields();
      setEditingProduct(null);
    } catch (error) {
      message.error("Lỗi khi lưu sản phẩm!");
    }
  };
  

  const handleModalCancel = () => {
    setOpen(false);
    form.resetFields();
    setEditingProduct(null);
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
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Cấu hình cột bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Loại sản phẩm",
      dataIndex: ["categorie", "name"],
      key: "categorie",
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text || "Không có mô tả"} placement="top">
          <span className="ellipsis-text">
            {text?.length > 50
              ? `${text.substring(0, 50)}...`
              : text || "Không có mô tả"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Còn sản phẩm" : "Hết sản phẩm"}
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
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
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm danh mục
          </Button>
        </div>
        <Modal
          title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          open={open}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input placeholder="Nhập Số lượng" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả sản phẩm"
              rules={[{ required: true, message: "Vui lòng Mô tả sản phẩm" }]}
            >
              <Input placeholder="Mô tả sản phẩm" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng!" },
                {
                  validator: (_, value) => {
                    if (!value || isNaN(value) || value < 0) {
                      return Promise.reject(
                        new Error("Số lượng phải là số lớn hơn hoặc bằng 0!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                min={0}
                placeholder="Nhập số lượng"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  form.setFieldsValue({ status: value > 0 }); // ✅ Cập nhật trạng thái tự động
                }}
              />
            </Form.Item>

            <Form.Item
              name="categorie"
              label="Chọn danh mục"
              rules={[{ required: true, message: "Vui lòng chọn" }]}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn "
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={categoriesName?.map((categorie) => ({
                  value: categorie.id,
                  label: categorie.name,
                }))}
              />
            </Form.Item>
            <Form.Item label="image1" name="image1">
              <Upload
                beforeUpload={() => false}
                accept=".png, .jpg"
                listType="picture-card"
                fileList={FileListBanner} // Sử dụng danh sách ảnh của image1
                onChange={({ fileList }) => setFileListBanner(fileList)}
                onPreview={handlePreview}
                maxCount={1} // Chỉ cho phép 1 ảnh
              >
                {FileListBanner.length < 1 && "+ Upload"}
              </Upload>
            </Form.Item>

            <Form.Item label="image2" name="image2">
              <Upload
                beforeUpload={() => false}
                accept=".png, .jpg"
                listType="picture-card"
                fileList={FileList} // Sử dụng danh sách ảnh của image2
                onChange={({ fileList }) => setFileList(fileList)}
                onPreview={handlePreview}
                maxCount={1} // Chỉ cho phép 1 ảnh
              >
                {FileList.length < 1 && "+ Upload"}
              </Upload>
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                {
                  validator: (_, value) => {
                    if (!value || isNaN(value)) {
                      return Promise.reject(
                        new Error("Giá sản phẩm phải là số hợp lệ!")
                      );
                    }
                    if (value < 1000) {
                      return Promise.reject(
                        new Error("Giá sản phẩm không thể nhỏ hơn 1,000 VND!")
                      );
                    }
                    if (value > 1000000000) {
                      return Promise.reject(
                        new Error("Giá sản phẩm không thể vượt quá 1 tỷ VND!")
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
          </Form>
        </Modal>
      </Row>

      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        dataSource={products.map((product, index) => ({
          ...product,
          key: product.id ?? `product-${index}`,
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
          onChange={(value) => setPageSize(value)}
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

export default ProductManagement;
