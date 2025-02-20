import React from "react";
import { Breadcrumb } from "antd";
import "./Breadcrumb.scss";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { breadcrumbData } from './breadcrumbConfig';
import PropTypes from 'prop-types';

const Bread = ({ path }) => {
    const matchingItem = breadcrumbData.find((item) => path.endsWith(item.url));
    
    const items = [
        {
            title: (
                <Link to="/admin/index">
                    <HomeOutlined /> Trang chủ
                </Link>
            )
        }
    ];

    if (matchingItem) {
        items.push({ title: matchingItem.title });
    }

    return <Breadcrumb items={items} />;
};

Bread.propTypes = {
    path: PropTypes.string.isRequired
};

export default Bread;
