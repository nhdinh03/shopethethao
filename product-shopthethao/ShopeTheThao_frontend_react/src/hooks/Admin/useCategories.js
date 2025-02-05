import { useState, useEffect } from "react";
import { categoriesApi } from "api/Admin";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", error);
      }
    };
    fetchCategories();
  }, []);

  return categories;
};

export default useCategories;
