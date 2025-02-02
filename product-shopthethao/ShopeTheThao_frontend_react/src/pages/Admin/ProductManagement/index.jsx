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
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import productsApi from "../../..//api/Admin/Products/productsApi";
import uploadApi from "..//..//..//api/service/uploadApi";
import PaginationComponent from "../../..//components/PaginationComponent";
import "./Products.module.scss";
import BaseTable from "..//..//..//components/Admin/BaseTable/BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { categoriesApi } from "..//..//..//api/Admin";

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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileListBanner, setFileListBanner] = useState([]);
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenGenre, setIsModalOpenGenre] = useState(false);

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

        // ✅ Gọi API lấy tất cả danh mục (không phụ thuộc vào sản phẩm)
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
  }, [currentPage, pageSize, searchText]);

  // 🔥 Xử lý chỉnh sửa sản phẩm
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      categorie: product.categorie?.id,
    });
    setOpen(true);
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
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      message.error("Không thể xóa sản phẩm!");
    }
  };

  // 🔥 Thêm hoặc cập nhật sản phẩm
  const handleModalOk = async () => {
    try {
        const values = await form.validateFields();

        let image1 = values.image1?.fileList?.length > 0 
            ? await uploadApi.post(values.image1.fileList[0].originFileObj) 
            : null;

        let image2 = values.image2?.fileList?.length > 0 
            ? await uploadApi.post(values.image2.fileList[0].originFileObj) 
            : null;

        console.log("🔥 Ảnh 1:", image1);
        console.log("🔥 Ảnh 2:", image2);

        const newProduct = {
            ...values,
            price: Number(values.price) || 0,
            quantity: Number(values.quantity) || 1,
            status: values.status,
            description: values.description || "",
            categorie: { id: values.categorie },
            image1: image1,
            image2: image2,
        };

        console.log("🔥 Dữ liệu sản phẩm gửi đi:", newProduct);

        if (editingProduct) {
            await productsApi.update(editingProduct.id, newProduct);
            message.success("Cập nhật sản phẩm thành công!");
        } else {
            const createdProduct = await productsApi.create(newProduct);
            message.success("Thêm sản phẩm thành công!");
        }

        setOpen(false);
        form.resetFields();
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        message.error("Không thể thêm sản phẩm!");
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

  const onChangeUpload = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log("newFileList", newFileList);
  };
  const onChangeUploadBanner = async ({ fileList: newFileList }) => {
    setFileListBanner(newFileList);
    console.log("newFileList", newFileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleCancelPreview = () => setPreviewOpen(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalGenre = () => {
    setIsModalOpenGenre(true);
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
              alt="Ảnh sản phẩm"
              src={`http://localhost:8081/api/upload/${record.image2}`}
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
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <Input type="number" min={1} placeholder="Nhập số lượng" />
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
            <Form.Item
              label="image1"
              name="image1"
              rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
            >
              <Upload
                beforeUpload={(file) => {
                  console.log({ file });
                  return false;
                }}
                accept=".png, .jpg"
                listType="picture-card"
                onChange={onChangeUploadBanner}
                onPreview={handlePreview}
                fileList={fileListBanner}
                name="image1"
                maxCount={1}
              >
                {fileListBanner.length < 1 && "+ Upload"}
              </Upload>
            </Form.Item>

            <Form.Item
              label="image2"
              name="image2"
              rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
            >
              <Upload
                beforeUpload={(file) => {
                  console.log({ file });
                  return false;
                }}
                accept=".png, .jpg"
                listType="picture-card"
                onChange={onChangeUpload}
                onPreview={onPreview}
                fileList={fileList}
                name="image2"
                maxCount={1}
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>
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
