import React,{useState} from 'react';
import { Layout } from 'antd'; // Assuming you're using Ant Design
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
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
            <Layout>
            <AppHeader collapsed={collapsed} onCollapse={handleCollapse} />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: 'white',
                        borderRadius: '8px',
                    }}
                >
                    <Outlet />
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default AppLayout;
