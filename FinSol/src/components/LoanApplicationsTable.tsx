import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import moment from 'dayjs';
import { fetchLoanApplications } from '../services/memberLoanService';
import { LoanApplicationList } from '../types/MemberLoan/memberLoanTypes';
import { PaginationOptions } from '../types/paginationTypes';
import { formatCurrency } from '../Utility/formatCurrency';

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
  }, [searchTerm,searchField]);

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
