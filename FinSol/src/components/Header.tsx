import React from 'react';
import { Layout, Button, Dropdown, Avatar, Typography, Tooltip } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  UserOutlined, 
  BellOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import UserProfileMenu from './UserProfile';
import { getUser } from '../helpers/tokenService';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onCollapse }) => {
  const user = getUser();
  
  return (
    <Header 
      className="enterprise-header"
      style={{ 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{
            fontSize: '18px',
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease-in-out'
          }}
          className="menu-toggle-btn"
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography.Text 
            strong 
            style={{ 
              color: 'var(--text-primary)', 
              fontSize: '16px',
              marginBottom: '2px'
            }}
          >
            Financial Solutions
          </Typography.Text>
          <Typography.Text 
            style={{ 
              color: 'var(--text-muted)', 
              fontSize: '12px' 
            }}
          >
            Enterprise Management System
          </Typography.Text>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Tooltip title="Notifications">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              position: 'relative'
            }}
          />
        </Tooltip>

        <Tooltip title="Help & Support">
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)'
            }}
          />
        </Tooltip>

        <div style={{ width: '1px', height: '32px', background: 'var(--border-light)' }} />

        <Dropdown 
          overlay={<UserProfileMenu />} 
          trigger={['click']}
          placement="bottomRight"
        >
          <div 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s ease-in-out',
              background: 'transparent'
            }}
            className="user-profile-trigger"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--background-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                marginRight: '8px'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography.Text 
                strong 
                style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '14px',
                  lineHeight: '1.2'
                }}
              >
                {user?.email?.split('@')[0] || 'User'}
              </Typography.Text>
              <Typography.Text 
                style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '12px',
                  lineHeight: '1.2'
                }}
              >
                Administrator
              </Typography.Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
