import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { CopyrightOutlined, HeartFilled } from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <Footer
            style={{
                textAlign: 'center',
                padding: '20px 50px',
                background: 'var(--surface-color)',
                borderTop: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
            }}
        >
            <Space split={<Divider type="vertical" />} wrap>
                <Space>
                    <CopyrightOutlined />
                    <Text style={{ color: 'var(--text-secondary)' }}>
                        {currentYear} FinSol Enterprise. All rights reserved.
                    </Text>
                </Space>
                
                <Text style={{ color: 'var(--text-secondary)' }}>
                    Version 2.1.0
                </Text>
                
                <Space>
                    <Text style={{ color: 'var(--text-secondary)' }}>
                        Made with
                    </Text>
                    <HeartFilled style={{ color: 'var(--error-color)' }} />
                    <Text style={{ color: 'var(--text-secondary)' }}>
                        for financial excellence
                    </Text>
                </Space>
            </Space>
            
            <div style={{ marginTop: '8px' }}>
                <Space split={<Divider type="vertical" />}>
                    <Link 
                        href="#" 
                        style={{ color: 'var(--text-muted)', fontSize: '12px' }}
                    >
                        Privacy Policy
                    </Link>
                    <Link 
                        href="#" 
                        style={{ color: 'var(--text-muted)', fontSize: '12px' }}
                    >
                        Terms of Service
                    </Link>
                    <Link 
                        href="#" 
                        style={{ color: 'var(--text-muted)', fontSize: '12px' }}
                    >
                        Support
                    </Link>
                    <Link 
                        href="#" 
                        style={{ color: 'var(--text-muted)', fontSize: '12px' }}
                    >
                        Documentation
                    </Link>
                </Space>
            </div>
        </Footer>
    );
};

export default AppFooter;
