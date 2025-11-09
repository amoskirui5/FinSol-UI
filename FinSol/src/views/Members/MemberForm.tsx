import React, { useEffect, useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  message, 
  Col, 
  Row, 
  Select, 
  Tooltip, 
  Card, 
  Spin, 
  Typography,
  Space,
  Steps,
  Divider
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMemberById, registerMember, updateMember } from '../../services/memberService';

import dayjs, { Dayjs } from 'dayjs';
import { GenderOptions } from '../../enums/enums';
import { MemberFormProps } from '../../types/Member/memberTypes';
import { 
  InfoCircleOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  UserOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  IdcardOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const MemberForm: React.FC<MemberFormProps> = ({ isUpdate = false }) => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    // Form validation helpers
    const disableFutureDates = (current: Dayjs) => {
        return current && current > dayjs().endOf('day');
    };

    const disablePastDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().subtract(18, 'years'));
    };

    const isValidUUID = (id: string | undefined): id is `${string}-${string}-${string}-${string}-${string}` => {
        return !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    };

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
                        message.error(response.message || 'Failed to load member data');
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

    const validateAllSteps = async () => {
        try {
            // Validate all required fields across all steps
            const requiredFields = [
                'firstName', 'otherName', 'gender', 'dateOfBirth',
                'email', 'phoneNumber',
                'bankAccount', 'bankName',
                'dateJoined'
            ];
            
            await form.validateFields(requiredFields);
            return true;
        } catch (error) {
            console.error('Validation failed:', error);
            return false;
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // Get all form values
            const allFormValues = form.getFieldsValue();
            
            // Convert dayjs objects to ISO strings for API
            const processedValues = {
                ...allFormValues,
                dateOfBirth: allFormValues.dateOfBirth?.toISOString(),
                dateJoined: allFormValues.dateJoined?.toISOString(),
            };

            if (isUpdate && id) {
                if (!isValidUUID(id)) {
                    message.error('Invalid or missing ID');
                    return;
                }
                await updateMember(id, processedValues);
                message.success('Member updated successfully');
            } else {
                await registerMember(processedValues);
                message.success('Member registered successfully');
            }
            form.resetFields();
            navigate('/members-list');
        } catch (error) {
            console.error('Submission error:', error);
            message.error('An error occurred during submission. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        navigate('/members-list');
    };

    const validateStep = async (step: number) => {
        const fieldsToValidate = getFieldsForStep(step);
        try {
            await form.validateFields(fieldsToValidate);
            return true;
        } catch (error) {
            return false;
        }
    };

    const getFieldsForStep = (step: number): string[] => {
        const fieldMap = {
            0: ['firstName', 'otherName', 'memberNumber', 'gender', 'dateOfBirth'],
            1: ['email', 'phoneNumber'],
            2: ['bankAccount', 'bankName'],
            3: ['dateJoined', 'nationalID']
        };
        return fieldMap[step as keyof typeof fieldMap] || [];
    };

    const nextStep = async () => {
        if (await validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const steps = [
        {
            title: 'Personal Info',
            icon: <UserOutlined />,
            description: 'Basic personal details'
        },
        {
            title: 'Contact Info',
            icon: <MailOutlined />,
            description: 'Communication details'
        },
        {
            title: 'Banking Info',
            icon: <BankOutlined />,
            description: 'Financial information'
        },
        {
            title: 'Additional Info',
            icon: <IdcardOutlined />,
            description: 'Identification & dates'
        }
    ];

    const renderPersonalInfo = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                        { required: true, message: 'Please enter first name' },
                        { min: 2, message: 'First name must be at least 2 characters' },
                        { max: 50, message: 'First name cannot exceed 50 characters' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="form-icon" />}
                        placeholder="Enter first name"
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="otherName"
                    label="Other Name"
                    rules={[
                        { required: true, message: 'Please enter other name' },
                        { min: 2, message: 'Other name must be at least 2 characters' },
                        { max: 50, message: 'Other name cannot exceed 50 characters' }
                    ]}
                >
                    <Input 
                        prefix={<UserOutlined className="form-icon" />} 
                        placeholder="Enter other name" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="memberNumber"
                    label="Member Number"
                    rules={[
                        { min: 3, message: 'Member number must be at least 3 characters' },
                        { max: 20, message: 'Member number cannot exceed 20 characters' }
                    ]}
                >
                    <Input 
                        prefix={<IdcardOutlined className="form-icon" />} 
                        placeholder="Enter member number (optional)" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select gender' }]}
                >
                    <Select 
                        placeholder="Select gender" 
                        size="large"
                        className="enterprise-select"
                    >
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
                    rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                    <DatePicker
                        placeholder="Select date of birth"
                        size="large"
                        disabledDate={disablePastDates}
                        style={{ width: '100%' }}
                        className="enterprise-input"
                        suffixIcon={<CalendarOutlined />}
                    />
                </Form.Item>
            </Col>
        </Row>
    );

    const renderContactInfo = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                        { required: true, message: 'Please enter email address' },
                        { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                >
                    <Input 
                        prefix={<MailOutlined className="form-icon" />} 
                        placeholder="Enter email address" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        { required: true, message: 'Please enter phone number' },
                        {
                            pattern: /^\+?[1-9]\d{1,14}$/,
                            message: 'Please enter a valid phone number'
                        }
                    ]}
                >
                    <Input 
                        prefix={<PhoneOutlined className="form-icon" />} 
                        placeholder="Enter phone number" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24}>
                <Form.Item
                    name="workPlace"
                    label="Workplace"
                >
                    <Input 
                        placeholder="Enter workplace (optional)" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24}>
                <Form.Item
                    name="workType"
                    label="Work Type"
                >
                    <Input 
                        placeholder="Enter work type (optional)" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
        </Row>
    );

    const renderBankingInfo = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="bankAccount"
                    label="Bank Account Number"
                    rules={[
                        { required: true, message: 'Please enter bank account number' },
                        { min: 8, message: 'Account number must be at least 8 digits' }
                    ]}
                >
                    <Input 
                        placeholder="Enter bank account number" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="bankName"
                    label="Bank Name"
                    rules={[{ required: true, message: 'Please enter bank name' }]}
                >
                    <Select
                        placeholder="Select bank name"
                        size="large"
                        className="enterprise-select"
                        showSearch
                        optionFilterProp="children"
                    >
                        <Option value="KCB Bank">KCB Bank</Option>
                        <Option value="Equity Bank">Equity Bank</Option>
                        <Option value="Cooperative Bank">Cooperative Bank</Option>
                        <Option value="Standard Chartered">Standard Chartered</Option>
                        <Option value="Barclays Bank">Barclays Bank</Option>
                        <Option value="NCBA Bank">NCBA Bank</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );

    const renderAdditionalInfo = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="dateJoined"
                    label="Date Joined"
                    rules={[{ required: true, message: 'Please select date joined' }]}
                >
                    <DatePicker
                        placeholder="Select date joined"
                        size="large"
                        disabledDate={disableFutureDates}
                        style={{ width: '100%' }}
                        className="enterprise-input"
                        suffixIcon={<CalendarOutlined />}
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
                            message: 'Please enter a valid national ID'
                        }
                    ]}
                >
                    <Input 
                        placeholder="Enter national ID" 
                        size="large"
                        className="enterprise-input"
                    />
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
                            message: 'Please enter a valid passport number'
                        }
                    ]}
                >
                    <Input 
                        placeholder="Enter passport number (optional)" 
                        size="large"
                        className="enterprise-input"
                    />
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
                            message: 'Please enter a valid tax PIN'
                        }
                    ]}
                >
                    <Input 
                        placeholder="Enter tax PIN (optional)" 
                        size="large"
                        className="enterprise-input"
                    />
                </Form.Item>
            </Col>
        </Row>
    );



    return (
        <div className="page-container">
            <Card className="enterprise-card">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={handleCancel}
                            className="back-button"
                            style={{ marginBottom: 16 }}
                        >
                            Back to Members
                        </Button>
                        <Title level={3} style={{ margin: 0 }}>
                            {isUpdate ? 'Update Member' : 'Register New Member'}
                        </Title>
                        <Text type="secondary">
                            {isUpdate 
                                ? 'Update member information and details' 
                                : 'Fill in the information to register a new member'
                            }
                        </Text>
                    </div>
                </div>

                <Divider />

                {/* Steps */}
                <div style={{ marginBottom: 32 }}>
                    <Steps 
                        current={currentStep} 
                        type="navigation"
                        size="small"
                        className="member-form-steps"
                    >
                        {steps.map((step, index) => (
                            <Step
                                key={index}
                                title={step.title}
                                description={step.description}
                                icon={step.icon}
                            />
                        ))}
                    </Steps>
                </div>

                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ gender: undefined }}
                        scrollToFirstError
                        className="enterprise-form"
                    >
                        {/* All Form Steps - Always Rendered */}
                        <div style={{ minHeight: 400, marginBottom: 24 }}>
                            {/* Step 0: Personal Info */}
                            <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                                {renderPersonalInfo()}
                            </div>
                            
                            {/* Step 1: Contact Info */}
                            <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                                {renderContactInfo()}
                            </div>
                            
                            {/* Step 2: Banking Info */}
                            <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                                {renderBankingInfo()}
                            </div>
                            
                            {/* Step 3: Additional Info */}
                            <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                                {renderAdditionalInfo()}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="form-actions">
                            <Space size="middle">
                                <Button onClick={handleCancel}>
                                    Cancel
                                </Button>
                                {currentStep > 0 && (
                                    <Button onClick={prevStep}>
                                        Previous
                                    </Button>
                                )}
                                {currentStep < steps.length - 1 ? (
                                    <Button type="primary" onClick={nextStep}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button 
                                        type="primary" 
                                        onClick={async () => {
                                            try {
                                                // Validate all required fields across all steps
                                                const isValid = await validateAllSteps();
                                                if (isValid) {
                                                    handleFinish();
                                                } else {
                                                    message.error('Please fill in all required fields');
                                                }
                                            } catch (error) {
                                                console.error('Form validation failed:', error);
                                                message.error('Please fill in all required fields');
                                            }
                                        }}
                                        loading={loading}
                                        icon={<SaveOutlined />}
                                        className="submit-button"
                                    >
                                        {isUpdate ? 'Update Member' : 'Register Member'}
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default MemberForm;
