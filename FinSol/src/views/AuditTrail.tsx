import React from 'react';
import { Card, Typography, Table, Tag, Input, DatePicker, Row, Col } from 'antd';
import { AuditOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AuditLog {
  key: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  result: 'success' | 'failed' | 'warning';
}

const AuditTrail: React.FC = () => {
  const mockData: AuditLog[] = [
    {
      key: '1',
      timestamp: '2024-01-22 14:30:25',
      userId: 'USER001',
      username: 'john.doe',
      action: 'LOGIN',
      resource: 'Authentication',
      details: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      result: 'success'
    },
    {
      key: '2',
      timestamp: '2024-01-22 14:25:10',
      userId: 'USER002',
      username: 'jane.smith',
      action: 'CREATE_LOAN',
      resource: 'Loan Application',
      details: 'Created loan application LA-2024-005',
      ipAddress: '192.168.1.101',
      result: 'success'
    },
    {
      key: '3',
      timestamp: '2024-01-22 14:20:05',
      userId: 'USER003',
      username: 'admin',
      action: 'DELETE_USER',
      resource: 'User Management',
      details: 'Attempted to delete user account',
      ipAddress: '192.168.1.102',
      result: 'failed'
    }
  ];

  const getResultTag = (result: string) => {
    const config = {
      success: { color: 'green', text: 'SUCCESS' },
      failed: { color: 'red', text: 'FAILED' },
      warning: { color: 'orange', text: 'WARNING' }
    };
    const resultConfig = config[result as keyof typeof config];
    return <Tag color={resultConfig.color}>{resultConfig.text}</Tag>;
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (text: string) => (
        <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>{text}</Text>
      )
    },
    {
      title: 'User',
      key: 'user',
      width: 150,
      render: (record: AuditLog) => (
        <div>
          <Text strong>{record.username}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.userId}</Text>
        </div>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (text: string) => (
        <Tag style={{ fontFamily: 'monospace', fontSize: '11px' }}>{text}</Tag>
      )
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 150
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (text: string) => (
        <Text style={{ fontSize: '12px' }}>{text}</Text>
      )
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (text: string) => (
        <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>{text}</Text>
      )
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => getResultTag(result)
    }
  ];

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <AuditOutlined style={{ marginRight: 8 }} />
                Audit Trail
              </Title>
              <Text type="secondary">
                Track all system activities and user actions
              </Text>
            </div>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search by user or action"
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={8}>
                <RangePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder={['Start Date', 'End Date']}
                />
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={mockData}
              className="enterprise-table"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} audit entries`
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuditTrail;