import React from 'react';
import { Form, Input, Button, Col, Row, Card } from 'antd';
import { Rule } from 'antd/es/form';

interface ChangePasswordFormProps {
  onSubmit: (values: ChangePasswordFormValues) => void;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const validateConfirmPassword: Rule = {
    validator(_, value) {
      if (!value || form.getFieldValue('newPassword') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords that you entered do not match!'));
    },
  };

  const onFinish = (values: ChangePasswordFormValues) => {
    onSubmit(values);
  };

  return (
    <Row justify="center" style={{ marginTop: '20px' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card title="Change Password" bordered={false}>
          <Form
            {...layout}
            form={form}
            name="change-password"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters long!' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                validateConfirmPassword,
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePasswordForm;
