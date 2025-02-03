import img from "assets/Img";
import { Link } from "react-router-dom";
function HeaderAdminLeft({ collapsed }) {
  return (
    <div className="flex items-center gap-4">
      <Link to="/admin/index">
        {/* ✅ Logo và chữ Shope - Giữ chữ Shope ngay cả khi thu nhỏ */}
        <div className="flex items-center gap-2">
          {!collapsed ? (
            <img
              width={80}
              src={img.logoAdmin}
              alt="Admin Logo"
              className="transition-all duration-300"
            />
          ) : null}
          {/* ✅ Luôn hiển thị chữ "Shope" */}
          <span className="text-xl font-bold text-gray-900">Shope</span>
          
        </div>
      </Link>

      {/* ✅ Ẩn đường phân cách khi sidebar thu nhỏ */}
      {!collapsed && (
        <div className="w-[1px] bg-gray-300 h-8 hidden lg:block"></div>
      )}

      {/* ✅ Ẩn tên admin khi sidebar thu nhỏ */}
      {!collapsed && (
        <div className="hidden lg:block text-lg font-semibold text-gray-700">
          nhdinh
        </div>
      )}
    </div>
  );
}

export default HeaderAdminLeft;
