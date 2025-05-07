import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants/applicationNames';

const menuItems:MenuProps['items']=[
    {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'User Profile',
    },
    {
        key: 'changePassword',
        icon: <UserOutlined />,
        label: 'Change Password',
    },
    {
        key: 'updateDetails',
        icon: <UserOutlined />,
        label: 'Update Details',
    },
    {
        key: 'divider',
        type: 'divider',
    },
    {
        key: 'logout',
        icon: <UserOutlined />,
        label: 'Logout',
    },
];

const UserProfileMenu: React.FC = () => {
    const navigate = useNavigate();

    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'profile':
                navigate('/profile');
                break;
            case 'changePassword':
                navigate('/change-password');
                break;
            case 'updateDetails':
                navigate('/update-details');
                break;
            case 'logout':
                localStorage.removeItem(ACCESS_TOKEN);
                navigate('/login');
                break;
            default:
                break;
        }
    };

    return (
        <Menu items={menuItems} onClick={handleMenuClick} />
    );
};

export default UserProfileMenu;
