import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Card, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { LoanDisbursementRequestDTO } from '../../types/loanTypeTypes';
import { fetchLoanApprovalDetailsById, submitLoanDisbursement } from '../../services/memberLoanService';
import { getPayeableChartOfAccounts } from '../../services/chartOfAccountsService';
import { ChartOfAccount } from '../../types/accountingTypes';
import { alertService } from '../../services/alertService';
import { LoanApprovalListDTO } from '../../types/MemberLoan/memberLoanTypes';
import { formatDate } from '../../helpers/dateFormater';
import Title from 'antd/es/typography/Title';
import moment from 'moment';

const { Option } = Select;

const LoanDisbursementForm: React.FC = () => {
    const { loanApplicationId } = useParams<{ loanApplicationId: string }>();
    const [form] = Form.useForm();
    const [debitAccounts, setDebitAccounts] = useState<ChartOfAccount[]>([]);
    const { showAlert } = alertService();
    const [loanApproval, setLoanApproval] = useState<LoanApprovalListDTO | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDebitAccounts = async () => {
            const response = await getPayeableChartOfAccounts();
            if (response.success) {
                setDebitAccounts(response.data);

            }
        };

        fetchDebitAccounts();
    }, []);

    useEffect(() => {
        const fetchApprovalData = async () => {
            if (!loanApplicationId) {
                message.error("Loan application ID is missing.");
                return;
            }
            var approvalData = await fetchLoanApprovalDetailsById(loanApplicationId);
            if (approvalData.success) {
                setLoanApproval(approvalData.data);
            }
        }
        fetchApprovalData();
    }, [loanApplicationId]);

    const handleSubmit = async (values: any) => {
        if (isSubmitting) return; // prevent double-click

        const disbursementData: LoanDisbursementRequestDTO = {
            ...values,
            loanAppId: loanApplicationId,
            memberId: loanApproval?.memberId,
            dateDisbursed: values.dateDisbursed.format(),
            loanTypeId: loanApproval?.loanTypeId
        };

        if (disbursementData.amount <= 0) {
            return showAlert('Error', 'Disbursed amount cannot be zero or less', 'error');
        }

        if (loanApproval) {
            if (disbursementData.amount > loanApproval.approvedAmount) {
                return showAlert(
                    'Error',
                    `Disbursed amount ${disbursementData.amount} cannot be more than approved amount ${loanApproval.amount}`,
                    'error'
                );
            }

            if (disbursementData.dateDisbursed < loanApproval.approvalDate) {
                return showAlert(
                    'Error',
                    `Disbursement date ${formatDate(disbursementData.dateDisbursed)} cannot be before approval date ${formatDate(loanApproval.approvalDate)}`,
                    'error'
                );
            }
        }

        try {
            setIsSubmitting(true);
            await submitLoanDisbursement(disbursementData);
            showAlert('Success', 'Disbursement submitted successfully', 'success');
            form.resetFields();
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Something went wrong during disbursement', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (loanApproval) {
            form.setFieldsValue({ amount: loanApproval.approvedAmount });
        }
    }, [loanApproval, form]);

    return (
        <Card bordered style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={4} style={{ marginBottom: 24 }}>
                {loanApproval?.memberName} - {loanApproval?.memberNumber}
            </Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Date Disbursed"
                            name="dateDisbursed"
                            rules={[{ required: true, message: 'Please select the disbursement date' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current > moment().endOf('day')}
                            />
                        </Form.Item>
                    </Col>


                    <Col span={12}>
                        <Form.Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true, message: 'Please enter the amount' }]}
                        >
                            <Input type="number" placeholder="e.g. 50000" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Account Number"
                            name="accountNumber"
                            rules={[{ required: true, message: 'Please enter the account number' }]}
                        >
                            <Input placeholder="e.g. 0123456789" autoComplete="off" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Transaction Reference"
                            name="transactionReference"
                            rules={[{ required: true, message: 'Please enter the transaction reference' }]}
                        >
                            <Input placeholder="e.g. TXN123456" autoComplete="off" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Payment Method"
                            name="paymentMethod"
                            rules={[{ required: true, message: 'Please select a payment method' }]}
                        >
                            <Select placeholder="Select payment method">
                                <Option value="cash">Cash</Option>
                                <Option value="bank_transfer">Bank Transfer</Option>
                                <Option value="cheque">Cheque</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Debit Account"
                            name="debitAccountId"
                            rules={[{ required: true, message: 'Please select a debit account' }]}
                        >
                            <Select placeholder="Select debit account">
                                {debitAccounts.map((account) => (
                                    <Option key={account.id} value={account.id}>
                                        {account.accountName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        Submit Disbursement
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoanDisbursementForm;
