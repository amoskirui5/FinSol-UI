import React from 'react'
import { LoanInfoResponseDTO, LoanElegibilityResponse } from '../types/MemberLoan/memberLoanTypes';
import { Badge, Button, Modal, Spin, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface LoanEligibilityModalProps {
    visible: boolean;
    onClose: () => void;
    continueApproval: () => void;
    loanInfo: LoanInfoResponseDTO | null;
    loading: boolean;
    appliedAmount?: number;
    eligibilityResponse?: LoanElegibilityResponse | null;
}

interface DataType {
    key: string;
    label: string;
    value: string | number | React.ReactNode;
}

const { Text } = Typography;

const LoanEligibilityModal: React.FC<LoanEligibilityModalProps> = ({
    visible,
    onClose,
    continueApproval,
    loanInfo,
    loading,
    appliedAmount,
    eligibilityResponse,
}) => {
    // eligibilityResponse is available via props when provided
    const appliedValue = typeof appliedAmount === 'number' ? `${appliedAmount.toLocaleString()}` : undefined;
    const dataSource: DataType[] = loanInfo
        ? [
            { key: '1', label: 'Member Number', value: loanInfo.memberNumber },
            { key: '2', label: 'Member Name', value: loanInfo.memberName },
            { key: '3', label: 'Total Deposits', value: `${loanInfo.totalDeposits.toLocaleString()}` },
            // Show applied/requested amount if provided via props
            { key: 'applied', label: 'Applied Amount', value: appliedValue ?? '-' },
            { key: '4', label: 'Max Loan Qualified', value: `${loanInfo.maxLoanQualified.toLocaleString()}` },
            { key: '5', label: 'Loan Balance', value: `${loanInfo.loanBalance.toLocaleString()}` },
            {
                key: '6',
                label: 'Has Existing Loan',
                value: loanInfo.hasExistingLoan ? <Badge status="error" text="Yes" /> : <Badge status="success" text="No" />,
            },
            {
                key: '7',
                label: 'Status',
                value: (
                    <Badge
                        status={loanInfo.status === 'Eligible' ? 'success' : 'warning'}
                        text={loanInfo.status}
                    />
                ),
            },
        ]
        : [];

    const columns: ColumnsType<DataType> = [
        {
            title: 'Description',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (value) => <Text strong>{value}</Text>,
        },
    ];

    return (
        <Modal
            title={<Text strong>Loan Eligibility Information</Text>}
            open={visible}
            onCancel={onClose}
            width={600}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="continue" type="primary" onClick={continueApproval} disabled={!loanInfo || loading}>
                    Continue with Approval
                </Button>,
            ]}
        >
            {/* Show API message if present */}
            {eligibilityResponse?.message && (
                <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">{eligibilityResponse.message}</Text>
                </div>
            )}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Spin size="large" />
                </div>
            ) : loanInfo ? (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    bordered
                    size="middle"
                    rowKey="key"
                />
            ) : (
                <Text type="secondary">No data available</Text>
            )}
        </Modal>
    );
};

export default LoanEligibilityModal;