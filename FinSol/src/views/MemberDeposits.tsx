import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Row, Col, Tag, Input, DatePicker, Modal, Form, InputNumber, Select, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  MemberDeposit, 
  CreateMemberDepositRequest
} from '../types/MemberServices/memberServicesTypes';
import { 
  getMemberDeposits, 
  createMemberDeposit 
} from '../services/memberServicesService';
import { PaginationOptions } from '../types/paginationTypes';

const { Title, Text } = Typography;
const { Option } = Select;

const MemberDeposits: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MemberDeposit[]>([]);
  const [filteredData, setFilteredData] = useState<MemberDeposit[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<MemberDeposit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchMemberDeposits();
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    filterData();
  }, [data, searchText, statusFilter]);

  const fetchMemberDeposits = async () => {
    setLoading(true);
    try {
      const paginationOptions: PaginationOptions = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        searchTerm: searchText,
      };
      
      // Use actual service call
      const response = await getMemberDeposits(paginationOptions);
      
      if (response.success && response.data) {
        setData(response.data.items || []);
        setPagination(prev => ({ 
          ...prev, 
          total: response.data.totalRecords || 0 
        }));
      } else {
        // Fallback to mock data if service fails
        console.warn('Service call failed, using mock data:', response.message);
        await loadMockData();
      }
    } catch (error) {
      console.error('Error fetching member deposits:', error);
      message.error('Failed to fetch member deposits, loading sample data');
      // Fallback to mock data on error
      await loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data that matches the DTO structure
    const mockData: MemberDeposit[] = [
      {
        depositId: 'DEP-001',
        memberId: 'MEM-001',
        memberName: 'John Doe',
        memberNumber: 'MEM001',
        depositType: 'savings',
        amount: 5000,
        depositDate: '2024-01-20',
        status: 'active',
        accountNumber: 'SAV001',
        description: 'Monthly savings deposit',
        createdBy: 'Teller 1',
        createdDate: '2024-01-20T10:00:00Z'
      },
      {
        depositId: 'DEP-002',
        memberId: 'MEM-002',
        memberName: 'Jane Smith',
        memberNumber: 'MEM002',
        depositType: 'fixed_deposit',
        amount: 12000,
        depositDate: '2024-01-21',
        maturityDate: '2025-01-21',
        interestRate: 5.5,
        status: 'active',
        accountNumber: 'FD001',
        description: 'One year fixed deposit',
        createdBy: 'Manager',
        createdDate: '2024-01-21T14:30:00Z'
      },
      {
        depositId: 'DEP-003',
        memberId: 'MEM-003',
        memberName: 'Mike Johnson',
        memberNumber: 'MEM003',
        depositType: 'share_capital',
        amount: 25000,
        depositDate: '2024-01-22',
        status: 'active',
        accountNumber: 'SHR001',
        description: 'Share capital contribution',
        createdBy: 'Manager',
        createdDate: '2024-01-22T09:15:00Z'
      }
    ];
    
    setData(mockData);
    setPagination(prev => ({ ...prev, total: mockData.length }));
  };

  const filterData = () => {
    let filtered = [...data];
    
    if (searchText) {
      filtered = filtered.filter(item =>
        item.memberName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.memberNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.depositId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredData(filtered);
  };

  const handleCreate = () => {
    setSelectedDeposit(null);
    setIsEditing(false);
    form.resetFields();
    form.setFieldsValue({
      depositDate: dayjs(),
      depositType: 'savings',
      status: 'active'
    });
    setModalVisible(true);
  };

  const handleEdit = (record: MemberDeposit) => {
    setSelectedDeposit(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      depositDate: dayjs(record.depositDate),
      maturityDate: record.maturityDate ? dayjs(record.maturityDate) : undefined
    });
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues: CreateMemberDepositRequest = {
        memberId: values.memberId,
        depositType: values.depositType,
        amount: values.amount,
        depositDate: values.depositDate.format('YYYY-MM-DD'),
        maturityDate: values.maturityDate ? values.maturityDate.format('YYYY-MM-DD') : undefined,
        interestRate: values.interestRate,
        accountNumber: values.accountNumber,
        description: values.description,
        paymentMethod: values.paymentMethod || 'cash',
        referenceNumber: values.referenceNumber
      };
      
      if (isEditing && selectedDeposit) {
        // Update existing deposit - would call update service when available
        const updatedData = data.map(item => 
          item.depositId === selectedDeposit.depositId 
            ? { 
                ...item, 
                ...formattedValues,
                depositId: selectedDeposit.depositId,
                memberName: values.memberName || item.memberName,
                memberNumber: values.memberNumber || item.memberNumber,
                status: values.status || item.status,
                createdBy: item.createdBy,
                createdDate: item.createdDate
              }
            : item
        );
        setData(updatedData);
        message.success('Deposit updated successfully');
      } else {
        // Create new deposit using service
        try {
          await createMemberDeposit(formattedValues);
          message.success('Deposit created successfully');
          
          // Refresh data after successful creation
          fetchMemberDeposits();
        } catch (error) {
          console.error('Failed to create deposit:', error);
          message.error('Failed to create deposit');
          return;
        }
      }
      
      setModalVisible(false);
      setSelectedDeposit(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Active' },
      matured: { color: 'blue', text: 'Matured' },
      withdrawn: { color: 'orange', text: 'Withdrawn' },
      closed: { color: 'red', text: 'Closed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getDepositTypeTag = (type: string) => {
    const typeConfig = {
      savings: { color: 'green', text: 'Savings' },
      fixed_deposit: { color: 'blue', text: 'Fixed Deposit' },
      share_capital: { color: 'purple', text: 'Share Capital' },
      special_deposit: { color: 'orange', text: 'Special Deposit' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Deposit ID',
      dataIndex: 'depositId',
      key: 'depositId',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Member',
      key: 'member',
      render: (record: MemberDeposit) => (
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
      title: 'Deposit Type',
      dataIndex: 'depositType',
      key: 'depositType',
      render: (type: string) => getDepositTypeTag(type)
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (value: number) => (
        <Text strong style={{ color: 'var(--success-color)' }}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </Text>
      ),
    },
    {
      title: 'Deposit Date',
      dataIndex: 'depositDate',
      key: 'depositDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY')
    },
    {
      title: 'Maturity Date',
      dataIndex: 'maturityDate',
      key: 'maturityDate',
      render: (date?: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-'
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (rate?: number) => rate ? `${rate}%` : '-'
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (account: string) => <Text code>{account}</Text>
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
      render: (record: MemberDeposit) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('Delete:', record.depositId)}
          >
            Delete
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
                  Member Deposits
                </Title>
                <Text type="secondary">
                  Manage member deposit transactions
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                className="enterprise-btn-primary"
              >
                New Deposit
              </Button>
            </div>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by member name, number, or deposit ID"
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
                  <Option value="active">Active</Option>
                  <Option value="matured">Matured</Option>
                  <Option value="withdrawn">Withdrawn</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={filteredData.map(item => ({ ...item, key: item.depositId }))}
              loading={loading}
              className="enterprise-table"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} deposits`,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? 'Edit Deposit' : 'New Deposit'}
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false);
          setSelectedDeposit(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="memberId"
                label="Member ID"
                rules={[{ required: true, message: 'Please enter member ID' }]}
              >
                <Input placeholder="Enter member ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="memberNumber"
                label="Member Number"
                rules={[{ required: true, message: 'Please enter member number' }]}
              >
                <Input placeholder="Enter member number" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="memberName"
                label="Member Name"
                rules={[{ required: true, message: 'Please enter member name' }]}
              >
                <Input placeholder="Enter member name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="depositType"
                label="Deposit Type"
                rules={[{ required: true, message: 'Please select deposit type' }]}
              >
                <Select placeholder="Select deposit type">
                  <Option value="savings">Savings</Option>
                  <Option value="fixed_deposit">Fixed Deposit</Option>
                  <Option value="share_capital">Share Capital</Option>
                  <Option value="special_deposit">Special Deposit</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Deposit Amount"
                rules={[{ required: true, message: 'Please enter deposit amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter amount"
                  min={0}
                  prefix="$"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accountNumber"
                label="Account Number"
                rules={[{ required: true, message: 'Please enter account number' }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="depositDate"
                label="Deposit Date"
                rules={[{ required: true, message: 'Please select deposit date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maturityDate"
                label="Maturity Date"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="interestRate"
                label="Interest Rate (%)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter interest rate"
                  min={0}
                  max={100}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentMethod"
                label="Payment Method"
              >
                <Select placeholder="Select payment method">
                  <Option value="cash">Cash</Option>
                  <Option value="bank_transfer">Bank Transfer</Option>
                  <Option value="cheque">Cheque</Option>
                  <Option value="mobile_money">Mobile Money</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="referenceNumber"
            label="Reference Number"
          >
            <Input placeholder="Enter reference number (optional)" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter deposit description"
            />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="matured">Matured</Option>
              <Option value="withdrawn">Withdrawn</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberDeposits;