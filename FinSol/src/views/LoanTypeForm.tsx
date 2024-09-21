import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Switch, Row, Col } from 'antd';
import { getChartOfAccounts } from '../services/chartOfAccountsService';
import { ChartOfAccount } from '../types/accountingTypes';
import { InterestRateMethodOptions, InterestRateTypeOptions } from '../enums/enums';
import { LoanTypeCreationRequestDTO } from '../types/loanTypeTypes';
import { createLoanType, editLoanType, fetchLoanTypeById } from '../services/loanTypeService';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const LoanTypeForm: React.FC = () => {
    const [form] = Form.useForm();
    const [chartsOfAccount, setChartsOfAccount] = useState<ChartOfAccount[]>([]);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChartsOfAccounts = async () => {
            const results = await getChartOfAccounts();
            if (results.success) {
                setChartsOfAccount(results.data);
            }
        };
        fetchChartsOfAccounts();
    }, []);

    useEffect(() => {
        const fetchLoanTypeDetails = async (id: string) => {
            const response = await fetchLoanTypeById(id);
            if (response.success) {
                const loanTypeData = response.data;

                form.setFieldsValue({
                    loanName: loanTypeData.loanName,
                    accountId: loanTypeData.chartOfAccountId,
                    gracePeriodInMonths: loanTypeData.gracePeriodInMonths,
                    maxRepayPeriodInMonths: loanTypeData.maxRepayPeriodInMonths,
                    membershipDurationRequirementInMonths: loanTypeData.membershipDurationRequirementInMonths,
                    isGuarantorRequired: loanTypeData.isGuarantorRequired,
                    interestRate: loanTypeData.interestRate,
                    interestRateMethod: loanTypeData.interestRateMethod,
                    interestRateType: loanTypeData.interestRateType,
                    isCollateralRequired: loanTypeData.isCollateralRequired,
                    latePaymentFee: loanTypeData.latePaymentFee,
                    maximumLoanAmount: loanTypeData.maximumLoanAmount,
                    minimumLoanAmount: loanTypeData.minimumLoanAmount,
                    processingFee: loanTypeData.processingFee,
                });
            }
        };

        if (id) {
            fetchLoanTypeDetails(id);
        }
    }, [id, form]);

    const handleFinish = async (values: LoanTypeCreationRequestDTO) => {
        if (id) {
            await editLoanType(id, values);
        }
        else {
            await createLoanType(values);

        }

        navigate('/loan-types');
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
                isGuarantorRequired: false,
                isCollateralRequired: false,
            }}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Loan Name"
                        name="loanName"
                        rules={[{ required: true, message: 'Please input loan name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Account ID"
                        name="accountId"
                        rules={[{ required: true, message: 'Please select an account ID!' }]}
                    >
                        <Select placeholder="Select an account">
                            {chartsOfAccount.map(account => (
                                <Option key={account.id} value={account.id}>
                                    {account.accountName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Grace Period (Months)"
                        name="gracePeriodInMonths"
                        rules={[{ required: true, message: 'Please input grace period in months!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Interest Rate (%)"
                        name="interestRate"
                        rules={[{ required: true, message: 'Please input interest rate!' }]}
                    >
                        <InputNumber min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item
                        label="Interest Rate Method"
                        name="interestRateMethod"
                        rules={[{ required: true, message: 'Please select interest rate method!' }]}
                    >
                        <Select>
                            {InterestRateMethodOptions.map(method => (
                                <Option key={method.value} value={method.value}>
                                    {method.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Late Payment Fee"
                        name="latePaymentFee"
                        rules={[{ required: true, message: 'Please input late payment fee!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Minimum Loan Amount"
                        name="minimumLoanAmount"
                        rules={[{ required: true, message: 'Please input minimum loan amount!' }]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        label="Max Repayment Period (Months)"
                        name="maxRepayPeriodInMonths"
                        rules={[{ required: true, message: 'Please input max repayment period!' }]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>

                    <Form.Item
                        label="Membership Duration Requirement (Months)"
                        name="membershipDurationRequirementInMonths"
                        rules={[{ required: true, message: 'Please input membership duration requirement!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Is Guarantor Required?"
                        name="isGuarantorRequired"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Interest Rate Type"
                        name="interestRateType"
                        rules={[{ required: true, message: 'Please select interest rate type!' }]}
                    >
                        <Select>
                            {InterestRateTypeOptions.map(type => (
                                <Option key={type.value} value={type.value}>
                                    {type.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Is Collateral Required?"
                        name="isCollateralRequired"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Maximum Loan Amount"
                        name="maximumLoanAmount"
                        rules={[{ required: true, message: 'Please input maximum loan amount!' }]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>

                    <Form.Item
                        label="Processing Fee"
                        name="processingFee"
                        rules={[{ required: true, message: 'Please input processing fee!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoanTypeForm;
