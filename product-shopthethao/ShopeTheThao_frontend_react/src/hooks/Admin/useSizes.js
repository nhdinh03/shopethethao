import { useState, useEffect } from "react";
import { SizeApi } from "api/Admin";



const useSizes = () => {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await SizeApi.getAll();
        setSizes(res.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu kích cỡ:", error);
      }
    };
    fetchSizes();
  }, []);

  return sizes;
};

export default useSizes;
