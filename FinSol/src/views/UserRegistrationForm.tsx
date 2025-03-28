import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Col, Row, Card, Select } from 'antd';
import { UserRegistrationFormProps, UserRegistrationFormValues } from '../types/systemUsersTypes';
import { getAllSystemRoles } from '../services/applicationRolesService';
import { SystemRoles } from '../types/systemRolesTypes';

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
  const [error, ] = useState<string | null>(null);

  const onFinish = (values: UserRegistrationFormValues) => {
    onSubmit(values);
  };

  useEffect(() => {
    setLoading(true);
    const fetchRoles = async () => {
      const response = await getAllSystemRoles();
      setRoles(response.data);
    }
    fetchRoles();
    setLoading(false);
  }, []);

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
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="otherName"
              label="Other Name"
              rules={[{ required: true, message: 'Please input your other name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="roleName"
              label="Role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              {loading ? (
                <Select loading>
                  <Option value="">Loading roles...</Option>
                </Select>
              ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
              ) : (
                <Select>
                  {roles.map(role => (
                    <Option key={role.roleName} value={role.roleName}>
                      {role.roleName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default UserRegistrationForm;
