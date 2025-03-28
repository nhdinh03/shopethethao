import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import img from "assets/Img";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiUser,
  FiShoppingBag,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { message } from "antd";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { ROUTES } from "router";

import "./header.scss";
import "./header_responsive.scss";
import authApi from "api/Admin/Auth/auth";

const Header = ({ onMobileMenuToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(3); // Sample cart count
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [wishlistCount] = useState(0);
  const [popularSearches] = useState([
    "Giày chạy bộ",
    "Áo thể thao nam",
    "Đồ tập gym nữ",
    "Giày đá bóng",
    "Quần thể thao",
  ]);

  // Add these states and constants near the top with other states
  const [rotatingText, setRotatingText] = useState(
    "GIAO HÀNG MIỄN PHÍ CHO THÀNH VIÊN , TRẢ HÀNG DỄ DÀNG"
  );

  // Add this useEffect for text rotation
  useEffect(() => {
    const messages = ["GIAO HÀNG MIỄN PHÍ CHO THÀNH VIÊN", "TRẢ HÀNG DỄ DÀNG"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setRotatingText(messages[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Reorder main categories to keep OUTLET in center
  const mainCategories = [
    {
      id: "giay",
      name: "GIÀY",
      path: "/category/giay",
      isPrimary: true,
      bold: true,
    },
    {
      id: "nam",
      name: "NAM",
      path: "/category/nam",
      isPrimary: true,
      bold: true,
    },
    {
      id: "nu",
      name: "NỮ",
      path: "/category/nu",
      isPrimary: true,
      bold: true,
    },

    {
      id: "tre-em",
      name: "TRẺ EM",
      path: "/category/tre-em",
    },
    {
      id: "the-thao",
      name: "THỂ THAO",
      path: "/category/the-thao",
    },
    {
      id: "nhan-hieu",
      name: "NHÃN HIỆU",
      path: "/category/nhan-hieu",
    },
    {
      id: "outlet",
      name: "OUTLET",
      path: "/category/outlet",
      isSpecial: true,
      isCentered: true,
      bold: true,
    },
  ];

  // Define categoryDetails with realistic structures based on the provided information
  const categoryDetails = {
    giay: {
      title: "Giày",
      path: "/category/giay",
      groups: [
        {
          title: "Nổi bật",
          isHighlight: true,
          items: [
            { name: "Hàng mới về", path: "/category/giay/moi-ve", isNew: true },
            { name: "Trending shoes", path: "/category/giay/trending" },
            {
              name: "Every Day Running",
              path: "/category/giay/everyday-running",
            },
            { name: "Tiếp sức đường chạy", path: "/category/giay/marathon" },
            { name: "Race to win", path: "/category/giay/race" },
          ],
        },
        {
          title: "Các mẫu nổi bật",
          items: [
            { name: "Samba", path: "/category/giay/samba" },
            { name: "Gazelle", path: "/category/giay/gazelle" },
            { name: "Campus", path: "/category/giay/campus" },
            { name: "Spezial", path: "/category/giay/spezial" },
            { name: "Duramo", path: "/category/giay/duramo" },
            { name: "SL 72", path: "/category/giay/sl-72" },
          ],
        },
        {
          title: "Theo môn thể thao",
          items: [
            { name: "Chạy bộ", path: "/category/giay/chay-bo" },
            { name: "Bóng đá", path: "/category/giay/bong-da" },
            { name: "Tập luyện", path: "/category/giay/tap-luyen" },
            { name: "Bóng rổ", path: "/category/giay/bong-ro" },
            { name: "Tennis", path: "/category/giay/tennis" },
            { name: "Golf", path: "/category/giay/golf" },
          ],
        },
      ],
      featuredImage: {
        src: "https://assets.adidas.com/images/w_600,f_auto,q_auto/068eefec8e1a47c8872cad26000ee265_9366/FW3286_01_standard.jpg",
        alt: "Giày thể thao mới nhất",
        title: "BỘ SƯU TẬP GIÀY MỚI",
        description: "Khám phá các mẫu giày thể thao mới nhất",
        link: "/category/giay/new-collection",
      },
      quickLinks: [
        { name: "Tất cả giày", path: "/category/giay" },
        { name: "Giày nam", path: "/category/giay/nam" },
        { name: "Giày nữ", path: "/category/giay/nu" },
        { name: "Giày trẻ em", path: "/category/giay/tre-em" },
      ],
    },

    nam: {
      title: "Nam",
      path: "/category/nam",
      groups: [
        {
          title: "Các sản phẩm nổi bật",
          isHighlight: true,
          items: [
            {
              name: "Hàng mới về",
              path: "/category/nam/hang-moi-ve",
              isNew: true,
            },
            { name: "Release Dates", path: "/category/nam/release-dates" },
            { name: "Độc quyền hội viên", path: "/category/nam/doc-quyen" },
            { name: "Optime", path: "/category/nam/optime" },
            { name: "Equipment", path: "/category/nam/equipment" },
          ],
        },
        {
          title: "Giày",
          items: [
            { name: "Originals", path: "/category/nam/giay/originals" },
            { name: "Chạy bộ", path: "/category/nam/giay/chay-bo" },
            { name: "Tập luyện", path: "/category/nam/giay/tap-luyen" },
            { name: "Dép & Dép xỏ ngón", path: "/category/nam/giay/dep" },
            { name: "Quần vợt", path: "/category/nam/giay/quan-vot" },
            { name: "Sportswear", path: "/category/nam/giay/sportswear" },
            { name: "Sneakers", path: "/category/nam/giay/sneakers" },
          ],
        },
        {
          title: "Quần áo",
          items: [
            {
              name: "Áo thun & croptop",
              path: "/category/nam/quan-ao/ao-thun",
            },
            { name: "Áo Nỉ", path: "/category/nam/quan-ao/ao-ni" },
            { name: "Áo Hoodie", path: "/category/nam/quan-ao/ao-hoodie" },
            { name: "Áo khoác", path: "/category/nam/quan-ao/ao-khoac" },
            { name: "Quần", path: "/category/nam/quan-ao/quan" },
            { name: "Quần short", path: "/category/nam/quan-ao/quan-short" },
          ],
        },
        {
          title: "Thể thao",
          items: [
            { name: "Chạy", path: "/category/nam/the-thao/chay" },
            { name: "Tập luyện", path: "/category/nam/the-thao/tap-luyen" },
            { name: "Golf", path: "/category/nam/the-thao/golf" },
            { name: "Quần vợt", path: "/category/nam/the-thao/quan-vot" },
            { name: "Bóng rổ", path: "/category/nam/the-thao/bong-ro" },
            { name: "Motorsport", path: "/category/nam/the-thao/motorsport" },
          ],
        },
      ],
      featuredImage: {
        src: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/viVN/Images/football-ss22-predator-education-navigation-dropdown-d_tcm337-865864.jpg",
        alt: "Bộ sưu tập Motorsport",
        title: "BỘ SƯU TẬP MOTORSPORT",
        description: "Khám phá trang phục thể thao phong cách đua xe",
        link: "/category/nam/motorsport",
      },
      quickLinks: [
        { name: "Tất cả sản phẩm nam", path: "/category/nam" },
        { name: "Tất cả giày nam", path: "/category/nam/giay" },
        { name: "Tất cả quần áo nam", path: "/category/nam/quan-ao" },
      ],
    },

    nu: {
      title: "Nữ",
      path: "/category/nu",
      groups: [
        {
          title: "Nổi bật",
          isHighlight: true,
          items: [
            {
              name: "Hàng mới về",
              path: "/category/nu/hang-moi-ve",
              isNew: true,
            },
            { name: "Bestsellers", path: "/category/nu/bestsellers" },
            { name: "Bộ sưu tập mới", path: "/category/nu/bo-suu-tap-moi" },
          ],
        },
        {
          title: "Giày",
          items: [
            { name: "Originals", path: "/category/nu/giay/originals" },
            { name: "Chạy bộ", path: "/category/nu/giay/chay-bo" },
            { name: "Tập luyện", path: "/category/nu/giay/tap-luyen" },
            { name: "Dép & Dép xỏ ngón", path: "/category/nu/giay/dep" },
            { name: "Quần vợt", path: "/category/nu/giay/quan-vot" },
            { name: "Sportswear", path: "/category/nu/giay/sportswear" },
            { name: "Sneakers", path: "/category/nu/giay/sneakers" },
          ],
        },
        {
          title: "Quần áo",
          items: [
            { name: "Áo thun & croptop", path: "/category/nu/quan-ao/ao-thun" },
            { name: "Áo ngực thể thao", path: "/category/nu/quan-ao/ao-nguc" },
            { name: "Áo hoodie & nỉ", path: "/category/nu/quan-ao/ao-hoodie" },
            { name: "Áo khoác", path: "/category/nu/quan-ao/ao-khoac" },
            { name: "Quần & Leggings", path: "/category/nu/quan-ao/quan" },
            { name: "Quần short", path: "/category/nu/quan-ao/quan-short" },
            { name: "Đầm & Chân váy", path: "/category/nu/quan-ao/vay" },
          ],
        },
        {
          title: "Thể thao",
          items: [
            { name: "Chạy", path: "/category/nu/the-thao/chay" },
            { name: "Tập luyện", path: "/category/nu/the-thao/tap-luyen" },
            { name: "Tập Yoga", path: "/category/nu/the-thao/yoga" },
            { name: "Golf", path: "/category/nu/the-thao/golf" },
            { name: "Quần vợt", path: "/category/nu/the-thao/quan-vot" },
          ],
        },
      ],
      featuredImage: {
        src: "https://assets.adidas.com/images/w_600,f_auto,q_auto/f6bfb2dbc8f24b91bb3eaf0600e78281_9366/HK2929_21_model.jpg",
        alt: "Bộ sưu tập nữ mới",
        title: "BỘ SƯU TẬP SPORTSWEAR",
        description: "Năng động và thời trang mỗi ngày",
        link: "/category/nu/sportswear",
      },
      quickLinks: [
        { name: "Tất cả sản phẩm nữ", path: "/category/nu" },
        { name: "Tất cả giày nữ", path: "/category/nu/giay" },
        { name: "Tất cả quần áo nữ", path: "/category/nu/quan-ao" },
      ],
    },

    "tre-em": {
      title: "Trẻ em",
      path: "/category/tre-em",
      groups: [
        {
          title: "Nổi bật",
          isHighlight: true,
          items: [
            {
              name: "Mới cho trẻ em",
              path: "/category/tre-em/hang-moi-ve",
              isNew: true,
            },
            { name: "Sản phẩm bán chạy", path: "/category/tre-em/ban-chay" },
            { name: "Essentials", path: "/category/tre-em/essentials" },
            { name: "Star Wars", path: "/category/tre-em/star-wars" },
            { name: "Disney", path: "/category/tre-em/disney" },
            { name: "Hello Kitty", path: "/category/tre-em/hello-kitty" },
          ],
        },
        {
          title: "Thanh thiếu niên (8-16 tuổi)",
          items: [
            {
              name: "Quần áo bé trai",
              path: "/category/tre-em/teen/quan-ao-be-trai",
            },
            {
              name: "Quần áo bé gái",
              path: "/category/tre-em/teen/quan-ao-be-gai",
            },
            {
              name: "Giày bé trai",
              path: "/category/tre-em/teen/giay-be-trai",
            },
            { name: "Giày bé gái", path: "/category/tre-em/teen/giay-be-gai" },
          ],
        },
        {
          title: "Trẻ em (4-8 tuổi)",
          items: [
            {
              name: "Quần áo bé trai",
              path: "/category/tre-em/nhi/quan-ao-be-trai",
            },
            {
              name: "Quần áo bé gái",
              path: "/category/tre-em/nhi/quan-ao-be-gai",
            },
            { name: "Giày bé trai", path: "/category/tre-em/nhi/giay-be-trai" },
            { name: "Giày bé gái", path: "/category/tre-em/nhi/giay-be-gai" },
          ],
        },
        {
          title: "Trẻ nhỏ (1-4 tuổi)",
          items: [
            { name: "Quần áo", path: "/category/tre-em/nho/quan-ao" },
            { name: "Giày", path: "/category/tre-em/nho/giay" },
          ],
        },
      ],
      featuredImage: {
        src: "https://assets.adidas.com/images/w_600,f_auto,q_auto/0e61f130f32d401bb990ae36011035a7_9366/GW9220_01_standard.jpg",
        alt: "Thời trang trẻ em",
        title: "BỘ SƯU TẬP DISNEY",
        description: "Phong cách năng động cho bé yêu",
        link: "/category/tre-em/disney",
      },
      quickLinks: [
        { name: "Tất cả sản phẩm trẻ em", path: "/category/tre-em" },
        { name: "Dành cho bé trai", path: "/category/tre-em/be-trai" },
        { name: "Dành cho bé gái", path: "/category/tre-em/be-gai" },
      ],
    },

    "the-thao": {
      title: "Thể thao",
      path: "/category/the-thao",
      groups: [
        {
          title: "Bóng đá",
          isHighlight: true,
          items: [
            {
              name: "Hàng mới về",
              path: "/category/the-thao/bong-da/hang-moi-ve",
            },
            { name: "Giày", path: "/category/the-thao/bong-da/giay" },
            { name: "Quần áo", path: "/category/the-thao/bong-da/quan-ao" },
            { name: "Phụ kiện", path: "/category/the-thao/bong-da/phu-kien" },
            { name: "Bóng", path: "/category/the-thao/bong-da/bong" },
          ],
        },
        {
          title: "Chạy",
          items: [
            { name: "Giày", path: "/category/the-thao/chay/giay" },
            { name: "Quần áo", path: "/category/the-thao/chay/quan-ao" },
            { name: "Phụ kiện", path: "/category/the-thao/chay/phu-kien" },
            { name: "Ultraboost", path: "/category/the-thao/chay/ultraboost" },
            { name: "4DFWD", path: "/category/the-thao/chay/4dfwd" },
          ],
        },
        {
          title: "Bóng rổ",
          items: [
            { name: "Giày", path: "/category/the-thao/bong-ro/giay" },
            { name: "Quần áo", path: "/category/the-thao/bong-ro/quan-ao" },
            { name: "Phụ kiện", path: "/category/the-thao/bong-ro/phu-kien" },
          ],
        },
        {
          title: "Các môn thể thao khác",
          items: [
            { name: "Tập luyện", path: "/category/the-thao/tap-luyen" },
            { name: "Motorsport", path: "/category/the-thao/motorsport" },
            { name: "Ngoài trời", path: "/category/the-thao/ngoai-troi" },
            { name: "Tennis", path: "/category/the-thao/tennis" },
            { name: "Yoga", path: "/category/the-thao/yoga" },
            { name: "Golf", path: "/category/the-thao/golf" },
          ],
        },
      ],
      featuredImage: {
        src: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/viVN/Images/football-ss22-predator-educate-nav-dropdown-d_tcm337-891247.jpg",
        alt: "Trang thiết bị thể thao",
        title: "TRANG BỊ CHUYÊN NGHIỆP",
        description: "Nâng cao hiệu suất với trang bị chất lượng cao",
        link: "/category/the-thao/chuyen-nghiep",
      },
      quickLinks: [
        { name: "Tất cả trang thiết bị thể thao", path: "/category/the-thao" },
        { name: "Bóng đá", path: "/category/the-thao/bong-da" },
        { name: "Chạy bộ", path: "/category/the-thao/chay" },
      ],
    },

    "nhan-hieu": {
      title: "Các nhãn hiệu",
      path: "/category/nhan-hieu",
      groups: [
        {
          title: "Originals",
          isHighlight: true,
          items: [
            {
              name: "Hàng mới về",
              path: "/category/nhan-hieu/originals/hang-moi-ve",
            },
            { name: "Giày", path: "/category/nhan-hieu/originals/giay" },
            { name: "Quần áo", path: "/category/nhan-hieu/originals/quan-ao" },
            {
              name: "Phụ kiện",
              path: "/category/nhan-hieu/originals/phu-kien",
            },
          ],
        },
        {
          title: "Sportswear",
          items: [
            { name: "Giày", path: "/category/nhan-hieu/sportswear/giay" },
            { name: "Quần áo", path: "/category/nhan-hieu/sportswear/quan-ao" },
            {
              name: "Hàng mới về",
              path: "/category/nhan-hieu/sportswear/hang-moi-ve",
            },
          ],
        },
        {
          title: "Terrex",
          items: [
            { name: "About Terrex", path: "/category/nhan-hieu/terrex/about" },
            { name: "Giày", path: "/category/nhan-hieu/terrex/giay" },
            { name: "Quần áo", path: "/category/nhan-hieu/terrex/quan-ao" },
            { name: "Phụ kiện", path: "/category/nhan-hieu/terrex/phu-kien" },
          ],
        },
        {
          title: "Sustainability",
          items: [
            {
              name: "Thực vật",
              path: "/category/nhan-hieu/sustainability/thuc-vat",
            },
            {
              name: "Thành phần tái chế",
              path: "/category/nhan-hieu/sustainability/tai-che",
            },
            {
              name: "Cotton hữu cơ",
              path: "/category/nhan-hieu/sustainability/cotton-huu-co",
            },
          ],
        },
      ],
      featuredImage: {
        src: "https://assets.adidas.com/images/w_600,f_auto,q_auto/ea89eb2ffe9840288c14aaea012a08fc_9366/FY6682_01_standard.jpg",
        alt: "Thương hiệu Originals",
        title: "BỘ SƯU TẬP ORIGINALS",
        description: "Di sản thể thao kết hợp phong cách đường phố",
        link: "/category/nhan-hieu/originals",
      },
      quickLinks: [
        { name: "Tất cả thương hiệu", path: "/category/nhan-hieu" },
        { name: "Originals", path: "/category/nhan-hieu/originals" },
        { name: "Sportswear", path: "/category/nhan-hieu/sportswear" },
      ],
    },

    outlet: {
      title: "Outlet",
      path: "/category/outlet",
      groups: [
        {
          title: "Các nhãn hiệu",
          isHighlight: true,
          items: [
            {
              name: "Originals",
              path: "/category/outlet/originals",
              isSale: true,
            },
            { name: "Chạy", path: "/category/outlet/chay", isSale: true },
            { name: "Bóng đá", path: "/category/outlet/bong-da", isSale: true },
            {
              name: "Đánh gôn",
              path: "/category/outlet/danh-gon",
              isSale: true,
            },
          ],
        },
        {
          title: "Nam",
          items: [
            { name: "Giày", path: "/category/outlet/nam/giay" },
            { name: "Quần áo", path: "/category/outlet/nam/quan-ao" },
            { name: "Áo phông & áo polo", path: "/category/outlet/nam/ao" },
            { name: "Quần short", path: "/category/outlet/nam/quan-short" },
            { name: "Phụ kiện", path: "/category/outlet/nam/phu-kien" },
          ],
        },
        {
          title: "Nữ",
          items: [
            { name: "Giày", path: "/category/outlet/nu/giay" },
            { name: "Dép", path: "/category/outlet/nu/dep" },
            { name: "Quần áo", path: "/category/outlet/nu/quan-ao" },
            { name: "Áo phông & áo không tay", path: "/category/outlet/nu/ao" },
            { name: "Phụ kiện", path: "/category/outlet/nu/phu-kien" },
            { name: "Áo ngực thể thao", path: "/category/outlet/nu/ao-nguc" },
          ],
        },
        {
          title: "Trẻ em",
          items: [
            { name: "Giày", path: "/category/outlet/tre-em/giay" },
            { name: "Quần áo", path: "/category/outlet/tre-em/quan-ao" },
            { name: "Phụ kiện", path: "/category/outlet/tre-em/phu-kien" },
          ],
        },
      ],
      featuredImage: {
        src: "https://assets.adidas.com/images/w_600,f_auto,q_auto/85c3fbd63a7a4649b07bac210127f278_9366/GV7612_01_standard.jpg",
        alt: "Khuyến mãi đặc biệt",
        title: "GIẢM GIÁ SỐC",
        description: "Ưu đãi lên đến 70% cho các sản phẩm chọn lọc",
        link: "/category/outlet/khuyen-mai-soc",
      },
      quickLinks: [
        { name: "Tất cả khuyến mãi", path: "/category/outlet" },
        { name: "Nam", path: "/category/outlet/nam" },
        { name: "Nữ", path: "/category/outlet/nu" },
        { name: "Trẻ em", path: "/category/outlet/tre-em" },
      ],
    },
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Add a threshold to prevent flickering
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches
      setRecentSearches((prev) => {
        const updated = [searchQuery, ...prev.slice(0, 4)];
        return [...new Set(updated)]; // Remove duplicates
      });

      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Mock search results
    if (query) {
      setSearchResults([
        { id: 1, name: "Product 1", price: "$20" },
        { id: 2, name: "Product 2", price: "$30" },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenuOpen && mobileMenu && !mobileMenu.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };

  // Add backdrop variants
  const backdropVariants = {
    closed: {
      opacity: 0,
      visibility: "hidden",
      transition: { duration: 0.1 },
    },
    open: {
      opacity: 1,
      visibility: "visible",
      transition: { duration: 0.1 },
    },
  };

  const searchBarVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  // Thêm effect để xử lý scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [mobileMenuOpen]);

  // Update the renderMegaMenu function to apply special styling to highlighted items
  const renderMegaMenuItem = (item, index) => {
    let className = "";
    if (item.isNew) className = "new-item";
    if (item.isHot) className = "hot-item";
    if (item.isSale) className = "sale-item";

    return (
      <li key={index}>
        <Link to={item.path} className={className}>
          {item.name}
        </Link>
      </li>
    );
  };

  // Update the menu item class generator
  const getMenuItemClasses = (category) => {
    const classes = ["menu-item"];
    if (categoryDetails[category.id]) classes.push("has-mega-menu");
    if (category.isPrimary) classes.push("primary-item");
    if (category.isSpecial) classes.push("special-item");
    if (category.isCentered) classes.push("centered-item");
    if (category.bold) classes.push("bold-text"); // Add this line
    if (activeCategory === category.id) classes.push("active");
    return classes.join(" ");
  };

  // Add this useEffect to check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token"); // or however you store your auth token
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  // Modify the auth buttons section
  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return null; // Don't render anything if authenticated
    }

    return (
      <div className="auth-buttons">
        <Link to={ROUTES.AUTH.LOGIN} className="btn-login">
          Đăng nhập
        </Link>
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="btn-register"
          state={{ activeTab: "register" }} // Add state to set active tab
        >
          Đăng ký
        </Link>
      </div>
    );
  };

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("token"); // Clean up token storage
      setIsAuthenticated(false);
      navigate(ROUTES.AUTH.LOGIN);
      message.success("Đăng xuất thành công!");
    } catch (error) {
      message.error("Đăng xuất thất bại!");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add these new states near the top
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  // Add this function to handle menu closing
  const handleCloseMenu = () => {
    handleMobileMenuToggle(false); // Ensure menu state is updated when closing
  };

  // Update the menu backdrop click handler
  const handleBackdropClick = () => {
    handleCloseMenu();
  };

  // Add this helper function before the return statement
  const getMenuTitle = () => {
    if (activeGroup !== null) {
      return categoryDetails[activeSubmenu].groups[activeGroup].title;
    }
    if (activeSubmenu) {
      return categoryDetails[activeSubmenu].title;
    }
    return "Menu";
  };

  // Extract nested ternary into clear conditional blocks
  const renderMobileMenuItem = (category) => {
    if (categoryDetails[category.id]) {
      return (
        <button
          className={`menu-item ${category.isSpecial ? "special" : ""}`}
          onClick={() => setActiveSubmenu(category.id)}
        >
          {category.name}
          <FiChevronDown style={{ transform: "rotate(-90deg)" }} />
        </button>
      );
    }

    return (
      <Link
        to={category.path}
        className={`menu-item ${category.isSpecial ? "special" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        {category.name}
      </Link>
    );
  };

  const handleMobileMenuToggle = (isOpen) => {
    setMobileMenuOpen(isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "auto"; // Lock scroll when menu is open
    if (onMobileMenuToggle) {
      onMobileMenuToggle(isOpen); // Notify parent component
    }
  };

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state
      setIsScrolled(currentScrollY > 10);

      // Determine scroll direction and update visibility
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else {
        // Scrolling up - show header
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""} ${
        isVisible ? "visible" : ""
      } ${mobileMenuOpen ? "menu-open" : ""}`}
    >
      {/* Top Bar */}
      <div className="top-bar">
        <div className="contact-info">
          <span>
            <FiPhone /> <a href="tel:+84123456789">+84 123 456 789</a>
          </span>
          <span>
            <FiMail />{" "}
            <a href="mailto:info@shopethethao.com">info@shopethethao.com</a>
          </span>
        </div>

        <div className="brand-desc-wrapper">
          <AnimatePresence mode="wait">
            <motion.p
              key={rotatingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="brand-desc"
            >
              {rotatingText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Add empty div to maintain layout when auth buttons are hidden */}
        <div className="auth-buttons-wrapper">{renderAuthButtons()}</div>
      </div>

      {/* Main Navigation */}
      <div className="main-nav">
        <div className="container">
          <div
            className={`_header_top_svty4_0 ${
              isScrolled ? "header-top-hidden" : ""
            }`}
          >
            <div className="header-top-left">
              <span>Kết nối với chúng tôi:</span>

              <div className="social-links">
                <a
                  href="https://www.facebook.com/nhdinh03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaFacebook /> Facebook
                </a>
                <div className="divider"></div>
                <a
                  href="https://www.instagram.com/nhdinhdz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaInstagram /> Instagram
                </a>
              </div>
              <div className="divider"></div>
            </div>

            <ul className="_header_top_svty4_1">
              <li>
                <Link
                  to={ROUTES.USER.WISHLIST}
                  className="header-link"
                  data-tracking="header-wishlist"
                >
                  {/* <FiHeart className="icon" /> */}
                  <span style={{ fontSize: 11 }}>Danh sách yêu thích</span>
                </Link>
              </li>
              <li className="dropdown-wrapper">
                <button
                  type="button"
                  className="header-link has-dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {/* <FiMapPin className="icon" /> */}
                  <span style={{ fontSize: 11 }}>Theo dõi đơn hàng</span>
                </button>

                <div className="top-dropdown" role="menu">
                  <Link
                    to={ROUTES.USER.ORDERS}
                    className="dropdown-item"
                    role="menuitem"
                  >
                    {/* <FiTruck className="icon" /> */}
                    <span style={{ fontSize: 11 }}>Tra cứu đơn hàng</span>
                  </Link>

                  <Link
                    to={ROUTES.USER.ORDERHISTORY}
                    className="dropdown-item"
                    role="menuitem"
                  >
                    {/* <FiClock className="icon" /> */}
                    <span style={{ fontSize: 11 }}>Lịch sử đơn hàng</span>
                  </Link>
                </div>
              </li>
              <li className="_language_selector_svty4_40">
                <button
                  className="has-dropdown"
                  aria-label="Chọn ngôn ngữ"
                  title="Chọn ngôn ngữ"
                >
                  <img
                    src="https://adl-foundation.adidas.com/flags/1-2-1/vn.svg"
                    alt="Việt Nam"
                    className="gl-flag"
                  />
                  <span>Tiếng Việt</span>
                </button>
                <div className="top-dropdown">
                  <Link className="dropdown-item">
                    {/* <img src="/flags/en.svg" alt="English" /> */}
                    English
                  </Link>
                  <Link className="dropdown-item">
                    {/* <img src="/flags/vn.svg" alt="Tiếng Việt" /> */}
                    Tiếng Việt
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="nav-wrapper">
            {/* Move mobile menu toggle here */}
            <button
              className="mobile-menu-toggle"
              onClick={() => handleMobileMenuToggle(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <FiMenu />
            </button>

            {/* Logo */}
            <Link to="/" className="logo">
              <h1 style={{ fontSize: "3.5rem" }}>
                Shope<span>Nhdinh</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <ul>
                {mainCategories.map((category) => (
                  <li
                    key={category.id}
                    className={getMenuItemClasses(category)}
                    onMouseEnter={() => setActiveCategory(category.id)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <Link
                      to={category.path}
                      className={
                        activeCategory === category.id ? "active-menu-item" : ""
                      }
                    >
                      {category.name}
                    </Link>

                    {categoryDetails[category.id] && (
                      <div className="mega-menu-wrapper">
                        <div
                          className={`mega-menu ${
                            activeCategory === category.id ? "active" : ""
                          } ${isScrolled ? "scrolled" : ""}`}
                        >
                          <div className="mega-menu-inner">
                            <div className="mega-menu-categories">
                              {categoryDetails[category.id].groups.map(
                                (group, groupIndex) => (
                                  <div
                                    key={groupIndex}
                                    className="category-column"
                                  >
                                    <h4
                                      className={
                                        group.isHighlight ? "highlight" : ""
                                      }
                                    >
                                      {group.title}
                                    </h4>
                                    <ul>
                                      {group.items.map((item, itemIndex) =>
                                        renderMegaMenuItem(item, itemIndex)
                                      )}
                                    </ul>
                                  </div>
                                )
                              )}

                              <div className="featured-column">
                                <div className="featured-image">
                                  <img
                                    src={
                                      categoryDetails[category.id].featuredImage
                                        .src
                                    }
                                    alt={
                                      categoryDetails[category.id].featuredImage
                                        .alt
                                    }
                                  />
                                  <div className="featured-content">
                                    <h3>
                                      {
                                        categoryDetails[category.id]
                                          .featuredImage.title
                                      }
                                    </h3>
                                    <p>
                                      {
                                        categoryDetails[category.id]
                                          .featuredImage.description
                                      }
                                    </p>
                                    <Link
                                      to={
                                        categoryDetails[category.id]
                                          .featuredImage.link
                                      }
                                      className="btn-featured"
                                    >
                                      Khám phá ngay
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="quick-links">
                              {categoryDetails[category.id].quickLinks.map(
                                (link, linkIndex) => (
                                  <Link
                                    key={linkIndex}
                                    to={link.path}
                                    className="quick-link"
                                  >
                                    {link.name}
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Actions - Remove mobile-menu-toggle from here */}
            <div className="user-actions">
              <button
                className={`action-icon search-icon ${
                  searchOpen ? "is-active" : ""
                }`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label={searchOpen ? "Close search" : "Search"}
              >
                {searchOpen ? <FiX /> : <FiSearch />}
              </button>
              <Link
                to={ROUTES.USER.WISHLIST}
                className="action-icon wishlist-icon"
              >
                <AiOutlineHeart />
                {wishlistCount > 0 && (
                  <span className="count-badge">{wishlistCount}</span>
                )}
              </Link>

              <Link to={ROUTES.USER.CART} className="action-icon cart-icon">
                <FiShoppingBag />
                {cartCount > 0 && (
                  <span className="count-badge">{cartCount}</span>
                )}
              </Link>

              {/* Only render profile dropdown if authenticated */}
              {isAuthenticated && (
                <div
                  className="profile-dropdown-container"
                  ref={profileDropdownRef}
                >
                  <button
                    className="action-icon profile-icon"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setShowProfileDropdown(!showProfileDropdown);
                      }
                    }}
                    aria-expanded={showProfileDropdown}
                    aria-haspopup="true"
                    aria-label="User menu"
                    tabIndex={0}
                  >
                    <FiUser />
                  </button>

                  {showProfileDropdown && (
                    <div
                      className="profile-dropdown"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        to={ROUTES.USER.PROFILE}
                        className="dropdown-item"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <FiUser /> Tài khoản của tôi
                      </Link>
                      <Link
                        to={ROUTES.USER.ORDERS}
                        className="dropdown-item"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <FiPackage /> Đơn hàng
                      </Link>
                      <Link
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleLogout();
                          }
                        }}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <FiLogOut /> Đăng xuất
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-bar"
            variants={searchBarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <div className="container">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  autoFocus
                />
                <button type="submit" aria-label="Search">
                  <FiSearch />
                </button>
              </form>
              <div className="search-content">
                {searchQuery ? (
                  // Show search results
                  <div className="search-results">
                    {searchQuery && searchResults.length > 0 && (
                      <div className="search-suggestions">
                        <div className="suggestion-header">
                          <h4>Sản phẩm gợi ý</h4>
                          <button onClick={clearSearch}>Xóa</button>
                        </div>
                        <div className="suggested-products">
                          {searchResults.map((product) => (
                            <Link
                              to={`/product/${product.id}`}
                              key={product.id}
                              className="product-item"
                            >
                              <div className="product-info">
                                <h5>{product.name}</h5>
                                <span className="price">{product.price}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Show suggestions when no query
                  <div className="search-suggestions">
                    {recentSearches.length > 0 && (
                      <div className="recent-searches">
                        <h4>Tìm kiếm gần đây</h4>
                        <div className="search-tags">
                          {recentSearches.map((term, index) => (
                            <button
                              key={index}
                              onClick={() => setSearchQuery(term)}
                              className="search-tag"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="popular-searches">
                      <h4>Xu hướng tìm kiếm</h4>
                      <div className="search-tags">
                        {popularSearches.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(term)}
                            className="search-tag popular"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Completely Redesigned */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={handleBackdropClick}
            />
            <motion.div
              id="mobile-menu"
              className="mobile-menu"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Header Section */}
              <div className="mobile-menu-header">
                {activeSubmenu || activeGroup !== null ? (
                  <div className="nav-header">
                    <button
                      className="back-button"
                      onClick={() => {
                        if (activeGroup !== null) {
                          setActiveGroup(null);
                        } else {
                          setActiveSubmenu(null);
                        }
                      }}
                    >
                      <FiChevronDown style={{ transform: "rotate(90deg)" }} />
                    </button>
                    <h3>{getMenuTitle()}</h3>
                    <button className="close-button" onClick={handleCloseMenu}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="nav-header main">
                    <div className="brand-logo">
                      <h2>Shope<span>Nhdinh</span></h2>
                    </div>
                    <button className="close-button" onClick={handleCloseMenu}>
                      <FiX />
                    </button>
                  </div>
                )}
              </div>

              {/* User Profile Bar - Only shown on main menu */}
              {!activeSubmenu && !activeGroup && (
                <div className="user-profile-bar">
                  {isAuthenticated ? (
                    <div className="logged-user">
                      <div className="avatar">
                        <FiUser />
                      </div>
                      <div className="user-info">
                        <p className="welcome">Xin chào</p>
                        <p className="name">Tài khoản của tôi</p>
                      </div>
                      <Link 
                        to={ROUTES.USER.PROFILE} 
                        className="profile-action"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>Xem hồ sơ</span>
                        <FiChevronDown style={{ transform: "rotate(-90deg)" }} />
                      </Link>
                    </div>
                  ) : (
                    <div className="guest-user">
                      <FiUser className="icon" />
                      <div className="auth-actions">
                        <Link 
                          to={ROUTES.AUTH.LOGIN} 
                          className="login-btn"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Đăng nhập
                        </Link>
                        <span className="divider">/</span>
                        <Link 
                          to={ROUTES.AUTH.LOGIN} 
                          state={{ activeTab: "register" }}
                          onClick={() => setMobileMenuOpen(false)}
                          className="register-btn"
                        >
                          Đăng ký
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Section */}
              <div className="mobile-nav-wrapper">
                {activeGroup !== null ? (
                  // Group items view with improved styling
                  <motion.div 
                    className="menu-section"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="menu-item-list">
                      {categoryDetails[activeSubmenu].groups[activeGroup].items.map((item, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="menu-item"
                        >
                          <Link
                            to={item.path}
                            className="item-link"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="item-name">{item.name}</span>
                            {item.isNew && <span className="item-tag new">Mới</span>}
                            {item.isSale && <span className="item-tag sale">Sale</span>}
                            {item.isHot && <span className="item-tag hot">Hot</span>}
                            <FiChevronDown className="icon-right" style={{ transform: "rotate(-90deg)" }} />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : activeSubmenu ? (
                  // Category view with improved styling
                  <div className="menu-view">
                    <motion.div 
                      className="menu-section"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="section-title">Danh mục sản phẩm</h4>
                      <ul className="menu-item-list">
                        {categoryDetails[activeSubmenu].groups.map((group, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`menu-item ${group.isHighlight ? 'highlighted' : ''}`}
                          >
                            <button
                              className="item-button"
                              onClick={() => setActiveGroup(index)}
                            >
                              <span className="item-name">{group.title}</span>
                              <FiChevronDown className="icon-right" style={{ transform: "rotate(-90deg)" }} />
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                    
                    {/* Featured Content Section */}
                    {categoryDetails[activeSubmenu].featuredImage && (
                      <motion.div 
                        className="featured-section"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.25 }}
                      >
                        <h4 className="section-title">Nổi bật</h4>
                        <div className="featured-content">
                          <img 
                            src={categoryDetails[activeSubmenu].featuredImage.src} 
                            alt={categoryDetails[activeSubmenu].featuredImage.alt}
                            className="featured-image"
                          />
                          <div className="featured-overlay">
                            <h5>{categoryDetails[activeSubmenu].featuredImage.title}</h5>
                            <p>{categoryDetails[activeSubmenu].featuredImage.description}</p>
                            <Link 
                              to={categoryDetails[activeSubmenu].featuredImage.link}
                              className="featured-btn"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Khám phá ngay
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Quick Links Section */}
                    <motion.div 
                      className="quick-links-section"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="section-title">Truy cập nhanh</h4>
                      <div className="quick-links">
                        {categoryDetails[activeSubmenu].quickLinks.map((link, index) => (
                          <Link
                            key={index}
                            to={link.path}
                            className="quick-link"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  // Main Menu View with improved styling
                  <div className="menu-view">
                    {/* Main Categories Section */}
                    <div className="menu-section primary">
                      <ul className="menu-item-list">
                        {mainCategories.filter(cat => cat.isPrimary).map((category, index) => (
                          <motion.li 
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`menu-item ${category.isSpecial ? 'special' : ''}`}
                          >
                            {categoryDetails[category.id] ? (
                              <button
                                className="item-button"
                                onClick={() => setActiveSubmenu(category.id)}
                              >
                                <span className="item-name">{category.name}</span>
                                <FiChevronDown className="icon-right" style={{ transform: "rotate(-90deg)" }} />
                              </button>
                            ) : (
                              <Link
                                to={category.path}
                                className="item-link"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <span className="item-name">{category.name}</span>
                                <FiChevronDown className="icon-right" style={{ transform: "rotate(-90deg)" }} />
                              </Link>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Secondary Categories Section */}
                    <div className="menu-section secondary">
                      <h4 className="section-title">Danh mục sản phẩm</h4>
                      <ul className="menu-item-list">
                        {mainCategories.filter(cat => !cat.isPrimary && cat.id !== "outlet").map((category, index) => (
                          <motion.li 
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.05) }}
                            className="menu-item"
                          >
                            {categoryDetails[category.id] ? (
                              <button
                                className="item-button"
                                onClick={() => setActiveSubmenu(category.id)}
                              >
                                <span className="item-name">{category.name}</span>
                                <FiChevronDown className="icon-right" style={{ transform: "rotate(-90deg)" }} />
                              </button>
                            ) : (
                              <Link
                                to={category.path}
                                className="item-link"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <span className="item-name">{category.name}</span>
                                <FiChevronDown className="icon-right" style={{ transform: "rotate(-90deg)" }} />
                              </Link>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Outlet Category Section */}
                    {mainCategories.find(cat => cat.id === "outlet") && (
                      <motion.div 
                        className="outlet-section"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="outlet-card">
                          <h4>OUTLET - Giảm giá đặc biệt</h4>
                          <p>Săn sale lên đến 70% cho hàng ngàn sản phẩm</p>
                          <button
                            className="outlet-button"
                            onClick={() => setActiveSubmenu("outlet")}
                          >
                            Khám phá ngay
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Quick Actions Section */}
                    <motion.div 
                      className="quick-actions-section"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <h4 className="section-title">Tiện ích</h4>
                      <div className="quick-actions">
                        <Link 
                          to={ROUTES.USER.ORDERS} 
                          className="action-tile"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiPackage className="action-icon" />
                          <span className="action-name">Đơn hàng</span>
                        </Link>
                        <Link 
                          to={ROUTES.USER.WISHLIST} 
                          className="action-tile"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <AiOutlineHeart className="action-icon" />
                          <span className="action-name">Yêu thích</span>
                          {wishlistCount > 0 && <span className="count-badge">{wishlistCount}</span>}
                        </Link>
                        <Link 
                          to={ROUTES.USER.CART} 
                          className="action-tile"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiShoppingBag className="action-icon" />
                          <span className="action-name">Giỏ hàng</span>
                          {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
                        </Link>
                        {isAuthenticated && (
                          <button 
                            className="action-tile"
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <FiLogOut className="action-icon" />
                            <span className="action-name">Đăng xuất</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mobile-menu-footer">
                <div className="social-links">
                  <a
                    href="https://facebook.com/nhdinh03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <FaFacebook /> Facebook
                  </a>
                  <a
                    href="https://instagram.com/nhdinhdz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <FaInstagram /> Instagram
                  </a>
                </div>
                <div className="contact-info">
                  <a href="tel:+84123456789" className="contact-link">
                    <FiPhone /> +84 123 456 789
                  </a>
                  <a href="mailto:info@shopethethao.com" className="contact-link">
                    <FiMail /> info@shopethethao.com
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
