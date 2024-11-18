import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { LoanDisbursementRequestDTO } from '../../types/loanTypeTypes';
import { fetchLoanApprovalDetailsById, submitLoanDisbursement } from '../../services/memberLoanService';
import { getPayeableChartOfAccounts } from '../../services/chartOfAccountsService';
import { ChartOfAccount } from '../../types/accountingTypes';
import { alertService } from '../../services/alertService';
import { LoanApprovalListDTO } from '../../types/MemberLoan/memberLoanTypes';
import { formatDate } from '../../helpers/dateFormater';

const { Option } = Select;

const LoanDisbursementForm: React.FC = () => {
    const { loanApplicationId } = useParams<{ loanApplicationId: string }>();
    const [form] = Form.useForm();
    const [debitAccounts, setDebitAccounts] = useState<ChartOfAccount[]>([]);
    const { showAlert } = alertService();
    const [loanApproval, setLoanApproval] = useState<LoanApprovalListDTO | null>(null);

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

            if (disbursementData.amount > loanApproval?.amount) {
                return showAlert('Error', `Disbursed amount ${disbursementData.amount} cannot be more than approved amount ${loanApproval?.amount}`, 'error');
            }

            if (disbursementData.dateDisbursed < loanApproval.approvalDate) {
                return showAlert('Error', `Disbursement date ${formatDate(disbursementData.dateDisbursed)} cannot be beofre approval date ${formatDate(loanApproval?.approvalDate)}`, 'error');
            }
        }

        await submitLoanDisbursement(disbursementData);

        form.resetFields();

    };

    useEffect(() => {
        if (loanApproval) {
            form.setFieldsValue({ amount: loanApproval.amount });
        }
    }, [loanApproval, form]);

    return (
        <>
         <Typography.Title level={4}>
                {loanApproval?.memberName} - {loanApproval?.memberNumber}
            </Typography.Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Date Disbursed"
                    name="dateDisbursed"
                    rules={[{ required: true, message: 'Please select the date disbursed' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input the amount' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Account Number"
                    name="accountNumber"
                    rules={[{ required: true, message: 'Please input the account number' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Transaction Reference"
                    name="transactionReference"
                    rules={[{ required: true, message: 'Please input the transaction Reference' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Payment Method"
                    name="paymentMethod"
                    rules={[{ required: true, message: 'Please select a Payment method' }]}
                >
                    <Select placeholder="Select a payment method" style={{ width: '100%' }}>
                        <Option value="cash">Cash</Option>
                        <Option value="bank_transfer">Bank Transfer</Option>
                        <Option value="cheque">Cheque</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Debit Account"
                    name="debitAccountId"
                    rules={[{ required: true, message: 'Please select a debit account' }]}
                >
                    <Select placeholder="Select a debit account">
                        {debitAccounts.map((account) => (
                            <Option key={account.id} value={account.id}>
                                {account.accountName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Disbursement
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LoanDisbursementForm;
