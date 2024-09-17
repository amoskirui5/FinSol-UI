import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { editAccountClass, getAccountClassById, registerAccountClass } from '../services/chartOfAccountsService';
import { AccountClass, RegisterAccountClassDTO } from '../types/accountingTypes';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const AccountClassRegistration: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [accountClasses, setAccountClasses] = useState<AccountClass | null>(null);

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchAccountClassById = async () => {

        const results = await getAccountClassById(id);
        if (results) {

            setAccountClasses(results.data);
        }
    };

    useEffect(() => {
        fetchAccountClassById();
    }, [id]);

    useEffect(() => {
        if (accountClasses) {
            form.setFieldsValue({
                ClassName: accountClasses.name,
                Description: accountClasses.description,
            });
        }
    }, [accountClasses, form]);

    const handleBack = () => {
        navigate('/account-class');
    };

    const onFinish = async (values: any) => {
        try {

            const registerAccountClassDTO: RegisterAccountClassDTO = {
                className: values.ClassName,
                description: values.Description
            };

            if (id) {
                var response = await editAccountClass(id, registerAccountClassDTO);
                if (response.success) {
                    navigate('/account-class');
                }
            }
            else {
                var response =await registerAccountClass(registerAccountClassDTO);
                if (response.success) {
                    navigate('/account-class');
                }
            }

        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }

    };


    return (
        <div>
            <Title level={2}>Register New Account Class</Title>
            <Form
                form={form}
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
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        Submit
                    </Button>
                    <Button type="default" onClick={handleBack}>
                        Back
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AccountClassRegistration;
