import { useState, useEffect } from 'react';
import { message } from 'antd';
import { categoriesApi } from 'api/Admin';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoriesApi.getByPage(currentPage, pageSize);
        if (isMounted) {
          setCategories(res.data);
          setTotalItems(res.totalItems);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách danh mục. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, workSomeThing]);

  const createCategory = async (values) => {
    try {
      await categoriesApi.create(values);
      message.success("Thêm danh mục thành công!");
      setWorkSomeThing(prev => !prev);
      return true;
    } catch (error) {
      message.error("Không thể thêm danh mục. Vui lòng thử lại!");
      return false;
    }
  };

  const updateCategory = async (id, values) => {
    try {
      await categoriesApi.update(id, values);
      message.success("Cập nhật danh mục thành công!");
      setWorkSomeThing(prev => !prev);
      return true;
    } catch (error) {
      message.error("Không thể cập nhật danh mục. Vui lòng thử lại!");
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await categoriesApi.delete(id);
      message.success(response.data || "Xóa danh mục thành công!");
      setWorkSomeThing(prev => !prev);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          message.error(error.response.data || "Không thể xóa danh mục do dữ liệu tham chiếu!");
        } else if (error.response.status === 404) {
          message.error("Danh mục không tồn tại hoặc đã bị xóa!");
        } else {
          message.error("Lỗi không xác định khi xóa danh mục!");
        }
      } else {
        message.error("Không thể kết nối đến máy chủ!");
      }
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return {
    categories,
    totalItems,
    currentPage,
    setCurrentPage,
    pageSize,
    loading,
    totalPages,
    createCategory,
    updateCategory,
    deleteCategory,
    handlePageSizeChange
  };
};

export default useCategories;
