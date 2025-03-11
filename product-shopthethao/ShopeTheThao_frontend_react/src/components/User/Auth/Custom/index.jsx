import React from 'react';
const { default: funcUtils } = require("utils/funcUtils");

const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]+/;
const numericRegex = /\d/;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const phoneRegex = /^(0[1-9][0-9]{8}|84[1-9][0-9]{7})$/;
const regexFullname = /^[A-ZĐÂÊÔƠƯ][a-zđâêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵ]+(\s[A-ZĐÂÊÔƠƯ][a-zđâêôơưàảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵ]+)*$/;
const repeatingCharsRegex = /(.)\1{2,}/;

export const validateId = (rule, value, callback) => {
    if (!value) {
        callback('Không được bỏ trống tài khoản!');
    } else if (value.length < 6) {
        callback('Tài khoản phải có ít nhất 6 ký tự!');
    } else if (value.length > 20) {
        callback('Tài khoản không được dài quá 20 ký tự!');
    } 
    else if (/[^a-zA-Z0-9]/.test(value)) {
        callback('Tài khoản không được chứa ký tự đặc biệt!');
    }
     else {
        callback();
    }

};

export const validatePassword = (rule, value, callback) => {
    if (!value) {
        callback('Không được bỏ trống mật khẩu!');
    } else if (value.length < 8) {
        callback('Mật khẩu phải dài hơn 8 ký tự!');
    } else if (value.length > 20) {
        callback('Mật khẩu không được dài quá 20 ký tự!');
    } else if (!numericRegex.test(value)) {
        callback('Mật khẩu phải chứa ít nhất một số!');
    } else if (!uppercaseRegex.test(value)) {
        callback('Mật khẩu phải chứa ít nhất một chữ in hoa!');
    } else if (!lowercaseRegex.test(value)) {
        callback('Mật khẩu phải chứa ít nhất một chữ thường!');
    } else if (specialCharRegex.test(value)) {
        callback('Mật khẩu không được chứa ký tự đặc biệt!');
    } else {
        callback(); 
    }
};


export const validateEmail = (rule, value, callback) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        callback('Không được bỏ trống email!');
    } else if (!emailRegex.test(value)) {
        callback('Email không hợp lệ!');
    } else {
        callback();
    }
};


export const validatePhone = (rule, value, callback) => {
    if (!value) {
        callback('Không được bỏ trống số điện thoại!');
    } else if (!numericRegex.test(value) || value.length !== 10) {
        callback('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại gồm 10 chữ số.');
    } else if (!phoneRegex.test(value)) {
        callback('Số điện thoại không hợp lệ! Vui lòng nhập đúng định dạng.');
    } else {
        callback();
    }
};
export const validateFullname = (rule, value, callback) => {
    if (!value) {
        callback('Không được bỏ trống tên!');
    } else if (repeatingCharsRegex.test(value)) {
        callback('Tên không hợp lệ. Không được nhập ký tự lặp lại nhiều lần liên tiếp.');
    } else if (specialCharRegex.test(value)) {
        callback('Tên không hợp lệ. Không được nhập ký tự đặc biệt.');
    } else if (!regexFullname.test(value)) {
        callback('Tên không hợp lệ. Vui lòng nhập In hoa tên đúng định dạng.');
    } else {
        const nameParts = value.trim().split(' ');
        if (nameParts.length < 1) {
            callback('Tên không hợp lệ. Vui lòng nhập đầy đủ họ và tên.');
        } else {
            callback(); 
        }
    }
};

export const validatEaddress = (rule, value, callback) => {
    if (!value) {
        callback('Không được bỏ trống địa chỉ!');
    } else if (specialCharRegex.test(value)) {
        callback('Địa chỉ không hợp lệ. Không được nhập ký tự đặc biệt.');
    } else {
        callback();
    }
};

