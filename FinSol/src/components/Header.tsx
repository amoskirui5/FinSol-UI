import React from 'react';
import { Layout, Button, Dropdown, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import UserProfileMenu from './UserProfile';
import { getUser } from '../helpers/tokenService';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onCollapse }) => {
  return (
    <Header style={{ padding: '0 16px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onCollapse}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <Dropdown overlay={<UserProfileMenu />} trigger={['click']}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} />
          <span style={{ marginLeft: 8 }}>{getUser()?.email}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
