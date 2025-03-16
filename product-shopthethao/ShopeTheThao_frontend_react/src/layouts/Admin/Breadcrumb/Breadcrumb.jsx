import React from "react";
import { Breadcrumb } from "antd";
import "./Breadcrumb.scss";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { breadcrumbData } from './breadcrumbConfig';
import PropTypes from 'prop-types';

const Bread = ({ path }) => {
    const matchingItem = breadcrumbData.find((item) => path.endsWith(item.url));
    
    const items = [
        {
            title: (
                <Link to="/dashboard-management-sys/portal" className="bread-link">
                    <HomeOutlined /> 
                    <span>Trang chủ</span>
                </Link>
            )
        }
    ];

    if (matchingItem) {
        items.push({ 
            title: (
                <span className="current-page">
                    {matchingItem.title}
                </span>
            ) 
        });
    }

    return (
        <div className="admin-breadcrumb">
            <Breadcrumb 
                items={items}
                separator={<RightOutlined />} 
            />
        </div>
    );
};

Bread.propTypes = {
    path: PropTypes.string.isRequired
};

export default Bread;
