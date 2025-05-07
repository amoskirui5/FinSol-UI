import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, message, Col, Row, Select, Tooltip, Card, Spin, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMemberById, registerMember, updateMember } from '../../services/memberService';


import dayjs, { Dayjs } from 'dayjs';
import { GenderOptions } from '../../enums/enums';
import { CreateMemberRegistrationRequestDTO, MemberFormProps } from '../../types/Member/memberTypes';
import { InfoCircleOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { Option } = Select;

const MemberForm: React.FC<MemberFormProps> = ({ isUpdate = false }) => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Disable future dates for dateJoined
    const disableFutureDates = (current: Dayjs) => {
        return current && current > dayjs().endOf('day');
    };

    // Disable dates for users younger than 18 years
    const disablePastDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().subtract(18, 'years'));
    };

    // UUID validation
    const isValidUUID = (id: string | undefined): id is `${string}-${string}-${string}-${string}-${string}` => {
        return !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    };

    // Fetch member data for update
    useEffect(() => {
        if (isUpdate && id) {
            const fetchMember = async () => {
                setLoading(true);
                try {
                    if (!isValidUUID(id)) {
                        message.error('Invalid or missing ID');
                        return;
                    }
                    const response = await fetchMemberById(id);
                    if (response.success) {
                        const member = response.data;
                        form.setFieldsValue({
                            ...member,
                            dateOfBirth: member?.dateOfBirth ? dayjs(member.dateOfBirth) : null,
                            dateJoined: member.dateJoined ? dayjs(member.dateJoined) : null,
                        });
                    } else {
                        message.error('Failed to load member data');
                    }
                } catch (error) {
                    message.error('An error occurred while fetching member data');
                } finally {
                    setLoading(false);
                }
            };
            fetchMember();
        }
    }, [id, isUpdate, form]);

    // Handle form submission
    const handleFinish = async (values: CreateMemberRegistrationRequestDTO) => {
        setLoading(true);
        try {
            if (isUpdate && id) {
                if (!isValidUUID(id)) {
                    message.error('Invalid or missing ID');
                    return;
                }
                await updateMember(id, values);
                message.success('Member updated successfully');
            } else {
                await registerMember(values);
                message.success('Member registered successfully');
            }
            form.resetFields();
            navigate('/members-list');
        } catch (error) {
            message.error('An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        form.resetFields();
        navigate('/members-list');
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Title level={3} style={{ marginBottom: '24px' }}>
                    {isUpdate ? 'Update Member' : 'Register New Member'}
                </Title>
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{ gender: undefined }}
                        scrollToFirstError
                    >
                        <Title level={5}>Personal Information</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter your first name' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Enter first name"
                                        autoFocus
                                        size="large"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="otherName"
                                    label="Other Name"
                                    rules={[{ required: true, message: 'Please enter your other name' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Enter other name" size="large" allowClear />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select your gender' }]}
                                >
                                    <Select placeholder="Select gender" size="large" allowClear>
                                        {GenderOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    rules={[{ required: true, message: 'Please select your date of birth' }]}
                                >
                                    <DatePicker
                                        placeholder="Select date of birth"
                                        size="large"
                                        disabledDate={disablePastDates}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Title level={5}>Contact Information</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Enter email" size="large" allowClear />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={[
                                        { required: true, message: 'Please enter your phone number' },
                                        {
                                            pattern: /^\+?[1-9]\d{1,14}$/,
                                            message: 'Please enter a valid phone number',
                                        },
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" size="large" allowClear />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Title level={5}>Financial Information</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="bankAccount"
                                    label="Bank Account"
                                    rules={[{ required: true, message: 'Please enter your bank account number' }]}
                                >
                                    <Input placeholder="Enter bank account number" size="large" allowClear />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="bankName"
                                    label="Bank Name"
                                    rules={[{ required: true, message: 'Please enter your bank name' }]}
                                >
                                    <Input placeholder="Enter bank name" size="large" allowClear />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Title level={5}>Work Information</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="workPlace" label="Work Place">
                                    <Input placeholder="Enter work place" size="large" allowClear />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="workType" label="Work Type">
                                    <Input placeholder="Enter work type" size="large" allowClear />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Title level={5}>Additional Information</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="dateJoined"
                                    label="Date Joined"
                                    rules={[{ required: true, message: 'Please select the date joined' }]}
                                >
                                    <DatePicker
                                        placeholder="Select date joined"
                                        size="large"
                                        disabledDate={disableFutureDates}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="nationalID"
                                    label={
                                        <span>
                                            National ID{' '}
                                            <Tooltip title="Enter your government-issued ID number">
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            pattern: /^[A-Za-z0-9]{6,20}$/,
                                            message: 'Please enter a valid national ID',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter national ID" size="large" allowClear />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="passportNumber"
                                    label={
                                        <span>
                                            Passport Number{' '}
                                            <Tooltip title="Enter your passport number if applicable">
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            pattern: /^[A-Za-z0-9]{6,20}$/,
                                            message: 'Please enter a valid passport number',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter passport number" size="large" allowClear />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="taxPIN"
                                    label={
                                        <span>
                                            Tax PIN{' '}
                                            <Tooltip title="Enter your tax identification number">
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            pattern: /^[A-Za-z0-9]{6,20}$/,
                                            message: 'Please enter a valid tax PIN',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter tax PIN" size="large" allowClear />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify="end" style={{ marginTop: '24px' }}>
                            <Col>
                                <Button style={{ marginRight: '8px' }} onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                    {isUpdate ? 'Update Member' : 'Register Member'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default MemberForm;
