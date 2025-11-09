import React from 'react';
import { Card, Typography, Button, Row, Col, Alert, Form, Switch, QRCode } from 'antd';
import { MobileOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TwoFactorAuth: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // non-critical debug information
    console.debug('2FA settings updated:', values);
  };

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <MobileOutlined style={{ marginRight: 8 }} />
                Two-Factor Authentication
              </Title>
              <Text type="secondary">
                Configure two-factor authentication settings for enhanced security
              </Text>
            </div>
            
            <Alert
              message="Enhanced Security"
              description="Two-factor authentication adds an extra layer of security by requiring a second form of verification."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card title="2FA Configuration" className="enterprise-card">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                      require2FA: false,
                      allowSMS: true,
                      allowApp: true,
                      allowEmail: true
                    }}
                  >
                    <Form.Item
                      name="require2FA"
                      label="Require 2FA for All Users"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="allowSMS"
                      label="Allow SMS Authentication"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="allowApp"
                      label="Allow Authenticator App"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="allowEmail"
                      label="Allow Email Authentication"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="enterprise-btn-primary"
                      >
                        Save Settings
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card title="Setup Instructions" className="enterprise-card">
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <SafetyOutlined style={{ fontSize: '64px', color: 'var(--primary-color)' }} />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>Authenticator App Setup</Title>
                    <Text>
                      1. Download an authenticator app (Google Authenticator, Authy, etc.)<br />
                      2. Scan the QR code below<br />
                      3. Enter the verification code to complete setup
                    </Text>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '16px', 
                      background: 'white', 
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)'
                    }}>
                      <QRCode value="otpauth://totp/FinSol:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=FinSol" size={120} />
                    </div>
                  </div>
                  
                  <Button type="primary" block className="enterprise-btn-primary">
                    Generate New QR Code
                  </Button>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TwoFactorAuth;