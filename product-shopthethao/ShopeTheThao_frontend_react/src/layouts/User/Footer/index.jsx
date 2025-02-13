import React from "react";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">SPORT SHOP</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Chúng tôi cung cấp các sản phẩm thể thao chính hãng với chất lượng
              tốt nhất, đảm bảo sự hài lòng cho khách hàng.
            </p>
            <div className="flex space-x-4 pt-4">
              <SocialLink Icon={FiFacebook} href="https://facebook.com" />
              <SocialLink Icon={FiInstagram} href="https://instagram.com" />
              <SocialLink Icon={FiTwitter} href="https://twitter.com" />
              <SocialLink Icon={FiYoutube} href="https://youtube.com" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              {[
                "Trang chủ",
                "Sản phẩm",
                "Về chúng tôi",
                "Liên hệ",
                "Chính sách",
              ].map((item) => (
                <FooterLink key={item} text={item} />
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Danh mục</h4>
            <ul className="space-y-2">
              {["Giày thể thao", "Quần áo", "Phụ kiện", "Dụng cụ thể thao"].map(
                (item) => (
                  <FooterLink key={item} text={item} />
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-4">
              <ContactInfo
                Icon={FiMapPin}
                text="123 Đường ABC, Quận XYZ, TP.HCM"
              />
              <ContactInfo Icon={FiPhone} text="Hotline: 1900 1234" />
              <ContactInfo Icon={FiMail} text="Email: support@sportshop.com" />
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h5 className="text-white text-lg font-semibold">
                Đăng ký nhận thông tin
              </h5>
              <p className="text-gray-400 text-sm">
                Nhận thông tin về sản phẩm mới và khuyến mãi
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-4 py-2 w-full md:w-64 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md transition-colors duration-300">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      
    </footer>
  );
};

// Helper Components
const SocialLink = ({ Icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300"
  >
    <Icon className="w-4 h-4 text-white" />
  </a>
);

const FooterLink = ({ text }) => (
  <li>
    <Link
      to={`/${text.toLowerCase().replace(/\s+/g, "-")}`}
      className="text-gray-400 hover:text-white transition-colors duration-300"
    >
      {text}
    </Link>
  </li>
);

const ContactInfo = ({ Icon, text }) => (
  <li className="flex items-start space-x-3">
    <Icon className="w-5 h-5 text-blue-500 mt-1" />
    <span className="text-gray-400">{text}</span>
  </li>
);

export default Footer;
