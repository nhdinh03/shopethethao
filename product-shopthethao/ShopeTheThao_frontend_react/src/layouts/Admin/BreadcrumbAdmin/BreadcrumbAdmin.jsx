import React from "react";
import { Breadcrumb, Badge } from "antd";
import "./BreadcrumbAdmin.scss";
import { HomeOutlined, RightOutlined, CrownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { breadcrumbData } from "./breadcrumbConfig";
import PropTypes from "prop-types";
import { ADMIN_ROUTES}  from 'constants/routeConstants';

const Bread = ({ path }) => {
  const isHomePage = path === ADMIN_ROUTES.PORTAL;

  if (isHomePage) {
    return null; // Ẩn breadcrumb trên trang chủ
  }

  const matchingItem = breadcrumbData.find((item) => path.endsWith(item.url));

  const items = [
    {
      title: (
        <Link to={ADMIN_ROUTES.PORTAL} className="bread-link-Admin">
          <HomeOutlined />
          <span>Trang chủ</span>
        </Link>
      ),
    },
  ];

  if (matchingItem) {
    items.push({
      title: (
        <span className="current-page">
          {matchingItem.icon ? matchingItem.icon : null}
          {matchingItem.title}
          {matchingItem.premium && (
            <Badge style={{ backgroundColor: "#52c41a", marginLeft: "8px" }} />
          )}
        </span>
      ),
    });
  }

  return (
    <div className="admin-breadcrumb">
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-content">
          <Breadcrumb items={items} separator={<RightOutlined />} />
        </div>
      </div>
    </div>
  );
};

Bread.propTypes = {
  path: PropTypes.string.isRequired,
};

export default Bread;
