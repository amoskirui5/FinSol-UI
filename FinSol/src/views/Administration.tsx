import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Space, Table, Progress, Alert } from 'antd';
import { 
  DatabaseOutlined, 
  UserOutlined, 
  SecurityScanOutlined,
  BugOutlined,
  MonitorOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface SystemStat {
  label: string;
  value: number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
}

interface SystemLog {
  key: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  module: string;
}

const Administration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStat[]>([]);
  const [recentLogs, setRecentLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock system statistics
      setSystemStats([
        { label: 'CPU Usage', value: 65, unit: '%', status: 'normal' },
        { label: 'Memory Usage', value: 78, unit: '%', status: 'warning' },
        { label: 'Disk Usage', value: 45, unit: '%', status: 'normal' },
        { label: 'Active Users', value: 24, status: 'normal' },
        { label: 'Database Size', value: 2.4, unit: 'GB', status: 'normal' },
        { label: 'Backup Status', value: 100, unit: '%', status: 'normal' }
      ]);

      // Mock recent logs
      setRecentLogs([
        {
          key: '1',
          timestamp: '2024-01-22 14:30:25',
          level: 'info',
          message: 'User login successful',
          module: 'Authentication'
        },
        {
          key: '2',
          timestamp: '2024-01-22 14:25:10',
          level: 'warning',
          message: 'High memory usage detected',
          module: 'System Monitor'
        },
        {
          key: '3',
          timestamp: '2024-01-22 14:20:05',
          level: 'error',
          message: 'Database connection timeout',
          module: 'Database'
        },
        {
          key: '4',
          timestamp: '2024-01-22 14:15:30',
          level: 'info',
          message: 'Backup completed successfully',
          module: 'Backup Service'
        }
      ]);
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'var(--success-color)';
      case 'warning': return 'var(--warning-color)';
      case 'critical': return 'var(--error-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const getLevelTag = (level: string) => {
    const levelConfig = {
      info: { color: 'blue', text: 'INFO' },
      warning: { color: 'orange', text: 'WARNING' },
      error: { color: 'red', text: 'ERROR' }
    };
    return levelConfig[level as keyof typeof levelConfig];
  };

  const logColumns = [
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
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const config = getLevelTag(level);
        return (
          <span 
            style={{ 
              padding: '2px 8px', 
              borderRadius: '4px', 
              backgroundColor: `var(--${config.color}-color)`,
              color: 'white',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
          >
            {config.text}
          </span>
        );
      }
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text: string) => <Text>{text}</Text>
    }
  ];

  const adminActions = [
    { 
      icon: <DatabaseOutlined />, 
      title: 'Database Maintenance', 
      description: 'Optimize and maintain database performance',
      action: () => console.log('Database maintenance')
    },
    { 
      icon: <UserOutlined />, 
      title: 'User Management', 
      description: 'Manage user accounts and permissions',
      action: () => console.log('User management')
    },
    { 
      icon: <SecurityScanOutlined />, 
      title: 'Security Scan', 
      description: 'Run security vulnerability scan',
      action: () => console.log('Security scan')
    },
    { 
      icon: <BugOutlined />, 
      title: 'System Diagnostics', 
      description: 'Check system health and performance',
      action: () => console.log('System diagnostics')
    }
  ];

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                  System Administration
                </Title>
                <Text type="secondary">
                  Monitor and manage system resources and operations
                </Text>
              </div>
              <Button
                type="primary"
                icon={<MonitorOutlined />}
                onClick={fetchSystemData}
                loading={loading}
                className="enterprise-btn-primary"
              >
                Refresh Status
              </Button>
            </div>
          </Card>
        </Col>

        {/* System Statistics */}
        <Col span={24}>
          <Title level={4} style={{ marginBottom: 16, color: 'var(--primary-color)' }}>
            System Statistics
          </Title>
          <Row gutter={[16, 16]}>
            {systemStats.map((stat, index) => (
              <Col xs={24} sm={12} md={8} lg={4} key={index}>
                <Card className="metrics-card">
                  <Statistic
                    title={stat.label}
                    value={stat.value}
                    suffix={stat.unit}
                    valueStyle={{ 
                      color: getStatusColor(stat.status),
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}
                  />
                  {stat.unit === '%' && (
                    <Progress
                      percent={stat.value}
                      showInfo={false}
                      strokeColor={getStatusColor(stat.status)}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Quick Actions */}
        <Col span={24}>
          <Title level={4} style={{ marginBottom: 16, color: 'var(--primary-color)' }}>
            Quick Actions
          </Title>
          <Row gutter={[16, 16]}>
            {adminActions.map((action, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card 
                  className="enterprise-card"
                  hoverable
                  style={{ height: '100%', cursor: 'pointer' }}
                  onClick={action.action}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      color: 'var(--primary-color)', 
                      marginBottom: '12px' 
                    }}>
                      {action.icon}
                    </div>
                    <Title level={5} style={{ margin: '8px 0' }}>
                      {action.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {action.description}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* System Alerts */}
        <Col span={24}>
          <Title level={4} style={{ marginBottom: 16, color: 'var(--primary-color)' }}>
            System Alerts
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="System Performance"
              description="Memory usage is approaching 80%. Consider reviewing running processes."
              type="warning"
              showIcon
              action={
                <Button size="small" type="text">
                  View Details
                </Button>
              }
            />
            <Alert
              message="Backup Status"
              description="Last backup completed successfully at 2024-01-22 02:00:00"
              type="success"
              showIcon
            />
          </Space>
        </Col>

        {/* Recent System Logs */}
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Recent System Logs
              </div>
            }
            className="enterprise-table"
          >
            <Table
              columns={logColumns}
              dataSource={recentLogs}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="link">View All Logs</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Administration;