import React from 'react';
import { Button } from 'antd';

import classNames from 'classnames/bind';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

const App = ({ black = false, children, type, icon, onClick, className, ...passProps }) => {

    if (type === 'icon') {
        type = 'text';
    }

    const classes = cx('btn', {
        [className]: className,
        black,
        text: type === 'text' ,
    });

    return (
        <Button className={classes} icon={icon} type={type} onClick={onClick} {...passProps}>
            <span>{children}</span>
        </Button>
    );
};
export default App;
