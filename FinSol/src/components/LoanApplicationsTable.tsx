import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import moment from 'dayjs';
import { fetchLoanApplications } from '../services/memberLoanService';
import { LoanApplicationList } from '../types/MemberLoan/memberLoanTypes';

const LoanApplicationsTable: React.FC = () => {
  const [loanApplications, setLoanApplications] = useState<LoanApplicationList[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch loan applications on component mount
  useEffect(() => {
    const getLoanApplications = async () => {
      setLoading(true);
      try {
        const response = await fetchLoanApplications();
        setLoanApplications(response.data.items);
      } catch (error) {
        message.error('Failed to load loan applications');
      } finally {
        setLoading(false);
      }
    };
    getLoanApplications();
  }, []);

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
      dataIndex: 'loanTypeName',
      key: 'loanTypeName',
    },
    {
      title: 'Member Number',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
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
      render: (amount: number) => `$${amount.toFixed(2)}`, 
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
