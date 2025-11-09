import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Row, Col, Tag, Input, DatePicker, Modal, Form, InputNumber, Select } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface ShareCapital {
  key: string;
  transactionId: string;
  memberName: string;
  memberNumber: string;
  shareType: string;
  numberOfShares: number;
  pricePerShare: number;
  totalValue: number;
  transactionDate: string;
  transactionType: 'purchase' | 'sale' | 'transfer';
  referenceNumber?: string;
  description?: string;
  processedBy: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const MemberShareCapital: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ShareCapital[]>([]);
  const [filteredData, setFilteredData] = useState<ShareCapital[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShare, setSelectedShare] = useState<ShareCapital | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchShareCapital();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter(item =>
        item.memberName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.memberNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.transactionId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.transactionType === typeFilter);
    }

    setFilteredData(filtered);
  }, [data, searchText, statusFilter, typeFilter]);

  const fetchShareCapital = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: ShareCapital[] = [
        {
          key: '1',
          transactionId: 'SHR-2024-001',
          memberName: 'John Doe',
          memberNumber: 'MEM001',
          shareType: 'Ordinary Shares',
          numberOfShares: 100,
          pricePerShare: 50,
          totalValue: 5000,
          transactionDate: '2024-01-20',
          transactionType: 'purchase',
          referenceNumber: 'SHR123456',
          description: 'Initial share purchase',
          processedBy: 'Share Registrar',
          status: 'confirmed'
        },
        {
          key: '2',
          transactionId: 'SHR-2024-002',
          memberName: 'Jane Smith',
          memberNumber: 'MEM002',
          shareType: 'Preference Shares',
          numberOfShares: 200,
          pricePerShare: 75,
          totalValue: 15000,
          transactionDate: '2024-01-21',
          transactionType: 'purchase',
          description: 'Additional share investment',
          processedBy: 'Share Registrar',
          status: 'confirmed'
        },
        {
          key: '3',
          transactionId: 'SHR-2024-003',
          memberName: 'Mike Johnson',
          memberNumber: 'MEM003',
          shareType: 'Ordinary Shares',
          numberOfShares: 50,
          pricePerShare: 55,
          totalValue: 2750,
          transactionDate: '2024-01-22',
          transactionType: 'sale',
          referenceNumber: 'SHR789012',
          description: 'Partial share sale',
          processedBy: 'Share Registrar',
          status: 'pending'
        }
      ];
      
      setData(mockData);
    } catch (error) {
      console.error('Error fetching share capital:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleCreate = () => {
    setSelectedShare(null);
    setIsEditing(false);
    form.resetFields();
    form.setFieldsValue({
      transactionDate: dayjs(),
      transactionType: 'purchase',
      status: 'confirmed',
      pricePerShare: 50
    });
    setModalVisible(true);
  };

  const handleEdit = (record: ShareCapital) => {
    setSelectedShare(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      transactionDate: dayjs(record.transactionDate)
    });
    setModalVisible(true);
  };

  const calculateTotalValue = () => {
    const numberOfShares = form.getFieldValue('numberOfShares') || 0;
    const pricePerShare = form.getFieldValue('pricePerShare') || 0;
    const totalValue = numberOfShares * pricePerShare;
    form.setFieldsValue({ totalValue });
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        transactionDate: values.transactionDate.format('YYYY-MM-DD'),
        totalValue: values.numberOfShares * values.pricePerShare,
        transactionId: selectedShare ? selectedShare.transactionId : `SHR-2024-${String(data.length + 1).padStart(3, '0')}`,
        processedBy: 'Current User' // Replace with actual user
      };
      
      if (isEditing && selectedShare) {
        // Update existing share transaction
        const updatedData = data.map(item => 
          item.key === selectedShare.key 
            ? { ...item, ...formattedValues }
            : item
        );
        setData(updatedData);
      } else {
        // Create new share transaction
        const newShare: ShareCapital = {
          key: String(data.length + 1),
          ...formattedValues
        };
        setData([...data, newShare]);
      }
      
      setModalVisible(false);
      setSelectedShare(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Pending' },
      confirmed: { color: 'green', text: 'Confirmed' },
      cancelled: { color: 'red', text: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeConfig = {
      purchase: { color: 'green', text: 'Purchase' },
      sale: { color: 'red', text: 'Sale' },
      transfer: { color: 'blue', text: 'Transfer' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Member',
      key: 'member',
      render: (record: ShareCapital) => (
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
      title: 'Share Type',
      dataIndex: 'shareType',
      key: 'shareType',
    },
    {
      title: 'Shares',
      key: 'shares',
      align: 'center' as const,
      render: (record: ShareCapital) => (
        <div>
          <Text strong>{record.numberOfShares.toLocaleString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            @ {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(record.pricePerShare)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
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
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY')
    },
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type: string) => getTypeTag(type)
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
      render: (record: ShareCapital) => (
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
            onClick={() => console.log('Delete:', record.transactionId)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const totalShares = filteredData.reduce((sum, item) => 
    item.transactionType === 'purchase' ? sum + item.numberOfShares : sum - item.numberOfShares, 0
  );
  const totalValue = filteredData.reduce((sum, item) => 
    item.transactionType === 'purchase' ? sum + item.totalValue : sum - item.totalValue, 0
  );

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                  Member Share Capital
                </Title>
                <Text type="secondary">
                  Manage member share capital transactions
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                className="enterprise-btn-primary"
              >
                New Transaction
              </Button>
            </div>
            
            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12}>
                <Card className="metrics-card">
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                      Total Shares Outstanding
                    </Text>
                    <Title level={3} style={{ margin: 0, color: 'var(--primary-color)' }}>
                      {totalShares.toLocaleString()}
                    </Title>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="metrics-card">
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                      Total Share Value
                    </Text>
                    <Title level={3} style={{ margin: 0, color: 'var(--success-color)' }}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(totalValue)}
                    </Title>
                  </div>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search by member name, number, or transaction ID"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: '100%' }}
                  placeholder="Filter by status"
                >
                  <Option value="all">All Status</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: '100%' }}
                  placeholder="Filter by type"
                >
                  <Option value="all">All Types</Option>
                  <Option value="purchase">Purchase</Option>
                  <Option value="sale">Sale</Option>
                  <Option value="transfer">Transfer</Option>
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
                  `${range[0]}-${range[1]} of ${total} transactions`,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? 'Edit Share Transaction' : 'New Share Transaction'}
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false);
          setSelectedShare(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="memberNumber"
                label="Member Number"
                rules={[{ required: true, message: 'Please enter member number' }]}
              >
                <Input placeholder="Enter member number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="memberName"
                label="Member Name"
                rules={[{ required: true, message: 'Please enter member name' }]}
              >
                <Input placeholder="Enter member name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="shareType"
                label="Share Type"
                rules={[{ required: true, message: 'Please select share type' }]}
              >
                <Select placeholder="Select share type">
                  <Option value="Ordinary Shares">Ordinary Shares</Option>
                  <Option value="Preference Shares">Preference Shares</Option>
                  <Option value="Cumulative Preference">Cumulative Preference</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="transactionType"
                label="Transaction Type"
                rules={[{ required: true, message: 'Please select transaction type' }]}
              >
                <Select placeholder="Select transaction type">
                  <Option value="purchase">Purchase</Option>
                  <Option value="sale">Sale</Option>
                  <Option value="transfer">Transfer</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="numberOfShares"
                label="Number of Shares"
                rules={[{ required: true, message: 'Please enter number of shares' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter shares"
                  min={1}
                  onChange={calculateTotalValue}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pricePerShare"
                label="Price per Share"
                rules={[{ required: true, message: 'Please enter price per share' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter price"
                  min={0}
                  prefix="$"
                  onChange={calculateTotalValue}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalValue"
                label="Total Value"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Auto calculated"
                  prefix="$"
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="transactionDate"
                label="Transaction Date"
                rules={[{ required: true, message: 'Please select transaction date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="pending">Pending</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="cancelled">Cancelled</Option>
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
              placeholder="Enter transaction description"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberShareCapital;