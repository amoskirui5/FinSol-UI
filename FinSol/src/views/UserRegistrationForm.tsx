import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Button, Col, Row, Card, Select, message } from 'antd';
import { UserRegistrationFormProps, UserRegistrationFormValues } from '../types/System/systemUsersTypes';
import { getAllSystemRoles } from '../services/applicationRolesService';
import { SystemRoles } from '../types/System/systemRolesTypes';
import { debounce } from 'lodash';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<SystemRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'' | 'warning' | 'error' | 'validating'>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSystemRoles();
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to load roles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Debounced email validation
  const checkEmailAvailability = useCallback(
    debounce(async (_email: string) => {
      try {
        setEmailStatus('validating');
        // Add your API call to check email availability here
        // const response = await checkEmail(email);
        // Simulation of API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEmailStatus('');
      } catch (error) {
        setEmailStatus('error');
        form.setFields([
          {
            name: 'email',
            errors: ['Email is already in use'],
          },
        ]);
      }
    }, 300),
    [form]
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      checkEmailAvailability(email);
    }
  };

  const onFinish = async (values: UserRegistrationFormValues) => {
    setSubmitLoading(true);
    try {
      await onSubmit(values);
      message.success('User registered successfully');
      form.resetFields();
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: '20px' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card title="Register User" bordered={false}>
          <Form
            {...layout}
            form={form}
            name="user-registration"
            onFinish={onFinish}
            scrollToFirstError
            validateTrigger={['onBlur', 'onSubmit']}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: 'Please input your first name!' },
                { min: 2, message: 'First name must be at least 2 characters' },
                { pattern: /^[a-zA-Z\s-]+$/, message: 'Only letters, spaces, and hyphens allowed' },
              ]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              name="otherName"
              label="Other Name"
              rules={[
                { required: true, message: 'Please input your other name!' },
                { min: 2, message: 'Other name must be at least 2 characters' },
                { pattern: /^[a-zA-Z\s-]+$/, message: 'Only letters, spaces, and hyphens allowed' },
              ]}
            >
              <Input placeholder="Enter other name" />
            </Form.Item>

            <Form.Item
              name="roleName"
              label="Role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select
                placeholder="Select a role"
                loading={loading}
                disabled={loading}
                showSearch
                optionFilterProp="children"
              >
                {roles.map(role => (
                  <Option key={role.roleName} value={role.roleName}>
                    {role.roleName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'Please enter a valid email!' },
                { required: true, message: 'Please input your email!' },
              ]}
              validateStatus={emailStatus}
            >
              <Input
                placeholder="Enter email"
                onChange={handleEmailChange}
                disabled={submitLoading}
              />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                disabled={loading || emailStatus === 'error'}
              >
                Register
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => form.resetFields()}
                disabled={submitLoading || loading}
              >
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default UserRegistrationForm;