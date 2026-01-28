import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
    success: {
        color: '#BCDA72',
        iconColor: '#BCDA72',
        progressColor: '#BCDA72',
        icon: '✅'
    },
    error: {
        color: '#9A0000',
        iconColor: '#9A0000',
        progressColor: '#9A0000',
        icon: '❌'
    },
    warning: {
        color: '#FFB300',
        iconColor: '#FFB300',
        progressColor: '#FFB300',
        icon: '⚠️'
    },
    info: {
        color: '#D3D3D3',
        iconColor: '#D3D3D3',
        progressColor: '#D3D3D3',
        icon: 'ℹ️'
    }
};

const CustomToast = ({ type = 'info', message }) => {
    const config = toastConfig[type] || toastConfig.info;

    toast[type](message, {
        icon: <div style={{ color: config.iconColor }}>{config.icon}</div>,
        style: {
            border: `1px solid ${config.color}`,
            color: 'grey',
        },
        progressStyle: {
            background: config.progressColor,
        }
    });
};

export const ToastProvider = () => (
    <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} />
);

export default CustomToast;
