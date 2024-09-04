import React from 'react';
import { Layout, Menu } from 'antd';
import {
    UserOutlined, MoneyCollectOutlined, AuditOutlined, SettingOutlined,
    OrderedListOutlined, UsergroupAddOutlined, UserAddOutlined, FileAddOutlined,
    CheckCircleOutlined, WalletOutlined, StockOutlined, ApartmentOutlined,
    TeamOutlined, IdcardOutlined, FileSearchOutlined, MailOutlined, DatabaseOutlined,
    SafetyOutlined, LockOutlined, MobileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;

const Sidebar: React.FC<{ collapsed: boolean; onCollapse: (collapsed: boolean) => void; }> = ({ collapsed, onCollapse }) => {

    const navigate = useNavigate();
    const handleMenuClick = (e: { key: string }) => {
        switch (e.key) {
            case '1-1':
                navigate('/member-list');
                break;
            case '1-2':
                navigate('/next-of-kin');
                break;
            case '1-3':
                navigate('/member-registration');
                break;
            case '2-1':
                navigate('/loan-applications');
                break;
            case '2-2':
                navigate('/loan-approvals');
                break;
            case '2-3':
                navigate('/loan-disbursements');
                break;
            case '3-1':
                navigate('/member-deposits');
                break;
            case '3-2':
                navigate('/member-share-capital');
                break;
            case '4-1':
                navigate('/administration');
                break;
            case '4-2-1':
                navigate('/user-roles');
                break;
            case '4-2-2':
                navigate('/user-accounts');
                break;
            case '4-2-3':
                navigate('/access-logs');
                break;
            case '4-3-1':
                navigate('/general-settings');
                break;
            case '4-3-2':
                navigate('/email-settings');
                break;
            case '4-3-3':
                navigate('/backup-restore');
                break;
            case '4-4-1':
                navigate('/password-policy');
                break;
            case '4-4-2':
                navigate('/two-factor-authentication');
                break;
            case '4-4-3':
                navigate('/audit-trail');
                break;
            default:
                break;
        }
    };
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
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
                onClick={handleMenuClick}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: 'Members',
                        children: [
                            { key: '1-1', icon: <OrderedListOutlined />, label: 'Member List' },
                            { key: '1-2', icon: <UsergroupAddOutlined />, label: 'Next Of Kin' },
                            { key: '1-3', icon: <UserAddOutlined />, label: 'Member Registration' },
                        ],
                    },
                    {
                        key: '2',
                        icon: <MoneyCollectOutlined />,
                        label: 'Loans',
                        children: [
                            { key: '2-1', icon: <FileAddOutlined />, label: 'Loan Applications' },
                            { key: '2-2', icon: <CheckCircleOutlined />, label: 'Loan Approvals' },
                            { key: '2-3', icon: <WalletOutlined />, label: 'Loan Disbursements' },
                        ],
                    },
                    {
                        key: '3',
                        icon: <AuditOutlined />,
                        label: 'Member Funds',
                        children: [
                            { key: '3-1', icon: <WalletOutlined />, label: 'Member Deposits' },
                            { key: '3-2', icon: <StockOutlined />, label: 'Member Share Capital' },
                        ],
                    },
                    {
                        key: '4',
                        icon: <SettingOutlined />,
                        label: 'Settings',
                        children: [
                            { key: '4-1', icon: <ApartmentOutlined />, label: 'Administration' },
                            {
                                key: '4-2',
                                icon: <TeamOutlined />,
                                label: 'User Management',
                                children: [
                                    { key: '4-2-1', icon: <IdcardOutlined />, label: 'User Roles' },
                                    { key: '4-2-2', icon: <UserOutlined />, label: 'User Accounts' },
                                    { key: '4-2-3', icon: <FileSearchOutlined />, label: 'Access Logs' },
                                ],
                            },
                            {
                                key: '4-3',
                                icon: <SettingOutlined />,
                                label: 'System Settings',
                                children: [
                                    { key: '4-3-1', icon: <SettingOutlined />, label: 'General Settings' },
                                    { key: '4-3-2', icon: <MailOutlined />, label: 'Email Settings' },
                                    { key: '4-3-3', icon: <DatabaseOutlined />, label: 'Backup & Restore' },
                                ],
                            },
                            {
                                key: '4-4',
                                icon: <SafetyOutlined />,
                                label: 'Security',
                                children: [
                                    { key: '4-4-1', icon: <LockOutlined />, label: 'Password Policy' },
                                    { key: '4-4-2', icon: <MobileOutlined />, label: 'Two-Factor Authentication' },
                                    { key: '4-4-3', icon: <AuditOutlined />, label: 'Audit Trail' },
                                ],
                            },
                        ],
                    },
                ]}
            />
        </Sider>
    );
};

export default Sidebar;
