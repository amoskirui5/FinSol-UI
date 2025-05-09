import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Modal, Typography } from 'antd';
import { LoanApprovalRequest } from '../../types/loanTypeTypes';
import { useParams } from 'react-router-dom';
import { fetchLoanDetailsById, submitLoanApproval } from '../../services/memberLoanService';
import { LoanApplicationList } from '../../types/MemberLoan/memberLoanTypes';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { alertService } from '../../services/alertService';

const LoanApprovalForm: React.FC = () => {
    const [form] = Form.useForm();
    const { loanApplicationId } = useParams<{ loanApplicationId: string }>();
    const [loanData, setLoanData] = useState<LoanApplicationList | null>(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const loanInfo = location.state?.loanInfo;
    const { showAlert } = alertService();

    useEffect(() => {
        const fetchLoanData = async () => {
            if (loanApplicationId) {
                const apiResponse = await fetchLoanDetailsById(loanApplicationId);
                setLoanData(apiResponse.data);
            }
        };

        if (loanApplicationId) fetchLoanData();
    }, [loanApplicationId]);

    const handleFinish = async (values: any) => {
        const requestData: LoanApprovalRequest = {
            approvalDate: values.approvalDate.format('YYYY-MM-DD'),
            amount: values.amount,
            comments: values.comments || '',
            repaymentPeriod: values.repaymentPeriod,
            loanApplicationsId: loanData?.loanId,
        };
        setLoading(true);
        try {
            const maxQualified = loanInfo?.maxLoanQualified ?? 0;
            const maxRepayPeriod = loanInfo?.maxRepayPeriod ?? 0;

            if (requestData.amount > maxQualified) {
                showAlert('Error', `Loan amount ${requestData.amount} exceeds the qualified limit ${maxQualified}`, 'error');
            }
            else if (requestData.repaymentPeriod > maxRepayPeriod) {
                showAlert('Error', `Loan repay period ${requestData.repaymentPeriod} exceeds the max repay period ${maxRepayPeriod}`, 'error');
            }
            else {
                Modal.confirm({
                    title: 'Approve Loan?',
                    content: `Are you sure you want to approve the loan number: ${loanData?.loanNumber}?`,
                    okText: 'Yes, Approve',
                    cancelText: 'No',
                    async onOk() {
                        await submitLoanApproval(requestData);
                    },
                    onCancel() {
                        showAlert('Info', `Loan approval canceled`, 'success');

                    }
                });
            }


        } catch (error) {
            setLoading(false);

        } finally {
            setLoading(false);
        }
    };

    return loanData ? (
        <>
            <Typography.Title level={3}>Loan Approval</Typography.Title>
            <Typography.Title level={4}>
                {loanData.memberName} - {loanData.memberNumber}
            </Typography.Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    approvalDate: dayjs(),
                    amount: loanData?.amount,
                    comments: '',
                    repaymentPeriod: loanData?.repayPeriod
                }}
            >
                <Form.Item
                    label="Approval Date"
                    name="approvalDate"
                    rules={[{ required: true, message: 'Please select approval date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Approved Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please enter approved amount' }]}
                >
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Repayment Period (Months)"
                    name="repaymentPeriod"
                    rules={[{ required: true, message: 'Please enter repayment period' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Comments"
                    name="comments"
                >
                    <Input.TextArea rows={4} placeholder="Enter any additional comments" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Approve Loan
                    </Button>
                </Form.Item>
            </Form>
        </>
    ) : <p>Loading...</p>;
};

export default LoanApprovalForm;
