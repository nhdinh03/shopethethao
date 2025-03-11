import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Space,
  Form,
  Modal,
  message,
  Select,
  Table,
  Row,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";

import uploadApi from "api/service/uploadApi";
import PaginationComponent from "components/User/PaginationComponent";
import { useCategories, useSizes } from "hooks";
import { productsApi } from "api/Admin";
import "../index.scss";
import styles from "../modalStyles.module.scss";
import { ProductColumns, ProductForm } from "components/Admin";


const Products = () => {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [FileList, setFileList] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const originalProductRef = useRef(null);

  //api
  const sizes = useSizes();
  const categories = useCategories();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resProducts = await productsApi.getByPage(currentPage, pageSize);
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
  }, [currentPage, pageSize, workSomeThing]);

  // Thêm hàm xử lý URL ảnh
  const processImageUrls = (images) => {
    if (!images) return [];
    return images.map((img, index) => {
      const imageUrl = img.imageUrl;
      const fullUrl = `http://localhost:8081/api/upload/${imageUrl}`;
      return {
        uid: `${index}`,
        name: imageUrl,
        status: "done",
        url: fullUrl,
        imageUrl: imageUrl, // Lưu lại imageUrl gốc
      };
    });
  };

  const compareFormWithOriginal = () => {
    if (!editingProduct || !originalProductRef.current) return true;

    const currentValues = form.getFieldsValue();
    const original = originalProductRef.current;

    // Kiểm tra các thay đổi cơ bản
    if (currentValues.name !== original.name) return true;
    if (currentValues.description !== original.description) return true;
    if (parseFloat(currentValues.price) !== original.price) return true;
    if (currentValues.categorie !== original.categorie?.id) return true;

    // Kiểm tra thay đổi trong sizes
    const currentSizes = currentValues.sizes || [];
    const originalSizes = original.sizes || [];
    
    if (currentSizes.length !== originalSizes.length) return true;
    
    // So sánh từng size
    for (let i = 0; i < currentSizes.length; i++) {
      const curr = currentSizes[i];
      const orig = originalSizes[i];
      
      if (!curr || !orig) return true;
      if (curr.size !== orig.size.id) return true;
      if (parseInt(curr.quantity) !== orig.quantity) return true;
      if (parseFloat(curr.price) !== orig.price) return true;
    }

    // Kiểm tra ảnh
    const currentImages = currentValues.images?.fileList || [];
    const originalImages = original.images || [];

    if (currentImages.length !== originalImages.length) return true;

    // So sánh từng ảnh
    for (const currImg of currentImages) {
      if (currImg.originFileObj) return true; // Có ảnh mới
      
      // Kiểm tra xem ảnh có trong ảnh gốc không
      const imgUrl = currImg.imageUrl || currImg.url?.split('/').pop();
      const exists = originalImages.some(origImg => origImg.imageUrl === imgUrl);
      if (!exists) return true;
    }

    return false; // Không có thay đổi
  };

  const handleFormValuesChange = () => {
    const hasChanges = compareFormWithOriginal();
    setIsFormChanged(hasChanges);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Nếu đang cập nhật và không có thay đổi, đóng modal và không làm gì cả
      if (editingProduct && !isFormChanged) {
        setOpen(false);
        setEditingProduct(null);
        form.resetFields();
        setFileList([]);
        return;
      }

      const imagesFileList = values.images?.fileList || [];
      let uploadedImages = [];

      // Xử lý ảnh khi cập nhật sản phẩm
      if (editingProduct) {
        uploadedImages = await Promise.all(
          imagesFileList.map(async (file) => {
            // Nếu là ảnh đã tồn tại (có imageUrl hoặc url)
            if (file.imageUrl || (file.url && !file.originFileObj)) {
              const imageUrl = file.imageUrl || file.url.split('/').pop();
              return {
                imageUrl: imageUrl,
                isExisting: true
              };
            }
            // Nếu là ảnh mới (có originFileObj)
            if (file.originFileObj) {
              const uploadedUrl = await uploadApi.post(file.originFileObj);
              return {
                imageUrl: uploadedUrl,
                isExisting: false
              };
            }
            return null;
          })
        );
      } else {
        // Xử lý ảnh khi thêm mới sản phẩm
        uploadedImages = await Promise.all(
          imagesFileList.map(async (file) => {
            if (file.originFileObj) {
              const uploadedUrl = await uploadApi.post(file.originFileObj);
              return {
                imageUrl: uploadedUrl,
                isExisting: false
              };
            }
            return null;
          })
        );
      }

      // Lọc bỏ các giá trị null
      uploadedImages = uploadedImages.filter(img => img !== null);

      const newProduct = {
        name: values.name,
        description: values.description,
        totalQuantity: values.totalQuantity,
        categorie: { id: values.categorie },
        images: uploadedImages.map(img => ({ imageUrl: img.imageUrl })),
        price: parseFloat(values.price),
        sizes: values.sizes.map((size) => ({
          size: { id: size.size },
          quantity: parseInt(size.quantity),
          price: parseFloat(size.price),
        })),
        status: values.totalQuantity > 0,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, newProduct);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productsApi.create(newProduct);
        message.success("Thêm sản phẩm thành công!");
      }

      setOpen(false);
      form.resetFields();
      setFileList([]);
      setEditingProduct(null);
      setWorkSomeThing(!workSomeThing);
    } catch (error) {
      console.error("Error saving product:", error);
      message.error("Lỗi khi lưu sản phẩm! Vui lòng thử lại.");
    }
  };

  //edit sản phẩm
  const handleEditData = (record) => {
    const processedImages = processImageUrls(record.images);
    setFileList(processedImages);
    setOpen(true);
    setEditingProduct(record);
    console.log(record);
    
    // Lưu bản gốc của sản phẩm để so sánh sau này
    originalProductRef.current = JSON.parse(JSON.stringify(record));
    
    form.setFieldsValue({
      ...record,
      categorie: record.categorie?.id,
      sizes: record.sizes.map((size) => ({
        size: size.size.id,
        quantity: size.quantity,
        price: size.price,
      })),
      // Đảm bảo cấu trúc dữ liệu images được đặt đúng
      images: { fileList: processedImages }
    });

    const totalQuantity = calculateTotalQuantity(record.sizes);
    setTotalQuantity(totalQuantity);
    
    // Reset trạng thái isFormChanged
    setIsFormChanged(false);
  };

  // 🔥 Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await productsApi.delete(id);
      message.success("Xóa sản phẩm thành công!");
      setWorkSomeThing(!workSomeThing);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      message.error("Không thể xóa sản phẩm!");
    }
  };

  //tổng sl sản phẩm
  const calculateTotalQuantity = (sizes) => {
    return sizes.reduce((total, size) => total + (size.quantity || 0), 0);
  };

  //update size
  const handleSizeQuantityChange = (value, index) => {
    const sizes = form.getFieldValue("sizes") || [];
    sizes[index].quantity = value;
    const updatedTotalQuantity = calculateTotalQuantity(sizes);
    form.setFieldsValue({ sizes, totalQuantity: updatedTotalQuantity });
    setTotalQuantity(updatedTotalQuantity);
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

  //kiểm tra kích cở trùng không
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

  //trùng ảnh và xóa ảnh
  const handleUploadChange = ({ fileList: newFileList, file }) => {
    // Kiểm tra nếu là thao tác xóa
    if (file.status === "removed") {
      // Nếu đang trong chế độ chỉnh sửa và file có imageUrl (ảnh cũ)
      if (editingProduct && file.imageUrl) {
        // Xóa ảnh từ server
        uploadApi
          .delete(file.imageUrl)
          .then(() => {
            message.success(`Đã xóa ảnh ${file.name}`);
          })
          .catch((error) => {
            message.error(`Không thể xóa ảnh ${file.name}`);
            console.error("Error deleting image:", error);
          });
      }
    }

    // Lọc ra danh sách ảnh không trùng lặp
    const uniqueFiles = [];
    const fileNames = new Set();

    newFileList.forEach((file) => {
      const fileName = file.imageUrl || file.name;
      if (!fileNames.has(fileName)) {
        fileNames.add(fileName);
        uniqueFiles.push(file);
      } else {
        message.error(`Ảnh ${fileName} đã tồn tại!`);
      }
    });

    setFileList(uniqueFiles);
  };

  //cancel
  const handleModalCancel = () => {
    setOpen(false);
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);

    setTimeout(() => {
      form.setFieldsValue({ sizes: [] });
    }, 0);
  };

  //phan trang 50
  const handlePageProductsChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  // Sử dụng component ProductColumns
  const columns = ProductColumns(handleEditData, handleDelete);

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
              {editingProduct ? (
                <span>
                  <EditOutlined /> Cập nhật sản phẩm: {editingProduct.name}
                </span>
              ) : (
                <span>
                  <PlusOutlined /> Thêm sản phẩm mới
                </span>
              )}
            </div>
          }
          open={open}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          centered
          className={styles.modalWidth}
          okText={
            <span>
              {editingProduct ? (
                <>
                  <EditOutlined /> Cập nhật
                </>
              ) : (
                <>
                  <PlusOutlined /> Thêm mới
                </>
              )}
            </span>
          }
          okButtonProps={{
            style: {
              backgroundColor: editingProduct ? '#faad14' : '#1890ff',
              borderColor: editingProduct ? '#faad14' : '#1890ff'
            },
            disabled: editingProduct && !isFormChanged
          }}
          cancelText="Hủy"
        >
          <ProductForm 
            form={form} 
            categories={categories}
            sizes={sizes}
            totalQuantity={totalQuantity}
            FileList={FileList}
            handleUploadChange={handleUploadChange}
            handleSizeChange={handleSizeChange}
            handleSizeQuantityChange={handleSizeQuantityChange}
            handleFormValuesChange={handleFormValuesChange}
          />
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
          onChange={handlePageProductsChange} // ✅ Gọi hàm mới để reset trang về 1
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
