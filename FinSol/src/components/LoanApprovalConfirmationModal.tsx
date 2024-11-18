import React from 'react';
import { Modal, Button } from 'antd';

interface ConfirmationModalProps {
    visible: boolean; 
    onConfirm: () => void; 
    onCancel: () => void; 
    requestedAmount: number; 
    maxQualified: number; 
}

const LoanApprovalConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    visible, 
    onConfirm, 
    onCancel, 
    requestedAmount, 
    maxQualified 
}) => {
    return (
        <Modal
            title="Confirm Loan Approval"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" onClick={onConfirm}>
                    Confirm Approval
                </Button>,
            ]}
        >
            <p>You are about to approve a loan of <strong>{requestedAmount}</strong> which exceeds the maximum qualified amount of <strong>{maxQualified}</strong>.</p>
            <p>Are you sure you want to proceed?</p>
        </Modal>
    );
};

export default LoanApprovalConfirmationModal;
