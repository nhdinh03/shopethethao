import React from 'react';
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import './BreadcrumbUser.scss';
import { breadcrumbDataUser } from './BreadcrumbUserConfig';

const BreadcrumbUser = ({ path = "" }) => {
  const currentPage = breadcrumbDataUser.find(item => item.url !== "/" && path?.includes(item.url));
  
  return (
    <div className="user-breadcrumb">
      <div className="breadcrumb-container">
        <Breadcrumb 
          items={[
            {
              title: (
                <Link to="/" >
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </Link>
              )
            },
            ...(currentPage ? [{
              title: <span>{currentPage.title}</span>
            }] : [])
          ]}
          separator={<RightOutlined />}
        />
      </div>
    </div>
  );
};

export default BreadcrumbUser;