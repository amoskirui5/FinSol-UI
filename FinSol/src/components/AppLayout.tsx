import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppFooter from './Footer';
import Sidebar from './Sidebar';
import AppHeader from './Header';

const { Content } = Layout;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    
    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--background-primary)' }}>
            <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
            <Layout>
                <AppHeader collapsed={collapsed} onCollapse={handleCollapse} />
                <Content
                    className="enterprise-content fade-in"
                    style={{
                        margin: '24px',
                        padding: '32px',
                        background: 'var(--background-primary)',
                        borderRadius: 'var(--radius-lg)',
                        minHeight: 'calc(100vh - 160px)',
                        overflow: 'auto'
                    }}
                >
                    <div className="slide-in-right">
                        <Outlet />
                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default AppLayout;
