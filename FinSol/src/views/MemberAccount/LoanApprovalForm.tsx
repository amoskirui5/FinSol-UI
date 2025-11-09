import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Button,
    DatePicker,
    Typography,
    Modal,
    Card,
    Row,
    Col,
    Spin,
    message
} from 'antd';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { LoanApplicationList } from '../../types/MemberLoan/memberLoanTypes';
import { fetchLoanDetailsById, submitLoanApproval } from '../../services/memberLoanService';
import { LoanApprovalRequest } from '../../types/LoanTypesSettings/loanTypeTypes';

const LoanApprovalForm: React.FC = () => {
    const [form] = Form.useForm();
    const { loanApplicationId } = useParams<{ loanApplicationId: string }>();
    const [loanData, setLoanData] = useState<LoanApplicationList | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const location = useLocation();
    const loanInfo = location.state?.loanInfo;
    // appliedAmount may be passed in navigation state from the table when continuing approval
    const appliedAmountFromState: number | undefined = location.state?.appliedAmount;
    const navigate = useNavigate();

    useEffect(() => {
        if (!loanInfo) {
            message.error('Loan info not available. Please start from the loan applications page.');
            navigate('/loan-applications');
        }
    }, [loanInfo, navigate]);

    useEffect(() => {
        const fetchLoanData = async () => {
            if (!loanApplicationId) return;

            try {
                const apiResponse = await fetchLoanDetailsById(loanApplicationId);
                setLoanData(apiResponse.data);

                // Determine applied amount from API response (preferred), then from navigation state (table),
                // then fallback to loanInfo.maxLoanQualified or 0.
                const appliedAmount = Number(
                    apiResponse.data?.amount ?? appliedAmountFromState ?? loanInfo?.maxLoanQualified ?? 0
                );

                form.setFieldsValue({
                    approvalDate: dayjs(),
                    amount: appliedAmount,
                    comments: '',
                    repaymentPeriod: apiResponse.data?.repayPeriod
                });
            } catch (error) {
                console.error('Failed to load loan details:', error);
                message.error('Failed to load loan details. Please try again.');
            } finally {
                setPageLoading(false);
            }
        };

        fetchLoanData();
    }, [loanApplicationId, form, appliedAmountFromState, loanInfo?.maxLoanQualified]);

    const handleFinish = async (values: {
        approvalDate: dayjs.Dayjs;
        amount: number;
        comments?: string;
        repaymentPeriod: number;
    }) => {
        const requestData: LoanApprovalRequest = {
            approvalDate: values.approvalDate.toDate(),
            amount: values.amount,
            comments: values.comments || '',
            repaymentPeriod: values.repaymentPeriod,
            loanApplicationsId: loanData?.loanId,
        };

        const maxQualified = loanInfo?.maxLoanQualified ?? 0;
        const maxRepayPeriod = loanInfo?.maxRepayPeriod ?? 0;

        if (requestData.amount > maxQualified) {
            message.error(`Loan amount ${requestData.amount} exceeds the qualified limit ${maxQualified}`);
            return;
        }

        if (requestData.repaymentPeriod > maxRepayPeriod) {
            message.error(`Repayment period ${requestData.repaymentPeriod} exceeds the maximum allowed (${maxRepayPeriod} months).`);
            return;
        }

        Modal.confirm({
            title: 'Confirm Loan Approval',
            content: `Approve loan number ${loanData?.loanNumber}?`,
            okText: 'Yes, Approve',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true);
                try {
                    await submitLoanApproval(requestData);
                    message.success('Loan approved successfully!');
                    navigate('/loan-applications');
                } catch (error) {
                    console.error('Loan approval failed:', error);
                    message.error('Failed to approve loan. Please try again.');
                } finally {
                    setLoading(false);
                }
            },
            onCancel: () => {
                message.info('Loan approval cancelled.');
            }
        });
    };

    if (pageLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card
            title="Loan Approval Form"
            bordered={false}
            style={{ maxWidth: 700, margin: '0 auto', marginTop: 40 }}
        >
            <Typography.Title level={4}>
                {loanData?.memberName} — {loanData?.memberNumber}
            </Typography.Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Approval Date"
                            name="approvalDate"
                            rules={[{ required: true, message: 'Please select approval date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Approved Amount"
                            name="amount"
                            rules={[{ required: true, message: 'Please enter approved amount' }]}
                        >
                            <InputNumber
                                min={0}
                                precision={2}
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Repayment Period (Months)"
                            name="repaymentPeriod"
                            rules={[{ required: true, message: 'Please enter repayment period' }]}
                        >
                            <InputNumber min={1} max={loanInfo?.maxRepayPeriod} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Comments"
                            name="comments"
                        >
                            <Input.TextArea rows={4} placeholder="Enter any additional comments (optional)" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Approve Loan
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoanApprovalForm;
