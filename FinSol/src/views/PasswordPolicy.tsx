import React from 'react';
import { Card, Typography, Form, Button, Row, Col, Divider, InputNumber, Switch } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PasswordPolicy: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // debug during development
    console.debug('Password policy updated:', values);
  };

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <LockOutlined style={{ marginRight: 8 }} />
                Password Policy
              </Title>
              <Text type="secondary">
                Configure password requirements and security policies
              </Text>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                minLength: 8,
                maxLength: 128,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true,
                passwordExpiry: 90,
                preventReuse: 5,
                maxLoginAttempts: 5,
                lockoutDuration: 30,
                enforceComplexity: true
              }}
            >
              <Divider orientation="left">Password Requirements</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="minLength"
                    label="Minimum Length"
                    rules={[{ required: true, message: 'Please enter minimum length' }]}
                  >
                    <InputNumber min={4} max={50} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxLength"
                    label="Maximum Length"
                    rules={[{ required: true, message: 'Please enter maximum length' }]}
                  >
                    <InputNumber min={8} max={256} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="requireUppercase"
                    label="Require Uppercase Letters"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="requireLowercase"
                    label="Require Lowercase Letters"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="requireNumbers"
                    label="Require Numbers"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="requireSpecialChars"
                    label="Require Special Characters"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Expiry & Reuse</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="passwordExpiry"
                    label="Password Expiry (days)"
                    rules={[{ required: true, message: 'Please enter password expiry' }]}
                  >
                    <InputNumber min={0} max={365} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="preventReuse"
                    label="Prevent Reuse (last N passwords)"
                    rules={[{ required: true, message: 'Please enter prevent reuse count' }]}
                  >
                    <InputNumber min={0} max={24} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Account Lockout</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="maxLoginAttempts"
                    label="Max Failed Login Attempts"
                    rules={[{ required: true, message: 'Please enter max login attempts' }]}
                  >
                    <InputNumber min={3} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lockoutDuration"
                    label="Lockout Duration (minutes)"
                    rules={[{ required: true, message: 'Please enter lockout duration' }]}
                  >
                    <InputNumber min={5} max={1440} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Additional Settings</Divider>

              <Form.Item
                name="enforceComplexity"
                label="Enforce Password Complexity"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="preventCommonPasswords"
                label="Prevent Common Passwords"
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
                  Save Password Policy
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordPolicy;