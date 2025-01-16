import img from "..//..//..//assets/Img";

function HeaderAdminLeft() {
  return (
    <div className="flex items-center gap-4">
      {/* Logo Admin */}
      <div className="flex items-center gap-2">
        <img width={80} src={img.logoAdmin} alt="" />
        <div className="hidden lg:block tw-text-2xl font-semibold text-gray-800 ">
        Shope
        </div>
      </div>

      {/* Đường phân cách */}
      <div className="w-[1px] bg-gray-300 h-8 hidden lg:block"></div>

      {/* Nội dung thêm */}
      <div className="hidden lg:block text-sm font-medium text-gray-500">
       nhdinh
      </div>
    </div>
  );
}

export default HeaderAdminLeft;
