import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { registerAccountClass } from '../services/accountingService';
import { RegisterAccountClassDTO } from '../types/accountingTypes';

const { Title } = Typography;

const AccountClassRegistration: React.FC = () => {
    const onFinish = async (values: any) => {
        const registerAccountClassDTO: RegisterAccountClassDTO = {
            className: values.ClassName,
            description: values.Description
        };

        await registerAccountClass(registerAccountClassDTO);
    };

    return (
        <div>
            <Title level={2}>Register New Account Class</Title>
            <Form
                name="register"
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    name="ClassName"
                    label="Class Name"
                    rules={[{ required: true, message: 'Please input the class name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AccountClassRegistration;
