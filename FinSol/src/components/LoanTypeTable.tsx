import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Popconfirm, 
  Typography, 
  Space, 
  Card,
  Tooltip,
  Tag,
  Input,
  Row,
  Col
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { LoanType, LoanTypeTableProps } from '../types/LoanTypesSettings/loanTypeTypes';
import { formatCurrency } from '../Utility/formatCurrency';

const { Title } = Typography;
const { Search } = Input;

const LoanTypeTable: React.FC<LoanTypeTableProps> = ({ 
  loanTypes, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onRegister, 
  totalRecords,
  pageNumber,
  pageSize 
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredLoanTypes = loanTypes.filter(loanType =>
    loanType.loanName.toLowerCase().includes(searchText.toLowerCase()) ||
    loanType.chartOfAccountName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Loan Type',
      key: 'loanInfo',
      width: 250,
      render: (record: LoanType) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {record.loanName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Account: {record.chartOfAccountName || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate',
      width: 130,
      align: 'center' as const,
      render: (rate: number) => (
        <Tag icon={<PercentageOutlined />} color="blue">
          {rate}%
        </Tag>
      ),
      sorter: (a: LoanType, b: LoanType) => a.interestRate - b.interestRate,
    },
    {
      title: 'Loan Range',
      key: 'loanRange',
      width: 200,
      render: (record: LoanType) => (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--success-color)' }}>
            Min: {formatCurrency(record.minimumLoanAmount)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--error-color)', marginTop: 2 }}>
            Max: {formatCurrency(record.maximumLoanAmount)}
          </div>
        </div>
      ),
    },
    {
      title: 'Maximum Amount',
      dataIndex: 'maximumLoanAmount',
      key: 'maximumLoanAmount',
      width: 150,
      align: 'right' as const,
      render: (value: number) => (
        <span style={{ fontWeight: 500, color: 'var(--primary-color)' }}>
          {formatCurrency(value)}
        </span>
      ),
      sorter: (a: LoanType, b: LoanType) => a.maximumLoanAmount - b.maximumLoanAmount,
    },
    {
      title: 'Minimum Amount',
      dataIndex: 'minimumLoanAmount',
      key: 'minimumLoanAmount',
      width: 150,
      align: 'right' as const,
      render: (value: number) => (
        <span style={{ color: 'var(--text-secondary)' }}>
          {formatCurrency(value)}
        </span>
      ),
      sorter: (a: LoanType, b: LoanType) => a.minimumLoanAmount - b.minimumLoanAmount,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (record: LoanType) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record.loanTypeId)}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Edit Loan Type">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.loanTypeId)}
              className="action-button"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Loan Type"
            description="Are you sure you want to delete this loan type? This action cannot be undone."
            onConfirm={() => onDelete(record.loanTypeId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okType="danger"
          >
            <Tooltip title="Delete Loan Type">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                className="action-button"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card className="enterprise-card">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Loan Types Management
            </Title>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
              Configure and manage loan types, interest rates, and amounts
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onRegister}
            className="primary-button"
          >
            Add Loan Type
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="filter-section">
          <Row gutter={16} align="middle">
            <Col xs={24} md={12}>
              <Search
                placeholder="Search loan types..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                enterButton={<SearchOutlined />}
                allowClear
                size="middle"
              />
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Showing {filteredLoanTypes.length} of {loanTypes.length} loan types
                </span>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {loanTypes.length}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Loan Types</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success-color)' }}>
                {loanTypes.length > 0 
                  ? `${Math.min(...loanTypes.map(lt => lt.interestRate))}%`
                  : '0%'
                }
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Lowest Rate</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                {loanTypes.length > 0 
                  ? `${Math.max(...loanTypes.map(lt => lt.interestRate))}%`
                  : '0%'
                }
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Highest Rate</div>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Table
          dataSource={filteredLoanTypes}
          columns={columns}
          rowKey="loanTypeId"
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: totalRecords,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} loan types`,
          }}
          scroll={{ x: 1000 }}
          className="enterprise-table"
          size="middle"
        />
      </Card>
    </div>
  );
};

export default LoanTypeTable;
