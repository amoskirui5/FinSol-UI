import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, DatePicker, Select, InputNumber, Row, Col, notification, Spin, Space, Modal } from 'antd';
import { fetchLoanTypes } from '../../services/loanTypeService';
import { PaginationOptions } from '../../types/paginationTypes';
import { LoanType } from '../../types/LoanTypesSettings/loanTypeTypes';
import { submitLoanApplication } from '../../services/memberLoanService';
import dayjs, { Dayjs } from 'dayjs';
import { CreateLoanApplicationRequest } from '../../types/MemberLoan/memberLoanTypes';
import { MemberListDto } from '../../types/Member/memberTypes';
import MemberSelectField from '../../components/MemberSelectField';
import Title from 'antd/es/typography/Title';

const { Option } = Select;

const LoanApplicationForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [pagination, setPagination] = useState<PaginationOptions>({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: '',
        searchField: '',
        sortDescending: false,
    });

    // Fetch loan types
    const fetchLoanTypesData = useCallback(async () => {
        try {
            setApiLoading(true);
            const types = await fetchLoanTypes(pagination);
            setLoanTypes(types.data.items);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch loan types. Please try again.',
            });
        } finally {
            setApiLoading(false);
        }
    }, [pagination]);

    useEffect(() => {
        fetchLoanTypesData();
    }, [fetchLoanTypesData]);

    // Handle form submission
    const onFinish = async (values: any) => {
        const requestData: CreateLoanApplicationRequest = {
            applicationDate: values.applicationDate.format('YYYY-MM-DD'),
            loanTypeId: values.loanTypeId,
            memberId: values.memberId,
            repayPeriod: values.repayPeriod,
            amount: values.amount,
        };

        setLoading(true);
        try {
            await submitLoanApplication(requestData);
            setIsConfirmModalVisible(false);
            notification.success({
                message: 'Success',
                description: 'Loan application submitted successfully!',
            });
            form.resetFields();
            setSelectedMember(null);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    // Validate application date
    const validateDate = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    // Handle member selection
    const handleMemberSelect = (member: MemberListDto) => {
        if (member) {
            setSelectedMember(member);
            form.setFieldsValue({ memberId: member.memberId });
        }
    };

    // Reset form
    const handleReset = () => {
        form.resetFields();
        setSelectedMember(null);
        setPagination({
            pageNumber: 1,
            pageSize: 10,
            searchTerm: '',
            searchField: '',
            sortDescending: false,
        });
        notification.info({
            message: 'Form Reset',
            description: 'All fields have been cleared.',
        });
    };

    // Handle confirm modal
    const handleConfirmSubmit = () => {
        form
            .validateFields()
            .then(() => setIsConfirmModalVisible(true))
            .catch(() => notification.warning({
                message: 'Validation Failed',
                description: 'Please fill all required fields correctly.',
            }));
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setIsConfirmModalVisible(false);
    };

    return (
        <Spin spinning={apiLoading} tip="Loading data...">
            <div
                style={{
                    maxWidth: 600,
                    margin: '24px auto',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Title level={3} style={{ marginBottom: 24 }}>
                    Loan Application Form
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ repayPeriod: 1, amount: 0 }}
                    scrollToFirstError
                >
                    <Form.Item
                        label="Application Date"
                        name="applicationDate"
                        rules={[{ required: true, message: 'Please select application date' }]}
                        validateTrigger="onChange"
                    >
                        <DatePicker
                            disabledDate={validateDate}
                            style={{ width: '100%' }}
                            placeholder="Select date"
                            size="large"
                            aria-label="Application date"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Loan Type"
                        name="loanTypeId"
                        rules={[{ required: true, message: 'Please select loan type' }]}
                        validateTrigger="onChange"
                    >
                        <Select
                            placeholder="Select loan type"
                            size="large"
                            showSearch
                            optionFilterProp="children"
                            onSearch={(value) =>
                                setPagination((prev) => ({
                                    ...prev,
                                    searchTerm: value,
                                    searchField: 'loanType',
                                }))
                            }
                            aria-label="Loan type"
                        >
                            {loanTypes.map((type) => (
                                <Option key={type.loanTypeId} value={type.loanTypeId}>
                                    {type.loanName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Form.Item
                                name="memberId"
                                rules={[{ required: true, message: 'Please select a member' }]}
                                validateTrigger="onChange"
                            >
                                <MemberSelectField
                                    selectedMember={selectedMember}
                                    onMemberSelect={handleMemberSelect}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Repay Period (Months)"
                        name="repayPeriod"
                        rules={[
                            { required: true, message: 'Please enter repay period' },
                            { type: 'number', min: 1, message: 'Minimum 1 month required' },
                        ]}
                        validateTrigger="onChange"
                    >
                        <InputNumber
                            min={1}
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Enter months"
                            aria-label="Repay period"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Loan Amount"
                        name="amount"
                        rules={[
                            { required: true, message: 'Please enter loan amount' },
                            { type: 'number', min: 0, message: 'Amount cannot be negative' },
                        ]}
                        validateTrigger="onChange"
                    >
                        <InputNumber
                            min={0}
                            precision={2}
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Enter amount"
                            formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            aria-label="Loan amount"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleConfirmSubmit}
                                loading={loading}
                            >
                                Submit
                            </Button>
                            <Button size="large" onClick={handleReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Modal
                    title="Confirm Loan Application"
                    open={isConfirmModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText="Submit"
                    cancelText="Cancel"
                    confirmLoading={loading}
                >
                    <p>Are you sure you want to submit this loan application?</p>
                    {selectedMember && (
                        <p>
                            <strong>Member:</strong> {selectedMember.firstName}{' '}
                            {selectedMember.otherName}
                        </p>
                    )}
                    <p>
                        <strong>Loan Type:</strong>{' '}
                        {loanTypes.find((type) => type.loanTypeId === form.getFieldValue('loanTypeId'))?.loanName || 'Not selected'}
                    </p>
                    <p>
                        <strong>Amount:</strong> ${form.getFieldValue('amount')?.toLocaleString() || 0}
                    </p>
                    <p>
                        <strong>Repay Period:</strong> {form.getFieldValue('repayPeriod') || 0} months
                    </p>
                </Modal>
            </div>
        </Spin>
    );
};

export default LoanApplicationForm;