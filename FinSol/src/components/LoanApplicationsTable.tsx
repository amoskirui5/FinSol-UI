import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, Tooltip, message } from 'antd';
import moment from 'dayjs';
import { fetchLoanApplications } from '../services/memberLoanService';
import { LoanApplicationList } from '../types/MemberLoan/memberLoanTypes';
import { PaginationOptions } from '../types/paginationTypes';
import { formatCurrency } from '../Utility/formatCurrency';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const LoanApplicationsTable: React.FC = () => {
  const [loanApplications, setLoanApplications] = useState<LoanApplicationList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('name');
  const paginationOptions: PaginationOptions = {
    searchTerm,
    searchField,
  };
  useEffect(() => {
    const getLoanApplications = async () => {
      setLoading(true);
      const response = await fetchLoanApplications(paginationOptions);
      setLoanApplications(response.data.items);
      setLoading(false);

    };
    getLoanApplications();
  }, [searchTerm, searchField]);

  const handleApproveLoan = (loanNumber: string) => {
    console.log(`Approved loan: ${loanNumber}`);
  };

  const handleDeclineLoan = (loanNumber: string) => {
    console.log(`Declined loan: ${loanNumber}`);
  };

  const handleCheckMemberInfo = (memberNumber: string) => {
    console.log(`Checking member info for: ${memberNumber}`);
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
      render: (text: string) => moment(text).format('YYYY-MM-DD'), // Format date
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
          <Tooltip title="Approve Loan">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApproveLoan(record.loanNumber)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Decline Loan">
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleDeclineLoan(record.loanNumber)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Check Member Info">
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              onClick={() => handleCheckMemberInfo(record.memberNumber)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={loanApplications}
      loading={loading}
      rowKey="loanNumber"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default LoanApplicationsTable;
