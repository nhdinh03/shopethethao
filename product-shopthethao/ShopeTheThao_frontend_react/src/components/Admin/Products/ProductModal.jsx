import React, { useState } from "react";
import { Modal, Form } from "antd";
import BasicFields from './FormFields/BasicFields';
import SizeFields from './FormFields/SizeFields';
import ImageUpload from './FormFields/ImageUpload';
import styles from "pages/Admin/Products/Products.module.scss";

const ProductModal = ({
  open,
  editingProduct,
  handleModalOk,
  handleModalCancel,
  FileList,
  handleUploadChange,
  totalQuantity,
  categories,
  sizes,
  handleSizeChange,
  handleSizeQuantityChange,
  form
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  return (
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
      className={styles.modalWidth}
    >
      <Form form={form} layout="vertical">
        <BasicFields 
          categories={categories} 
          totalQuantity={totalQuantity} 
        />
        
        <ImageUpload 
          FileList={FileList} 
          handleUploadChange={handleUploadChange} 
        />
        
        <SizeFields
          sizes={sizes}
          handleSizeChange={handleSizeChange}
          handleSizeQuantityChange={handleSizeQuantityChange}
        />
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
  );
};

export default ProductModal;
