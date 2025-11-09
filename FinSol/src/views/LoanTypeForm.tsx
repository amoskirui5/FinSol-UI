import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Switch, Row, Col, Typography, notification, Spin, Space, Modal } from 'antd';
import { getChartOfAccounts } from '../services/chartOfAccountsService';
import { ChartOfAccount } from '../types/Accounting/accountingTypes';
import { InterestRateMethodOptions, InterestRateTypeOptions } from '../enums/enums';
import { LoanTypeCreationRequestDTO } from '../types/LoanTypesSettings/loanTypeTypes';
import { createLoanType, editLoanType, fetchLoanTypeById } from '../services/loanTypeService';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const LoanTypeForm: React.FC = () => {
    const [form] = Form.useForm();
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch charts of accounts
    const fetchChartsOfAccounts = useCallback(async () => {
        try {
            setApiLoading(true);
            const results = await getChartOfAccounts();
            if (results.success) {
                setChartsOfAccount(results.data);
            } else {
                throw new Error('Failed to fetch charts of accounts');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch charts of accounts. Please try again.',
            });
        } finally {
            setApiLoading(false);
        }
    }, []);

    // Fetch loan type details for editing
    const fetchLoanTypeDetails = useCallback(
        async (id: string) => {
            try {
                setApiLoading(true);
                const response = await fetchLoanTypeById(id);
                if (response.success) {
                    const loanTypeData = response.data;
                    form.setFieldsValue({
                        loanName: loanTypeData.loanName,
                        accountId: loanTypeData.chartOfAccountId,
                        gracePeriodInMonths: loanTypeData.gracePeriodInMonths,
                        maxRepayPeriodInMonths: loanTypeData.maxRepayPeriodInMonths,
                        membershipDurationRequirementInMonths:
                            loanTypeData.membershipDurationRequirementInMonths,
                        isGuarantorRequired: loanTypeData.isGuarantorRequired,
                        interestRate: loanTypeData.interestRate,
                        interestRateMethod: loanTypeData.interestRateMethod,
                        interestRateType: loanTypeData.interestRateType,
                        isCollateralRequired: loanTypeData.isCollateralRequired,
                        latePaymentFee: loanTypeData.latePaymentFee,
                        maximumLoanAmount: loanTypeData.maximumLoanAmount,
                        minimumLoanAmount: loanTypeData.minimumLoanAmount,
                        processingFee: loanTypeData.processingFee,
                        interestAccountId: loanTypeData.interestChartOfAccountId,
                        penaltyAccountId: loanTypeData.penaltyChartOfAccountId,
                        depositMultiplier: loanTypeData.depositMultiplier,
                        penaltyFee: loanTypeData.penaltyFee,
                    });
                } else {
                    throw new Error('Failed to fetch loan type details');
                }
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch loan type details. Please try again.',
                });
            } finally {
                setApiLoading(false);
            }
        },
        [form]
    );

    useEffect(() => {
        fetchChartsOfAccounts();
        if (id) {
            fetchLoanTypeDetails(id);
        }
    }, [id, fetchChartsOfAccounts, fetchLoanTypeDetails]);

    // Handle form submission
    const handleFinish = async (values: LoanTypeCreationRequestDTO) => {
        setLoading(true);
        try {
            if (id) {
                await editLoanType(id, values);
                notification.success({
                    message: 'Success',
                    description: 'Loan type updated successfully!',
                });
            } else {
                await createLoanType(values);
                notification.success({
                    message: 'Success',
                    description: 'Loan type created successfully!',
                });
            }
            form.resetFields();
            setIsConfirmModalVisible(false);
            navigate('/loan-types');
        } catch (error) {
            notification.error({
                message: 'Submission Failed',
                description: `Unable to ${id ? 'update' : 'create'} loan type. Please try again.`,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle confirmation modal
    const handleConfirmSubmit = () => {
        form
            .validateFields()
            .then(() => setIsConfirmModalVisible(true))
            .catch(() =>
                notification.warning({
                    message: 'Validation Failed',
                    description: 'Please fill all required fields correctly.',
                })
            );
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setIsConfirmModalVisible(false);
    };

    // Reset form
    const handleReset = () => {
        form.resetFields();
        notification.info({
            message: 'Form Reset',
            description: 'All fields have been cleared.',
        });
    };

    return (
        <Spin spinning={apiLoading} tip="Loading data...">
            <div
                style={{
                    maxWidth: 800,
                    margin: '24px auto',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Title level={3} style={{ marginBottom: 24 }}>
                    {id ? 'Edit Loan Type' : 'Create Loan Type'}
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        isGuarantorRequired: false,
                        isCollateralRequired: false,
                        gracePeriodInMonths: 0,
                        membershipDurationRequirementInMonths: 0,
                        interestRate: 0,
                        latePaymentFee: 0,
                        processingFee: 0,
                        minimumLoanAmount: 1,
                        maximumLoanAmount: 1,
                        maxRepayPeriodInMonths: 1,
                        depositMultiplier: 0,
                        penaltyFee: 0,
                    }}
                    scrollToFirstError
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Loan Name"
                                name="loanName"
                                rules={[
                                    { required: true, message: 'Please input loan name!' },
                                    { max: 100, message: 'Loan name cannot exceed 100 characters' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <Input placeholder="Enter loan name" size="large" aria-label="Loan name" />
                            </Form.Item>

                            <Form.Item
                                label="Account"
                                name="accountId"
                                rules={[{ required: true, message: 'Please select an account!' }]}
                                validateTrigger="onChange"
                            >
                                <Select
                                    placeholder="Select an account"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    aria-label="Account"
                                >
                                    {chartsOfAccount.map((account) => (
                                        <Option key={account.id} value={account.id}>
                                            {account.accountName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Interest Account"
                                name="interestAccountId"
                                rules={[{ required: true, message: 'Please select an interest account!' }]}
                                validateTrigger="onChange"
                            >
                                <Select
                                    placeholder="Select an interest account"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    aria-label="Interest account"
                                >
                                    {chartsOfAccount.map((account) => (
                                        <Option key={account.id} value={account.id}>
                                            {account.accountName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Penalty Account"
                                name="penaltyAccountId"
                                rules={[{ required: true, message: 'Please select a penalty account!' }]}
                                validateTrigger="onChange"
                            >
                                <Select
                                    placeholder="Select a penalty account"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    aria-label="Penalty account"
                                >
                                    {chartsOfAccount.map((account) => (
                                        <Option key={account.id} value={account.id}>
                                            {account.accountName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Grace Period (Months)"
                                name="gracePeriodInMonths"
                                rules={[
                                    { required: true, message: 'Please input grace period!' },
                                    { type: 'number', min: 0, message: 'Grace period cannot be negative' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={0}
                                    size="large"
                                    placeholder="Enter months"
                                    style={{ width: '100%' }}
                                    aria-label="Grace period"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Interest Rate (%)"
                                name="interestRate"
                                rules={[
                                    { required: true, message: 'Please input interest rate!' },
                                    { type: 'number', min: 0, message: 'Interest rate cannot be negative' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={0}
                                    step={0.01}
                                    size="large"
                                    placeholder="Enter interest rate"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}%`}
                                    aria-label="Interest rate"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Interest Rate Method"
                                name="interestRateMethod"
                                rules={[{ required: true, message: 'Please select interest rate method!' }]}
                                validateTrigger="onChange"
                            >
                                <Select
                                    placeholder="Select method"
                                    size="large"
                                    aria-label="Interest rate method"
                                >
                                    {InterestRateMethodOptions.map((method) => (
                                        <Option key={method.value} value={method.value}>
                                            {method.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Penalty Fee"
                                name="penaltyFee"
                                rules={[
                                    { required: true, message: 'Please input penalty fee!' },
                                    { type: 'number', min: 0, message: 'Penalty fee cannot be negative' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={0}
                                    size="large"
                                    placeholder="Enter penalty fee"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    aria-label="Penalty fee"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Maximum Repayment Period (Months)"
                                name="maxRepayPeriodInMonths"
                                rules={[
                                    { required: true, message: 'Please input maximum repayment period!' },
                                    { type: 'number', min: 1, message: 'Minimum 1 month required' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={1}
                                    size="large"
                                    placeholder="Enter months"
                                    style={{ width: '100%' }}
                                    aria-label="Maximum repayment period"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Membership Duration Requirement (Months)"
                                name="membershipDurationRequirementInMonths"
                                rules={[
                                    { required: true, message: 'Please input membership duration!' },
                                    { type: 'number', min: 0, message: 'Duration cannot be negative' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={0}
                                    size="large"
                                    placeholder="Enter months"
                                    style={{ width: '100%' }}
                                    aria-label="Membership duration requirement"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Guarantor Required"
                                name="isGuarantorRequired"
                                valuePropName="checked"
                            >
                                <Switch aria-label="Guarantor required" />
                            </Form.Item>

                            <Form.Item
                                label="Interest Rate Type"
                                name="interestRateType"
                                rules={[{ required: true, message: 'Please select interest rate type!' }]}
                                validateTrigger="onChange"
                            >
                                <Select
                                    placeholder="Select type"
                                    size="large"
                                    aria-label="Interest rate type"
                                >
                                    {InterestRateTypeOptions.map((type) => (
                                        <Option key={type.value} value={type.value}>
                                            {type.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Collateral Required"
                                name="isCollateralRequired"
                                valuePropName="checked"
                            >
                                <Switch aria-label="Collateral required" />
                            </Form.Item>

                            <Form.Item
                                label="Maximum Loan Amount"
                                name="maximumLoanAmount"
                                rules={[
                                    { required: true, message: 'Please input maximum loan amount!' },
                                    { type: 'number', min: 1, message: 'Amount must be at least 1' },
                                    {
                                        validator: (_, value) =>
                                            value >= form.getFieldValue('minimumLoanAmount')
                                                ? Promise.resolve()
                                                : Promise.reject('Maximum amount must be >= minimum amount'),
                                    },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={1}
                                    size="large"
                                    placeholder="Enter amount"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    aria-label="Maximum loan amount"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Minimum Loan Amount"
                                name="minimumLoanAmount"
                                rules={[
                                    { required: true, message: 'Please input minimum loan amount!' },
                                    { type: 'number', min: 1, message: 'Amount must be at least 1' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={1}
                                    size="large"
                                    placeholder="Enter amount"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    aria-label="Minimum loan amount"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Processing Fee"
                                name="processingFee"
                                rules={[
                                    { required: true, message: 'Please input processing fee!' },
                                    { type: 'number', min: 0, message: 'Processing fee cannot be negative' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={0}
                                    size="large"
                                    placeholder="Enter fee"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    aria-label="Processing fee"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Deposit Multiplier"
                                name="depositMultiplier"
                                rules={[
                                    { required: true, message: 'Please input deposit multiplier!' },
                                    { type: 'number', min: 0, message: 'Multiplier cannot be negative' },
                                ]}
                                validateTrigger="onChange"
                            >
                                <InputNumber
                                    min={0}
                                    step={0.1}
                                    size="large"
                                    placeholder="Enter multiplier"
                                    style={{ width: '100%' }}
                                    aria-label="Deposit multiplier"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleConfirmSubmit}
                                loading={loading}
                            >
                                {id ? 'Update' : 'Create'}
                            </Button>
                            <Button size="large" onClick={handleReset}>
                                Reset
                            </Button>
                            <Button size="large" onClick={() => navigate('/loan-types')}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Modal
                    title={id ? 'Confirm Loan Type Update' : 'Confirm Loan Type Creation'}
                    open={isConfirmModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={id ? 'Update' : 'Create'}
                    cancelText="Cancel"
                    confirmLoading={loading}
                >
                    <p>Are you sure you want to {id ? 'update' : 'create'} this loan type?</p>
                    <p>
                        <strong>Loan Name:</strong> {form.getFieldValue('loanName') || 'Not specified'}
                    </p>
                    <p>
                        <strong>Interest Rate:</strong> {form.getFieldValue('interestRate') || 0}%
                    </p>
                    <p>
                        <strong>Maximum Loan Amount:</strong> $
                        {form.getFieldValue('maximumLoanAmount')?.toLocaleString() || 0}
                    </p>
                    <p>
                        <strong>Minimum Loan Amount:</strong> $
                        {form.getFieldValue('minimumLoanAmount')?.toLocaleString() || 0}
                    </p>
                </Modal>
            </div>
        </Spin>
    );
};

export default LoanTypeForm;