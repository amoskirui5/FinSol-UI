import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Row, Col, Input, DatePicker, Tag } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AccessLog {
  key: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
}

const AccessLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AccessLog[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  const fetchAccessLogs = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockData: AccessLog[] = [
        {
          key: '1',
          timestamp: '2024-01-22 14:30:25',
          userId: 'USER001',
          username: 'john.doe',
          action: 'Login',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success'
        },
        {
          key: '2',
          timestamp: '2024-01-22 14:25:10',
          userId: 'USER002',
          username: 'jane.smith',
          action: 'Failed Login Attempt',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'failed'
        }
      ];
      setData(mockData);
    } catch (error) {
      console.error('Error fetching access logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text>
    },
    {
      title: 'User',
      key: 'user',
      render: (record: AccessLog) => (
        <div>
          <Text strong>{record.username}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.userId}</Text>
        </div>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action'
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (text: string) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <EyeOutlined style={{ marginRight: 8 }} />
                Access Logs
              </Title>
              <Text type="secondary">
                Monitor user access and authentication events
              </Text>
            </div>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by username or action"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <RangePicker style={{ width: '100%' }} />
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              className="enterprise-table"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} logs`
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccessLogs;