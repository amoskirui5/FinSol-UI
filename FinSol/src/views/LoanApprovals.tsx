import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Row, Col, Tag, Input, Modal, Form, Select, message } from 'antd';
import { EditOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as memberLoanService from '../services/memberLoanService';

const { Title, Text } = Typography;
const { Option } = Select;

interface LoanApproval {
  key: string;
  applicationId: string;
  memberName: string;
  memberNumber: string;
  loanType: string;
  requestedAmount: number;
  recommendedAmount: number;
  applicationDate: string;
  status: 'pending' | 'approved' | 'declined';
  reviewer: string;
  reviewDate?: string;
  remarks?: string;
}

const LoanApprovals: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LoanApproval[]>([]);
  const [filteredData, setFilteredData] = useState<LoanApproval[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApproval | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLoanApprovals();
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

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [data, searchText, statusFilter]);

  const fetchLoanApprovals = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: LoanApproval[] = [
        {
          key: '1',
          applicationId: 'LA-2024-001',
          memberName: 'John Doe',
          memberNumber: 'MEM001',
          loanType: 'Personal Loan',
          requestedAmount: 50000,
          recommendedAmount: 45000,
          applicationDate: '2024-01-15',
          status: 'pending',
          reviewer: 'Credit Manager'
        },
        {
          key: '2',
          applicationId: 'LA-2024-002',
          memberName: 'Jane Smith',
          memberNumber: 'MEM002',
          loanType: 'Business Loan',
          requestedAmount: 100000,
          recommendedAmount: 100000,
          applicationDate: '2024-01-16',
          status: 'approved',
          reviewer: 'Loan Officer',
          reviewDate: '2024-01-18',
          remarks: 'Approved based on good credit history'
        },
        {
          key: '3',
          applicationId: 'LA-2024-003',
          memberName: 'Mike Johnson',
          memberNumber: 'MEM003',
          loanType: 'Emergency Loan',
          requestedAmount: 25000,
          recommendedAmount: 20000,
          applicationDate: '2024-01-17',
          status: 'declined',
          reviewer: 'Credit Manager',
          reviewDate: '2024-01-19',
          remarks: 'Insufficient collateral'
        }
      ];
      
      setData(mockData);
    } catch (error) {
      console.error('Error fetching loan approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleApprove = (record: LoanApproval) => {
    setSelectedLoan(record);
    form.setFieldsValue({
      action: 'approved',
      approvedAmount: record.recommendedAmount,
      remarks: ''
    });
    setModalVisible(true);
  };

  const handleDecline = (record: LoanApproval) => {
    setSelectedLoan(record);
    form.setFieldsValue({
      action: 'declined',
      approvedAmount: 0,
      remarks: ''
    });
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (values.action === 'declined') {
        // Call the decline API
        await memberLoanService.submitLoanRejection(selectedLoan?.applicationId || '', values.remarks);
        message.success('Loan application declined successfully');
      } else {
        // For approval, we would call the approval API here
        message.info('Approval functionality would be implemented here');
      }
      
      // Update the record in the data
      const updatedData = data.map(item => 
        item.key === selectedLoan?.key 
          ? {
              ...item,
              status: values.action,
              recommendedAmount: values.approvedAmount || item.recommendedAmount,
              reviewDate: dayjs().format('YYYY-MM-DD'),
              remarks: values.remarks
            }
          : item
      );
      
      setData(updatedData);
      setModalVisible(false);
      setSelectedLoan(null);
      form.resetFields();
    } catch (error) {
      console.error('Action failed:', error);
      message.error('Failed to process loan application. Please try again.');
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Pending Review' },
      approved: { color: 'green', text: 'Approved' },
      declined: { color: 'red', text: 'Declined' }
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
      render: (record: LoanApproval) => (
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
      title: 'Requested Amount',
      dataIndex: 'requestedAmount',
      key: 'requestedAmount',
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
      title: 'Recommended Amount',
      dataIndex: 'recommendedAmount',
      key: 'recommendedAmount',
      align: 'right' as const,
      render: (value: number) => (
        <Text strong style={{ color: 'var(--primary-color)' }}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </Text>
      ),
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY')
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
      render: (record: LoanApproval) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
                className="enterprise-btn-primary"
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleDecline(record)}
              >
                Decline
              </Button>
            </>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              // TODO: Implement view details functionality
              message.info('View details functionality to be implemented');
            }}
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
                  Loan Approvals
                </Title>
                <Text type="secondary">
                  Review and approve pending loan applications
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
              <Col xs={24} sm={12} md={8}>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: '100%' }}
                  placeholder="Filter by status"
                >
                  <Option value="all">All Status</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="declined">Declined</Option>
                </Select>
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
        title={`${selectedLoan?.status === 'approved' ? 'Approve' : 'Decline'} Loan Application`}
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
          <div style={{ marginBottom: 16 }}>
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
                <Text strong>Loan Type: </Text>
                <Text>{selectedLoan.loanType}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Requested Amount: </Text>
                <Text>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(selectedLoan.requestedAmount)}
                </Text>
              </Col>
            </Row>
          </div>
        )}
        
        <Form form={form} layout="vertical">
          <Form.Item
            name="action"
            label="Decision"
            rules={[{ required: true, message: 'Please select an action' }]}
          >
            <Select placeholder="Select action">
              <Option value="approved">Approve</Option>
              <Option value="declined">Decline</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="approvedAmount"
            label="Approved Amount"
            rules={[{ required: true, message: 'Please enter approved amount' }]}
          >
            <Input
              type="number"
              placeholder="Enter approved amount"
              prefix="$"
            />
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="Remarks"
            rules={[{ required: true, message: 'Please provide remarks' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter approval/decline remarks"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoanApprovals;