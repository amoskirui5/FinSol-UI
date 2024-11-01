import React, { useState } from 'react';
import { Typography } from 'antd';
import LoanStatementTable from '../../components/LoanStatementTable';
import DepositStatementTable from '../../components/DepositStatementTable';
import MemberSelectField from '../../components/MemberSelectField';
import { MemberListDto } from '../../types/Member/memberTypes';

const { Text } = Typography;

const MemberStatement: React.FC = () => {

    const [selectedMember, setSelectedMember] = useState<MemberListDto | null>(null);

    const handleMemberSelect = (member: MemberListDto) => {
        setSelectedMember(member);
    };

    const sampleData = {
        loanStatements: [
            {
                loanId: "b1880acf-cdfd-40d9-ad2c-e7ed5fc1f19e",
                loanNumber: "LN-00000001",
                totalLoanAmount: 10000,
                monthlyRepaymentAmount: 1000,
                outstandingBalance: 8000,
                totalPaidAmount: 0,
                interestRate: 12,
                dueDate: "2024-11-27T21:00:00Z",
                monthlyRepayments: [
                    {
                        month: 10,
                        year: 2024,
                        amountPaid: 2000,
                        interestPaid: 200,
                        principalPaid: 2000,
                        paymentDate: "2024-10-28T21:00:00Z"
                    }
                ]
            }
        ],
        monthlyDeposits: [
            {
                totalMonthlyDeposit: 11550,
                depositMonth: 10,
                depositYear: 2024,
                deposits: [
                    {
                        depositDate: "2024-10-24T21:00:00Z",
                        amount: 1000,
                        depositType: "Deposits",
                        notes: "Contribution for Charissa"
                    }
                ]
            }
        ]
    };

    return (
        <div>
            <Text strong>Select a Member</Text>
            <MemberSelectField selectedMember={selectedMember} onMemberSelect={handleMemberSelect} />
            {selectedMember && (
                <div style={{ marginBottom: '20px' }}>
                    <Text>Member ID: {selectedMember.memberId}</Text>
                    <br />
                    <Text>Name: {`${selectedMember.firstName} ${selectedMember.otherName || ''}`}</Text>
                </div>
            )}

            <Text strong>Loan Statements</Text>
            <LoanStatementTable loans={sampleData.loanStatements} />

            <Text strong style={{ marginTop: '20px' }}>Monthly Deposits</Text>
            <DepositStatementTable deposits={sampleData.monthlyDeposits} />


        </div>
    );
};

export default MemberStatement;
