export const productValidationRules = {
  name: [
    { required: true, message: "Vui lòng nhập tên sản phẩm!" }
  ],
  description: [
    { required: true, message: "Vui lòng nhập mô tả sản phẩm!" }
  ],
  images: [
    { required: true, message: "Vui lòng tải lên ít nhất một hình ảnh!" }
  ],
  categorie: [
    { required: true, message: "Vui lòng chọn danh mục" }
  ],
  price: [
    { required: true, message: "Vui lòng nhập giá sản phẩm!" },
    {
      validator: (_, value) => {
        if (!value || isNaN(value) || value < 1000) {
          return Promise.reject("Giá sản phẩm không thể nhỏ hơn 1,000 VND!");
        }
        if (value > 1000000000) {
          return Promise.reject("Giá sản phẩm không thể vượt quá 1 tỷ VND!");
        }
        return Promise.resolve();
      }
    }
  ],
  size: [
    { required: true, message: "Vui lòng chọn kích cỡ!" }
  ],
  quantity: [
    { required: true, message: "Vui lòng nhập số lượng lớn hơn 1!" }
  ]
};
