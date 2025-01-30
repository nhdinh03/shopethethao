import React from 'react';
import { Modal } from 'antd';
import { modalSizes } from '../../../constants/modalSizes'; 
import style from './BaseModal.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(style);

const BaseModal = ({ size = 'medium', children, ...props }) => {
    const modalSize = Object.entries(modalSizes).find((sz) => sz[0] === size)?.[1];

    return (
        <Modal
            getContainer={false}
            forceRender
            maskClosable={false}
            width={modalSize}
            className={cx('modal')}
            {...props}
        >
            {children}
        </Modal>
    );
};

BaseModal.info = Modal.info;
BaseModal.success = Modal.success;
BaseModal.warning = Modal.warning;
BaseModal.error = Modal.error;

export default BaseModal;
