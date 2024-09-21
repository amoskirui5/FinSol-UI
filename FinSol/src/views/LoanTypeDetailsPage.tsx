import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Card, Spin } from 'antd';
import { fetchLoanTypeById } from '../services/loanTypeService';
import { LoanType } from '../types/loanTypeTypes';
import { formatCurrency } from '../Utility/formatCurrency';
import { getInterestRateTypeName } from '../helpers/enumConversion';

const LoanTypeDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loanType, setLoanType] = useState<LoanType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchLoanTypeDetails();
    }, [id]);

    const fetchLoanTypeDetails = async () => {

        try {
            setLoading(true);
            const response = await fetchLoanTypeById(id);
            
            if (response.success) {
                setLoanType(response.data);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);

        }
        finally {
            setLoading(false);

        }

    };

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    return (
        <Card title="Loan Type Details" style={{ margin: '20px' }}>
            <Descriptions bordered>
                <Descriptions.Item label="Loan Name">{loanType?.loanName}</Descriptions.Item>
                <Descriptions.Item label="Account Name">{loanType?.chartOfAccountName}</Descriptions.Item>
                <Descriptions.Item label="Interest Rate">{loanType?.interestRate}%</Descriptions.Item>
                <Descriptions.Item label="Interest Rate Type">{getInterestRateTypeName(loanType?.interestRateType)}</Descriptions.Item>
                <Descriptions.Item label="Interest Rate Method">{loanType?.interestRateMethod}</Descriptions.Item>
                <Descriptions.Item label="Processing Fee">{loanType?.processingFee}</Descriptions.Item>
                <Descriptions.Item label="Max Repayment Period">{loanType?.maxRepayPeriodInMonths} months</Descriptions.Item>
                <Descriptions.Item label="Membership Duration">{loanType?.membershipDurationRequirementInMonths} months</Descriptions.Item>
                <Descriptions.Item label="Minimum Loan Amount">{formatCurrency(loanType?.minimumLoanAmount ||0)}</Descriptions.Item>
                <Descriptions.Item label="Maximum Loan Amount">{formatCurrency(loanType?.maximumLoanAmount ||0)}</Descriptions.Item>
                <Descriptions.Item label="Grace Period">{loanType?.gracePeriodInMonths} months</Descriptions.Item>
                <Descriptions.Item label="Late Payment Fee">{loanType?.latePaymentFee}</Descriptions.Item>
                <Descriptions.Item label="Collateral Required">{loanType?.isCollateralRequired ? 'Yes' : 'No'}</Descriptions.Item>
                <Descriptions.Item label="Guarantor Required">{loanType?.isGuarantorRequired ? 'Yes' : 'No'}</Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default LoanTypeDetailsPage;