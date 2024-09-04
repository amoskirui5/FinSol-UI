import React from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;

const AppFooter: React.FC = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
                padding: '10px 50px',
                background: 'white',
                borderTop: '1px solid #e8e8e8',
            }}
        >
            Footer Content
        </Footer>
    );
};

export default AppFooter;
