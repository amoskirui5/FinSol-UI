import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip } from 'antd';
import moment from 'dayjs';
import { fetchLoanApplications, fetchLoanEligibility } from '../services/memberLoanService';
import { LoanApplicationList, LoanInfoResponseDTO } from '../types/MemberLoan/memberLoanTypes';
import { PaginationOptions } from '../types/paginationTypes';
import { formatCurrency } from '../Utility/formatCurrency';
import { CheckCircleOutlined, CloseCircleOutlined, DollarCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import LoanEligibilityModal from './LoanEligibilityModal';
import LoanApprovalConfirmationModal from './LoanApprovalConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { LoanStatus } from '../enums/enums';

const LoanApplicationsTable: React.FC = () => {
  const [loanApplications, setLoanApplications] = useState<LoanApplicationList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('name');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loanInfo, setLoanInfo] = useState<LoanInfoResponseDTO | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(0);
  const [memLoanId, SetMemLoanId] = useState<string>('');
  const paginationOptions: PaginationOptions = {
    searchTerm,
    searchField,
  };

  const navigate = useNavigate();
  useEffect(() => {
    const getLoanApplications = async () => {
      setLoading(true);
      const response = await fetchLoanApplications(paginationOptions);
      setLoanApplications(response.data.items);
      setLoading(false);

    };
    getLoanApplications();
  }, [searchTerm, searchField]);

  const handleApproveLoan = async (loanId: string, memberId: string, loanTypeId: string, requestedAmount: number) => {
    setRequestedLoanAmount(requestedAmount);
    SetMemLoanId(loanId)

    const eligibilityResponse = await fetchLoanEligibility(memberId, loanTypeId);
    if (eligibilityResponse.success) {
      setLoanInfo(eligibilityResponse.data);
      setIsModalVisible(true);

    } else {
      console.log('Could not fetch eligibility info:', eligibilityResponse.message);
    }

  };

  const handleConfirmApproval = (loanId: string) => {
    console.log(`Approved loan: ${loanId}`);
    setIsConfirmModalVisible(false);
  };

  const handleCancelApproval = () => {
    setIsConfirmModalVisible(false);
  };

  const handleDeclineLoan = (loanId: string) => {
    console.log(`Declined loan: ${loanId}`);
  };

  const handleCheckMemberInfo = async (memberId: string, loanTypeId: string) => {

    setLoading(true);
    const eligibilityResponse = await fetchLoanEligibility(memberId, loanTypeId);
    if (eligibilityResponse.success) {
      setLoanInfo(eligibilityResponse.data);
      setIsModalVisible(true);
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleContinueApproval = () => {
    navigate(`/loan-approval/${memLoanId}`, { state: { loanInfo } });
  };

  const handleDisburseLoan = async (loanAppId: string) => {

    navigate(`/loan-disbursement/${loanAppId}`);
  };

  const columns = [
    {
      title: 'Loan Number',
      dataIndex: 'loanNumber',
      key: 'loanNumber',
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Loan Type',
      dataIndex: 'loanName',
      key: 'loanName',
    },
    {
      title: 'Member Number',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: 'Repay Period (Months)',
      dataIndex: 'repayPeriod',
      key: 'repayPeriod',
    },
    {
      title: 'Status',
      dataIndex: 'loanStatus',
      key: 'loanStatus',
      render: (value: LoanStatus) => LoanStatus[value],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <div>
          <Tooltip title={record.loanStatus === LoanStatus.Approved ? "Loan Approved" : "Approve Loan"}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApproveLoan(record.loanId, record.memberId, record.loanTypeId, record.amount)}
              disabled={record.loanStatus !== LoanStatus.Applied}
              style={{ marginRight: 8 }}
            />
          </Tooltip>

          <Tooltip title={record.loanStatus === LoanStatus.Approved ? "Loan Approved" : "Decline Loan"}>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                handleDeclineLoan(record.loanId);
              }}
              disabled={record.loanStatus !== LoanStatus.Applied}
              style={{ marginRight: 8 }}
            />
          </Tooltip>

          {record.loanStatus === LoanStatus.Approved && (
            <Tooltip title={record.loanStatus === LoanStatus.Disbursed ? "Loan already disbursed" : "Disburse Loan"}>
              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                onClick={() => handleDisburseLoan(record.loanId)}
                disabled={record.loanStatus === LoanStatus.Disbursed}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          )}

          <Tooltip title="Check Member Info">
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              onClick={() => handleCheckMemberInfo(record.memberId, record.loanTypeId)}
            />
          </Tooltip>
        </div>
      ),

    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={loanApplications}
        loading={loading}
        rowKey="loanNumber"
        pagination={{ pageSize: 10 }}
      />
      <LoanEligibilityModal
        visible={isModalVisible}
        onClose={handleModalClose}
        continueApproval={handleContinueApproval}
        loanInfo={loanInfo}
        loading={loading}
      />

      <LoanApprovalConfirmationModal
        visible={isConfirmModalVisible}
        onConfirm={() => handleConfirmApproval(memLoanId)}
        onCancel={handleCancelApproval}
        requestedAmount={requestedLoanAmount}
        maxQualified={loanInfo?.maxLoanQualified == null ? 0 : loanInfo?.maxLoanQualified}
      />
    </div>

  );
};

export default LoanApplicationsTable;
