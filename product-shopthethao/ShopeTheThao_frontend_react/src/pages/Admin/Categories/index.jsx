import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import categoriesApi from "../../../api/Admin/managementGeneral/categoriesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import style from "./Categories.scss";

const Categories = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const cx = classNames.bind(style);
  const [reloadData, setReloadData] = useState(false); // ✅ State để kích hoạt useEffect

  // 🟢 Lấy danh mục có phân trang
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await categoriesApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          setCategories(res.data);
          setTotalItems(res.totalItems);
        }
      } catch (error) {
        if (isMounted) {
          message.error("Không thể lấy danh sách danh mục. Vui lòng thử lại!");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, reloadData]); // ✅ Reload lại khi có thay đổi

  // 🟢 Làm mới danh mục
  const refreshList = () => {
    setReloadData((prev) => !prev); // ✅ Kích hoạt useEffect
    setCurrentPage(1);
  };

  // 🟢 Chỉnh sửa danh mục
  const handleEditData = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  // 🟢 Xóa danh mục
  const handleDelete = async (id) => {
    try {
      await categoriesApi.delete(id);
      message.success("Xóa danh mục thành công!");
      refreshList(); // ✅ Gọi lại danh sách sau khi xóa
    } catch (error) {
      message.error("Không thể xóa danh mục!");
    }
  };

  // 🟢 Thêm / Cập nhật danh mục
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
  
      // 🟢 Kiểm tra xem tên danh mục có bị trùng không
      const isDuplicate = categories.some(
        (category) =>
          category.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
          (!editingCategory || category.id !== editingCategory.id) // Không tính danh mục đang chỉnh sửa
      );
  
      if (isDuplicate) {
        message.error("Tên danh mục đã tồn tại, vui lòng chọn tên khác!");
        return; // ❌ Không tiếp tục nếu trùng
      }
  
      if (editingCategory) {
        // ✅ Cập nhật danh mục
        await categoriesApi.update(editingCategory.id, values);
        message.success("Cập nhật danh mục thành công!");
      } else {
        // ✅ Thêm danh mục mới
        await categoriesApi.create(values);
        message.success("Thêm danh mục thành công!");
      }
  
      setOpen(false);
      form.resetFields();
      setEditingCategory(null);
      refreshList(); // ✅ Cập nhật danh mục ngay lập tức
    } catch (error) {
      message.error("Không thể thực hiện thao tác. Vui lòng thử lại!");
    }
  };
  

  // 🟢 Cấu hình bảng danh mục
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text.length > 30 ? text : ""} placement="top">
          <span className="ellipsis-text">
            {text.length > 30 ? `${text.substring(0, 30)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text.length > 30 ? text : ""} placement="top">
          <span className="ellipsis-text">
            {text.length > 30 ? `${text.substring(0, 30)}...` : text}
          </span>
        </Tooltip>
      ),
    },

    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <FontAwesomeIcon
            icon={faPen}
            className={cx("icon-pen")}
            onClick={() => handleEditData(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.id)}
          >
            <FontAwesomeIcon icon={faTrash} className={cx("icon-trash")} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý danh mục</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        Thêm danh mục
      </Button>

      <Table
        columns={columns}
        dataSource={categories.map((item, index) => ({
          ...item,
          key: item.id || `temp-${index}`,
        }))}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        loading={loading}
      />

      <Modal
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        open={open}
        onOk={handleModalOk}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingCategory(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả danh mục">
            <Input placeholder="Nhập mô tả danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
