import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { editAccountClass, getAccountClassById, registerAccountClass } from '../services/chartOfAccountsService';
import { AccountClass, RegisterAccountClassDTO } from '../types/Accounting/accountingTypes';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const AccountClassRegistration: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [accountClasses, setAccountClasses] = useState<AccountClass | null>(null);

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const isValidUUID = (id: string | undefined): id is `${string}-${string}-${string}-${string}-${string}` => {
        return !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    };

    const fetchAccountClassById = async (id: string) => {
        const results = await getAccountClassById(id);
        if (results) {
            setAccountClasses(results.data);
        }
    };

    useEffect(() => {
        // Only fetch if id exists and is valid (edit mode)
        if (id && isValidUUID(id)) {
            fetchAccountClassById(id);
        } else if (id && !isValidUUID(id)) {
            message.error("Invalid ID format");
            navigate('/account-class'); // Redirect if ID is malformed
        }
        // If no id, do nothing (create mode)
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
        setLoading(true); // Set loading true at the start
        try {
            const registerAccountClassDTO: RegisterAccountClassDTO = {
                className: values.ClassName,
                description: values.Description,
            };

            let response;
            if (id && isValidUUID(id)) {
                response = await editAccountClass(id, registerAccountClassDTO);
            } else {
                response = await registerAccountClass(registerAccountClassDTO);
            }

            if (response.success) {
                navigate('/account-class');
            }
        } catch (error) {
            message.error("An error occurred while saving the account class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Title level={2}>{id && isValidUUID(id) ? "Edit Account Class" : "Register New Account Class"}</Title>
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
                    rules={[{ required: true, message: "Please input the class name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Description"
                    label="Description"
                    rules={[{ required: true, message: "Please input the description!" }]}
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
