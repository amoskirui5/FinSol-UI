import React from 'react'
import { LoanInfoResponseDTO } from '../types/MemberLoan/memberLoanTypes';
import { Button, Modal, Table } from 'antd';

interface LoanEligibilityModalProps {
    visible: boolean;
    onClose: () => void;
    continueApproval: () =>void;
    loanInfo: LoanInfoResponseDTO | null;
    loading: boolean;
}

const LoanEligibilityModal: React.FC<LoanEligibilityModalProps> = ({ visible, onClose,continueApproval, loanInfo, loading }) => {
    const dataSource = loanInfo
        ? [
            { key: '1', label: 'Member Number', value: loanInfo.memberNumber },
            { key: '2', label: 'Member Name', value: loanInfo.memberName },
            { key: '3', label: 'Total Deposits', value: loanInfo.totalDeposits },
            { key: '4', label: 'Max Loan Qualified', value: loanInfo.maxLoanQualified },
            { key: '5', label: 'Loan Balance', value: loanInfo.loanBalance },
            { key: '6', label: 'Has Existing Loan', value: loanInfo.hasExistingLoan ? 'Yes' : 'No' },
            { key: '7', label: 'Status', value: loanInfo.status },
        ]
        : [];

    const columns = [
        {
            title: 'Description',
            dataIndex: 'label',
            key: 'label',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
    ];

    return (
        <Modal
            title="Loan Eligibility Info"
            visible={visible}
            onCancel={onClose}
            onContinueApproval={continueApproval}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="continue" type="primary" onClick={continueApproval}>
                    Continue with Approval
                </Button>,
            ]}
        >
            {loading ? (
                <p>Loading...</p>
            ) : loanInfo ? (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false} // Disable pagination since we only have a few rows
                    bordered
                    size="small"
                    rowKey="key"
                />
            ) : (
                <p>No data available</p>
            )}
        </Modal>
    );
};

export default LoanEligibilityModal;