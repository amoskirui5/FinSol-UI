import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/userService';
import { AuthParams } from '../types/authTypes';

const { Title } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
        setLoading(true);
        try {
            const authParams: AuthParams = {
                email: values.username,
                password: values.password,
                remember: values.remember
            };
            const response = await userLogin(authParams);
            if (response) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f0f2f5',
        }}>
            <Card style={{ width: 400, padding: '20px' }}>
                <Title level={2} style={{ textAlign: 'center' }}>
                    Login
                </Title>
                <Form
                    name="login"
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked" >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
