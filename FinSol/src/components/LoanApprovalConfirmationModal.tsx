import React from 'react';
import { Modal, Button } from 'antd';

interface ConfirmationModalProps {
    visible: boolean; // Controls the visibility of the modal
    onConfirm: () => void; // Function to call on confirmation
    onCancel: () => void; // Function to call on cancellation
    requestedAmount: number; // The amount the member requested
    maxQualified: number; // The maximum amount the member qualifies for
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
