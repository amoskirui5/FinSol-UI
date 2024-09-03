import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  MoneyCollectOutlined,
  UsergroupAddOutlined,
  OrderedListOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  WalletOutlined,
  FileAddOutlined,
  AuditOutlined,
  StockOutlined,
  ApartmentOutlined,
  TeamOutlined,
  IdcardOutlined,
  FileSearchOutlined,
  MailOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  LockOutlined,
  MobileOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content, Footer } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      style={{
        borderRight: '1px solid lightgray',
        overflow: 'hidden', 
        
        position: 'sticky',
        top: '0px',
        backgroundColor: 'white',
        minWidth: '550px', 
      }}
      width={collapsed ? 80 : 'auto'}

      >
        <div className="demo-logo-vertical" />
        <Menu
          style={{
            backgroundColor: 'white',
            fontWeight: 700,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Members',
              children: [
                {
                  key: '1-1',
                  icon: <OrderedListOutlined />,
                  label: 'Member List',
                },
                {
                  key: '1-2',
                  icon: <UsergroupAddOutlined />,
                  label: 'Next Of Kin',
                },
                {
                  key: '1-3',
                  icon: <UserAddOutlined />,
                  label: 'Member Registration',
                },
              ],
            },
            {
              key: '2',
              icon: <MoneyCollectOutlined />,
              label: 'Loans',
              children: [
                {
                  key: '2-1',
                  icon: <FileAddOutlined />,
                  label: 'Loan Applications',
                },
                {
                  key: '2-2',
                  icon: <CheckCircleOutlined />,
                  label: 'Loan Approvals',
                },
                {
                  key: '2-3',
                  icon: <WalletOutlined />,
                  label: 'Loan Disbursements',
                }
              ]
            },
            {
              key: '3',
              icon: <AuditOutlined />,
              label: 'Member Funds',
              children: [
                {
                  key: '3-1',
                  icon: <WalletOutlined />,
                  label: 'Member Deposits'
                },
                {
                  key: '3-2',
                  icon: <StockOutlined />,
                  label: 'Member Share Capital'
                }

              ]
            },

            {
              key: '4',
              icon: <SettingOutlined />,
              label: 'Settings',
              children:
                [
                  {
                    key: '4-1',
                    icon: <ApartmentOutlined />,
                    label: 'Administration'
                  },
                  {
                    key: '4-2',
                    icon: <TeamOutlined />,
                    label: 'User Management',
                    children: [
                      {
                        key: '4-2-1',
                        icon: <IdcardOutlined />,
                        label: 'User Roles',
                      },
                      {
                        key: '4-2-2',
                        icon: <UserOutlined />,
                        label: 'User Accounts',
                      },
                      {
                        key: '4-2-3',
                        icon: <FileSearchOutlined />,
                        label: 'Access Logs',
                      },
                    ],
                  },
                  {
                    key: '4-3',
                    icon: <SettingOutlined />,
                    label: 'System Settings',
                    children: [
                      {
                        key: '4-3-1',
                        icon: <SettingOutlined />,
                        label: 'General Settings',
                      },
                      {
                        key: '4-3-2',
                        icon: <MailOutlined />,
                        label: 'Email Settings',
                      },
                      {
                        key: '4-3-3',
                        icon: <DatabaseOutlined />,
                        label: 'Backup & Restore',
                      },
                    ],
                  },
                  {
                    key: '4-4',
                    icon: <SafetyOutlined />,
                    label: 'Security',
                    children: [
                      {
                        key: '4-4-1',
                        icon: <LockOutlined />,
                        label: 'Password Policy',
                      },
                      {
                        key: '4-4-2',
                        icon: <MobileOutlined />,
                        label: 'Two-Factor Authentication',
                      },
                      {
                        key: '4-4-3',
                        icon: <AuditOutlined />,
                        label: 'Audit Trail',
                      },
                    ],
                  }

                ]
            },
          ]}
          
          
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            padding: '10px 50px',
            background: colorBgContainer,
            borderTop: '1px solid #e8e8e8',
          }}
        >
          Footer Content
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
