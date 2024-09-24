import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, message, Col, Row } from 'antd';
import { CreateMemberRegistrationRequestDTO } from '../../types/Member/MemberRegistrationRequestDTO';
import { useParams } from 'react-router-dom';
import { getMemberById, registerMember, updateMember } from '../../services/memberService';

interface MemberFormProps {
    isUpdate?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ isUpdate = false }) => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    // If this is an update, load the member data
    useEffect(() => {
        if (isUpdate && id) {
            const fetchMember = async () => {
                try {
                    const member = await getMemberById(id); // Fetch member data
                    form.setFieldsValue({
                        ...member,
                        dateOfBirth: member.dateOfBirth ,
                        dateJoined: member.dateJoined ,
                    });
                } catch (error) {
                    message.error('Failed to load member data');
                }
            };

            fetchMember();
        }
    }, [id, isUpdate, form]);


    const handleFinish = async (values: CreateMemberRegistrationRequestDTO) => {
        setLoading(true);
        try {
            if (isUpdate && id) {
                await updateMember(id, values);
            } else {
                await registerMember(values);
            }
            form.resetFields();
        } catch (error) {
            message.error('An error occurred');
            setLoading(false);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                        <Input placeholder="First Name" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="otherName"
                        label="Other Name"
                        rules={[{ required: true, message: 'Please enter your other name' }]}
                    >
                        <Input placeholder="Other Name" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="memberNumber"
                        label="Member Number"
                        rules={[{ required: true, message: 'Please enter your member number' }]}
                    >
                        <Input placeholder="Member Number" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                        <Input placeholder="Phone Number" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="bankAccount"
                        label="Bank Account"
                        rules={[{ required: true, message: 'Please enter your bank account' }]}
                    >
                        <Input placeholder="Bank Account" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="bankName"
                        label="Bank Name"
                        rules={[{ required: true, message: 'Please enter your bank name' }]}
                    >
                        <Input placeholder="Bank Name" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="workPlace"
                        label="Work Place"
                    >
                        <Input placeholder="Work Place" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="workType"
                        label="Work Type"
                    >
                        <Input placeholder="Work Type" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                    >
                        <DatePicker placeholder="Select Date of Birth" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="dateJoined"
                        label="Date Joined"
                        rules={[{ required: true, message: 'Please select the date joined' }]}
                    >
                        <DatePicker placeholder="Select Date Joined" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="nationalID"
                        label="National ID"
                    >
                        <Input placeholder="National ID" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="passportNumber"
                        label="Passport Number"
                    >
                        <Input placeholder="Passport Number" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="taxPIN"
                        label="Tax PIN"
                    >
                        <Input placeholder="Tax PIN" />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isUpdate ? 'Update Member' : 'Register Member'}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default MemberForm;