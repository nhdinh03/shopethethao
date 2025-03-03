// import { Tag, Tooltip, Space, Image } from 'antd';
// import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import ActionColumn from "components/Admin/tableColumns/ActionColumn";

// const ProductColumns = (handleEditData, handleDelete) => [

//      { title: "🆔 ID", dataIndex: "id", key: "id" },
//      {
//        title: "🏷️ Tên sản phẩm",
//        dataIndex: "name",
//        key: "name",
//        render: (text) => (
//          <Tooltip title={text || "Không có mô tả"} placement="top">
//            <span className="ellipsis-text">
//              {text?.length > 35
//                ? `${text.substring(0, 15)}...`
//                : text || "Không có Tên sản phẩm"}
//            </span>
//          </Tooltip>
//        ),
//      },
//      {
//        title: "📦 Số Lượng",
//        dataIndex: "totalQuantity",
//        key: "totalQuantity",
//      },
//      {
//        title: "📂 Loại sản phẩm",
//        dataIndex: ["categorie", "name"],
//        key: "categorie",
//        render: (text) => (
//          <Tooltip title={text || "Không có mô tả"} placement="top">
//            <span className="ellipsis-text">
//              {text?.length > 25
//                ? `${text.substring(0, 15)}...`
//                : text || "Không có mô tả"}
//            </span>
//          </Tooltip>
//        ),
//      },
//      {
//        title: "📝 Mô tả sản phẩm",
//        dataIndex: "description",
//        key: "description",
//        render: (text) => (
//          <Tooltip title={text || "Không có mô tả"} placement="top">
//            <span className="ellipsis-text">
//              {text?.length > 20
//                ? `${text.substring(0, 20)}...`
//                : text || "Không có mô tả"}
//            </span>
//          </Tooltip>
//        ),
//      },
//      {
//        title: "📊 Trạng thái",
//        dataIndex: "totalQuantity",
//        key: "status",
//        render: (totalQuantity) => (
//          <Tag
//            icon={
//              totalQuantity > 0 ? (
//                <CheckCircleOutlined />
//              ) : (
//                <CloseCircleOutlined />
//              )
//            }
//            color={totalQuantity > 0 ? "green" : "red"}
//            style={{
//              borderRadius: "12px",
//              padding: "4px 12px",
//              transition: "all 0.3s ease",
//              cursor: "pointer",
//            }}
//            onMouseEnter={(e) => {
//              e.target.style.transform = "scale(1.1)";
//            }}
//            onMouseLeave={(e) => {
//              e.target.style.transform = "scale(1)";
//            }}
//          >
//            {totalQuantity > 0 ? "Còn sản phẩm" : "Hết sản phẩm"}
//          </Tag>
//        ),
//      },
 
//      {
//        title: "🖼️ Ảnh sản phẩm",
//        dataIndex: "images",
//        key: "images",
//        render: (_, record) => (
//          <Space size="middle">
//            {record.images && record.images.length > 0 ? (
//              record.images.map((image, index) => (
//                <Image
//                  key={index}
//                  width={80}
//                  height={80}
//                  style={{ objectFit: "contain" }}
//                  src={`http://localhost:8081/api/upload/${image.imageUrl}`}
//                  alt="Ảnh sản phẩm"
//                />
//              ))
//            ) : (
//              <span>Không có ảnh</span>
//            )}
//          </Space>
//        ),
//      },
//      {
//        title: "💵 Giá Mặc định",
//        dataIndex: "price",
//        key: "price",
//        render: (price) => `${price.toLocaleString()} VND`,
//      },
//      {
//        title: "Kích cỡ | Số Lượng | Giá tiền",
 
//        dataIndex: "sizes",
//        key: "sizes",
//        render: (sizes) => (
//          <Space direction="vertical" size="small">
//            {sizes.map((size, index) => (
//              <div key={index}>
//                <strong>{size.size?.name}</strong> - {size.quantity} Sản Phẩm -{" "}
//                {size.price.toLocaleString()} VND
//              </div>
//            ))}
//          </Space>
//        ),
//      },
 
//      ActionColumn(handleEditData, handleDelete),
   
// ];

// export default ProductColumns;
