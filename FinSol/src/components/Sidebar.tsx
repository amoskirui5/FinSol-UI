import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined, UserOutlined, MoneyCollectOutlined, AuditOutlined, SettingOutlined,
  OrderedListOutlined, UsergroupAddOutlined, UserAddOutlined, FileAddOutlined,
  CheckCircleOutlined, WalletOutlined, StockOutlined, ApartmentOutlined,
  TeamOutlined, IdcardOutlined, FileSearchOutlined, MailOutlined, DatabaseOutlined,
  SafetyOutlined, LockOutlined, MobileOutlined, FilePdfOutlined, FilePdfFilled,
  FileDoneOutlined, AccountBookOutlined, BookOutlined, CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC<{ collapsed: boolean; onCollapse: (collapsed: boolean) => void }> = ({
  collapsed,
  onCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes: Record<string, string> = {
    'dashboard': '/dashboard',

    // Organizations
    'organizations': '/organizations',

    // Members
    'member-list': '/members-list',
    'next-of-kin': '/next-of-kin',
    'member-registration': '/members/register',
    'member-statement': '/member-statement',

    // Loans
    'loan-applications': '/loan-applications',
    'loan-approvals': '/loan-approvals',
    'loan-disbursements': '/loan-disbursements',

    // Funds
    'member-deposits': '/member-deposits',
    'member-share-capital': '/member-share-capital',
    'member-receipt': '/member-receipt',
    'member-payments': '/member-payments',

    // Settings
    'administration': '/administration',
    'user-roles': '/user-roles',
    'user-accounts': '/user-accounts',
    'access-logs': '/access-logs',
    'general-settings': '/general-settings',
    'email-settings': '/email-settings',
    'backup-restore': '/backup-restore',
    'financial-year': '/financial-year',
    'password-policy': '/password-policy',
    'two-factor-auth': '/two-factor-authentication',
    'audit-trail': '/audit-trail',
    'account-class': '/account-class',
    'chart-of-accounts': '/chart-of-accounts',
    'member-account-settings': '/member-account-settings',
    'loan-settings': '/loan-types',

    // Finance
    'trial-balance': '/finance/trial-balance',
    'balance-sheet': '/finance/balance-sheet',
    'profit-loss': '/finance/profit-loss',
    'cash-book': '/finance/cash-book',
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const path = routes[key] || '/dashboard';
    navigate(path);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={280}
      className="enterprise-sidebar"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <div 
        className="logo-container"
        style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 'bold',
          fontSize: '20px',
          color: 'var(--primary-color)',
          borderBottom: '1px solid var(--border-light)',
          margin: '0 16px',
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {!collapsed ? 'FinSol Enterprise' : 'FS'}
      </div>
      <Menu
        mode="inline"
        theme="light"
        defaultSelectedKeys={['dashboard']}
        selectedKeys={[Object.entries(routes).find(([, path]) => location.pathname.startsWith(path))?.[0] || 'dashboard']}
        onClick={handleMenuClick}
        style={{ 
          fontWeight: 600, 
          height: 'calc(100vh - 64px)', 
          overflowY: 'auto',
          padding: '8px'
        }}
        items={[
          {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: 'organizations',
            icon: <ApartmentOutlined />,
            label: 'Organizations',
          },
          {
            key: 'members',
            icon: <UserOutlined />,
            label: 'Members',
            children: [
              { key: 'member-list', icon: <OrderedListOutlined />, label: 'Member List' },
              { key: 'next-of-kin', icon: <UsergroupAddOutlined />, label: 'Next Of Kin' },
              { key: 'member-registration', icon: <UserAddOutlined />, label: 'Member Registration' },
              {
                key: 'member-statement',
                icon: <FilePdfOutlined />,
                label: 'Member Statement',
                children: [
                  { key: 'member-statement', icon: <FilePdfFilled />, label: 'Loan & Deposit Statement' },
                ],
              },
            ],
          },
          {
            key: 'loans',
            icon: <MoneyCollectOutlined />,
            label: 'Loans',
            children: [
              { key: 'loan-applications', icon: <FileAddOutlined />, label: 'Loan Applications' },
              { key: 'loan-approvals', icon: <CheckCircleOutlined />, label: 'Loan Approvals' },
              { key: 'loan-disbursements', icon: <WalletOutlined />, label: 'Loan Disbursements' },
            ],
          },
          {
            key: 'member-funds',
            icon: <AuditOutlined />,
            label: 'Member Funds',
            children: [
              { key: 'member-deposits', icon: <WalletOutlined />, label: 'Member Deposits' },
              { key: 'member-share-capital', icon: <StockOutlined />, label: 'Member Share Capital' },
              { key: 'member-receipt', icon: <AccountBookOutlined />, label: 'Member Receipting' },
              { key: 'member-payments', icon: <AccountBookOutlined />, label: 'Member Payments' },
            ],
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            children: [
              { key: 'administration', icon: <ApartmentOutlined />, label: 'Administration' },
              {
                key: 'user-management',
                icon: <TeamOutlined />,
                label: 'User Management',
                children: [
                  { key: 'user-roles', icon: <IdcardOutlined />, label: 'User Roles' },
                  { key: 'user-accounts', icon: <UserOutlined />, label: 'User Accounts' },
                  { key: 'access-logs', icon: <FileSearchOutlined />, label: 'Access Logs' },
                ],
              },
              {
                key: 'system-settings',
                icon: <SettingOutlined />,
                label: 'System Settings',
                children: [
                  { key: 'general-settings', icon: <SettingOutlined />, label: 'General Settings' },
                  { key: 'email-settings', icon: <MailOutlined />, label: 'Email Settings' },
                  { key: 'backup-restore', icon: <DatabaseOutlined />, label: 'Backup & Restore' },
                  { key: 'financial-year', icon: <CalendarOutlined />, label: 'Financial Year' },
                ],
              },
              {
                key: 'security',
                icon: <SafetyOutlined />,
                label: 'Security',
                children: [
                  { key: 'password-policy', icon: <LockOutlined />, label: 'Password Policy' },
                  { key: 'two-factor-auth', icon: <MobileOutlined />, label: 'Two-Factor Authentication' },
                  { key: 'audit-trail', icon: <AuditOutlined />, label: 'Audit Trail' },
                ],
              },
              {
                key: 'accounts',
                icon: <AccountBookOutlined />,
                label: 'Accounts',
                children: [
                  { key: 'account-class', icon: <WalletOutlined />, label: 'Account Class' },
                  { key: 'chart-of-accounts', icon: <BookOutlined />, label: 'Chart of Accounts' },
                  { key: 'member-account-settings', icon: <BookOutlined />, label: 'Member Account Settings' },
                ],
              },
              {
                key: 'loan-settings',
                icon: <AccountBookOutlined />,
                label: 'Loan',
                children: [
                  { key: 'loan-settings', icon: <WalletOutlined />, label: 'Loan Settings' },
                ],
              },
            ],
          },
          {
            key: 'financial-statement',
            icon: <AccountBookOutlined />,
            label: 'Financial Statement',
            children: [
              { key: 'trial-balance', icon: <FileDoneOutlined />, label: 'Trial Balance' },
              { key: 'balance-sheet', icon: <FileDoneOutlined />, label: 'Balance Sheet' },
              { key: 'profit-loss', icon: <FileDoneOutlined />, label: 'Profit or Loss' },
              { key: 'cash-book', icon: <FileDoneOutlined />, label: 'Cash Book' },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
