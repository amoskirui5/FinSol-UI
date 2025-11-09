import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Row, Col, Tag, Input, DatePicker, Modal, Form, InputNumber, message } from 'antd';
import { DollarOutlined, SearchOutlined, BankOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface LoanDisbursement {
  key: string;
  applicationId: string;
  memberName: string;
  memberNumber: string;
  loanType: string;
  approvedAmount: number;
  disbursedAmount?: number;
  approvalDate: string;
  disbursementDate?: string;
  status: 'approved' | 'disbursed' | 'partially_disbursed';
  accountNumber: string;
  bankName?: string;
  remarks?: string;
}

const LoanDisbursements: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LoanDisbursement[]>([]);
  const [filteredData, setFilteredData] = useState<LoanDisbursement[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanDisbursement | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLoanDisbursements();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter(item =>
        item.memberName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.memberNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.applicationId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [data, searchText]);

  const fetchLoanDisbursements = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: LoanDisbursement[] = [
        {
          key: '1',
          applicationId: 'LA-2024-001',
          memberName: 'John Doe',
          memberNumber: 'MEM001',
          loanType: 'Personal Loan',
          approvedAmount: 45000,
          approvalDate: '2024-01-18',
          status: 'approved',
          accountNumber: '1234567890',
          bankName: 'ABC Bank'
        },
        {
          key: '2',
          applicationId: 'LA-2024-002',
          memberName: 'Jane Smith',
          memberNumber: 'MEM002',
          loanType: 'Business Loan',
          approvedAmount: 100000,
          disbursedAmount: 100000,
          approvalDate: '2024-01-18',
          disbursementDate: '2024-01-20',
          status: 'disbursed',
          accountNumber: '0987654321',
          bankName: 'XYZ Bank',
          remarks: 'Full amount disbursed successfully'
        },
        {
          key: '3',
          applicationId: 'LA-2024-004',
          memberName: 'Alice Brown',
          memberNumber: 'MEM004',
          loanType: 'Emergency Loan',
          approvedAmount: 30000,
          disbursedAmount: 20000,
          approvalDate: '2024-01-19',
          disbursementDate: '2024-01-21',
          status: 'partially_disbursed',
          accountNumber: '1122334455',
          bankName: 'DEF Bank',
          remarks: 'Partial disbursement as requested'
        }
      ];
      
      setData(mockData);
    } catch (error) {
      console.error('Error fetching loan disbursements:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleDisburse = (record: LoanDisbursement) => {
    setSelectedLoan(record);
    form.setFieldsValue({
      disbursementAmount: record.approvedAmount - (record.disbursedAmount || 0),
      disbursementDate: dayjs(),
      paymentMethod: 'bank_transfer',
      remarks: ''
    });
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.debug('Disbursement action:', {
        applicationId: selectedLoan?.applicationId,
        ...values
      });
      
      // Update the record in the data
      const updatedData = data.map(item => 
        item.key === selectedLoan?.key 
          ? {
              ...item,
              disbursedAmount: (item.disbursedAmount || 0) + values.disbursementAmount,
              disbursementDate: values.disbursementDate.format('YYYY-MM-DD'),
              status: ((item.disbursedAmount || 0) + values.disbursementAmount >= item.approvedAmount) 
                ? 'disbursed' as const 
                : 'partially_disbursed' as const,
              remarks: values.remarks
            }
          : item
      );
      
      setData(updatedData);
      setModalVisible(false);
      setSelectedLoan(null);
      form.resetFields();
      message.success('Loan disbursement processed successfully');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      approved: { color: 'orange', text: 'Pending Disbursement' },
      disbursed: { color: 'green', text: 'Fully Disbursed' },
      partially_disbursed: { color: 'blue', text: 'Partially Disbursed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Application ID',
      dataIndex: 'applicationId',
      key: 'applicationId',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Member',
      key: 'member',
      render: (record: LoanDisbursement) => (
        <div>
          <Text strong>{record.memberName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.memberNumber}
          </Text>
        </div>
      ),
    },
    {
      title: 'Loan Type',
      dataIndex: 'loanType',
      key: 'loanType',
    },
    {
      title: 'Approved Amount',
      dataIndex: 'approvedAmount',
      key: 'approvedAmount',
      align: 'right' as const,
      render: (value: number) => (
        <Text>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </Text>
      ),
    },
    {
      title: 'Disbursed Amount',
      key: 'disbursedAmount',
      align: 'right' as const,
      render: (record: LoanDisbursement) => (
        <div>
          <Text strong style={{ color: 'var(--primary-color)' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(record.disbursedAmount || 0)}
          </Text>
          {record.disbursedAmount && record.disbursedAmount < record.approvedAmount && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Remaining: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(record.approvedAmount - record.disbursedAmount)}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Account Details',
      key: 'account',
      render: (record: LoanDisbursement) => (
        <div>
          <Text>{record.accountNumber}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.bankName}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LoanDisbursement) => (
        <Space>
          {(record.status === 'approved' || record.status === 'partially_disbursed') && (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
              onClick={() => handleDisburse(record)}
              className="enterprise-btn-primary"
            >
              Disburse
            </Button>
          )}
          <Button
            size="small"
            icon={<BankOutlined />}
            onClick={() => message.info(`View details: ${record.applicationId}`)}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                  Loan Disbursements
                </Title>
                <Text type="secondary">
                  Process loan disbursements for approved applications
                </Text>
              </div>
            </div>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by member name, number, or application ID"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              className="enterprise-table"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} applications`,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Process Loan Disbursement"
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false);
          setSelectedLoan(null);
          form.resetFields();
        }}
        width={600}
      >
        {selectedLoan && (
          <div style={{ marginBottom: 16, padding: 16, background: 'var(--background-secondary)', borderRadius: 8 }}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>Application ID: </Text>
                <Text>{selectedLoan.applicationId}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Member: </Text>
                <Text>{selectedLoan.memberName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Approved Amount: </Text>
                <Text>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(selectedLoan.approvedAmount)}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Already Disbursed: </Text>
                <Text>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(selectedLoan.disbursedAmount || 0)}
                </Text>
              </Col>
              <Col span={24}>
                <Text strong>Account: </Text>
                <Text>{selectedLoan.accountNumber} - {selectedLoan.bankName}</Text>
              </Col>
            </Row>
          </div>
        )}
        
        <Form form={form} layout="vertical">
          <Form.Item
            name="disbursementAmount"
            label="Disbursement Amount"
            rules={[{ required: true, message: 'Please enter disbursement amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter amount to disburse"
              prefix="$"
              min={0}
              max={selectedLoan ? selectedLoan.approvedAmount - (selectedLoan.disbursedAmount || 0) : 0}
            />
          </Form.Item>
          
          <Form.Item
            name="disbursementDate"
            label="Disbursement Date"
            rules={[{ required: true, message: 'Please select disbursement date' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="Remarks"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter any remarks for this disbursement"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoanDisbursements;