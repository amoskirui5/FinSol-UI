import React from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AppHeader: React.FC<{ collapsed: boolean; onCollapse: () => void; }> = ({ collapsed, onCollapse }) => {
  return (
    <Header style={{ padding: 0, background: 'white' }}>
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
    </Header>
  );
};

export default AppHeader;
