// ...existing code...

/**
 * Generates breadcrumb data for product detail pages
 * @param {Object} product - The product object
 * @returns {Array} Array of breadcrumb items
 */
export const generateProductDetailsBreadcrumb = (product) => {
  if (!product) return [];
  
  return [
    {
      title: 'Trang chủ',
      path: '/'
    },
    {
      title: 'Sản phẩm',
      path: '/products'
    },
    {
      title: product.category,
      path: `/products?category=${encodeURIComponent(product.category)}`
    },
    {
      title: product.name,
      path: `/seefulldetails/${product.id}`
    }
  ];
};

// ...existing code...
