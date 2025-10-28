import React from 'react';
import { Card, Form, Input, Button, Switch, Typography, Row, Col, Divider, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const GeneralSettings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('General settings updated:', values);
  };

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <SettingOutlined style={{ marginRight: 8 }} />
                General Settings
              </Title>
              <Text type="secondary">
                Configure general system settings and preferences
              </Text>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                organizationName: 'FinSol Enterprise',
                currency: 'USD',
                timezone: 'UTC',
                dateFormat: 'YYYY-MM-DD',
                enableNotifications: true,
                enableAuditLog: true,
                sessionTimeout: 30
              }}
            >
              <Divider orientation="left">Organization Information</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="organizationName"
                    label="Organization Name"
                    rules={[{ required: true, message: 'Please enter organization name' }]}
                  >
                    <Input placeholder="Enter organization name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="currency"
                    label="Default Currency"
                    rules={[{ required: true, message: 'Please select currency' }]}
                  >
                    <Select placeholder="Select currency">
                      <Option value="USD">USD - US Dollar</Option>
                      <Option value="EUR">EUR - Euro</Option>
                      <Option value="GBP">GBP - British Pound</Option>
                      <Option value="KES">KES - Kenyan Shilling</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                    rules={[{ required: true, message: 'Please select timezone' }]}
                  >
                    <Select placeholder="Select timezone">
                      <Option value="UTC">UTC</Option>
                      <Option value="America/New_York">Eastern Time</Option>
                      <Option value="America/Chicago">Central Time</Option>
                      <Option value="America/Los_Angeles">Pacific Time</Option>
                      <Option value="Africa/Nairobi">East Africa Time</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateFormat"
                    label="Date Format"
                    rules={[{ required: true, message: 'Please select date format' }]}
                  >
                    <Select placeholder="Select date format">
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">System Configuration</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="sessionTimeout"
                    label="Session Timeout (minutes)"
                    rules={[{ required: true, message: 'Please enter session timeout' }]}
                  >
                    <Input type="number" min={5} max={480} placeholder="30" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxLoginAttempts"
                    label="Max Login Attempts"
                    rules={[{ required: true, message: 'Please enter max login attempts' }]}
                  >
                    <Input type="number" min={3} max={10} placeholder="5" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Feature Settings</Divider>

              <Form.Item
                name="enableNotifications"
                label="Enable Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableAuditLog"
                label="Enable Audit Logging"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableTwoFactor"
                label="Require Two-Factor Authentication"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableBackup"
                label="Enable Automatic Backups"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="enterprise-btn-primary"
                  size="large"
                >
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralSettings;