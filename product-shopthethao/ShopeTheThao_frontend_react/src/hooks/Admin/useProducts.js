import { useState, useEffect, useCallback } from "react";
import { productsSizeApi } from "api/Admin"
import { message } from "antd";
;

const useProducts = (currentPage, pageSize, searchText) => {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const fetchProducts = useCallback(async () => {
    if (!currentPage || !pageSize) return;
    setLoading(true);
    try {
      const res = await productsSizeApi.getAll(currentPage, pageSize, searchText);
      setProducts(res.data);
      setTotalItems(res.totalItems);
    } catch (error) {
      message.error("Không thể tải danh sách sản phẩm!");
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, totalItems, loading, fetchProducts };
};

export default useProducts;
