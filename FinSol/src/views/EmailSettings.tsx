import React from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Divider, InputNumber, Switch, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EmailSettings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Email settings updated:', values);
  };

  const testConnection = () => {
    console.log('Testing email connection...');
  };

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <MailOutlined style={{ marginRight: 8 }} />
                Email Settings
              </Title>
              <Text type="secondary">
                Configure email server settings for notifications
              </Text>
            </div>
            
            <Alert
              message="Email Configuration"
              description="Configure SMTP settings to enable email notifications for loan approvals, member communications, and system alerts."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                smtpServer: 'smtp.gmail.com',
                smtpPort: 587,
                enableSSL: true,
                enableTLS: true,
                enableEmailNotifications: true
              }}
            >
              <Divider orientation="left">SMTP Configuration</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="smtpServer"
                    label="SMTP Server"
                    rules={[{ required: true, message: 'Please enter SMTP server' }]}
                  >
                    <Input placeholder="smtp.example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smtpPort"
                    label="SMTP Port"
                    rules={[{ required: true, message: 'Please enter SMTP port' }]}
                  >
                    <InputNumber min={1} max={65535} placeholder="587" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label="Username/Email"
                    rules={[{ required: true, message: 'Please enter username' }]}
                  >
                    <Input placeholder="noreply@example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fromName"
                    label="From Name"
                    rules={[{ required: true, message: 'Please enter from name' }]}
                  >
                    <Input placeholder="FinSol Enterprise" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="fromEmail"
                    label="From Email"
                    rules={[{ required: true, message: 'Please enter from email' }]}
                  >
                    <Input placeholder="noreply@finsol.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Security Settings</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="enableSSL"
                    label="Enable SSL"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="enableTLS"
                    label="Enable TLS"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Notification Settings</Divider>

              <Form.Item
                name="enableEmailNotifications"
                label="Enable Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableLoanNotifications"
                label="Loan Status Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableMemberNotifications"
                label="Member Account Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Row gutter={16}>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="enterprise-btn-primary"
                    size="large"
                  >
                    Save Settings
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    onClick={testConnection}
                  >
                    Test Connection
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmailSettings;