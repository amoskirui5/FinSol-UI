import React from 'react';
import { Form, Input, Button, Select, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface FormValues {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    bankAccount: string;
    bankName: string;
    workplace: string;
    worktype: string;
}

const MemberRegistrationForm: React.FC = () => {
    const [form] = Form.useForm<FormValues>();
    const navigate = useNavigate();

    const bankNames = ['Bank A', 'Bank B', 'Bank C'];
    const workTypes = ['Full-time', 'Part-time', 'Contract'];
    const workplaces = ['Office A', 'Office B', 'Remote'];

    const onFinish = (values: FormValues) => {
        console.log('Received values:', values);
        // Handle form submission logic here
    };

    const handleBack = () => {
        navigate('/member-list');
    };

    return (
        <Card title="Member Registration" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Form<FormValues>
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ bankName: bankNames[0], worktype: workTypes[0], workplace: workplaces[0] }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input the member\'s name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please input the member\'s phone number!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="bankAccount"
                            label="Bank Account"
                            rules={[{ required: true, message: 'Please input the bank account number!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="bankName"
                            label="Bank Name"
                            rules={[{ required: true, message: 'Please select the bank name!' }]}
                        >
                            <Select>
                                {bankNames.map((bank) => (
                                    <Option key={bank} value={bank}>
                                        {bank}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="workplace"
                            label="Workplace"
                            rules={[{ required: true, message: 'Please select the workplace!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="worktype"
                            label="Work Type"
                            rules={[{ required: true, message: 'Please select the work type!' }]}
                        >
                            <Input />

                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                        Submit
                    </Button>
                    <Button type="default" onClick={handleBack}>
                        Back
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default MemberRegistrationForm;
