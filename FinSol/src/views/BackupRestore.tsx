import React from 'react';
import { Card, Typography, Button, Row, Col, Alert, Space } from 'antd';
import { DatabaseOutlined, DownloadOutlined, UploadOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BackupRestore: React.FC = () => {
  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                <DatabaseOutlined style={{ marginRight: 8 }} />
                Backup & Restore
              </Title>
              <Text type="secondary">
                Manage database backups and restore operations
              </Text>
            </div>
            
            <Alert
              message="Backup Status"
              description="Last backup was completed successfully on 2024-01-22 at 02:00:00"
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Create Backup" className="enterprise-card">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>Create a new backup of the system database</Text>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      size="large"
                      className="enterprise-btn-primary"
                      style={{ width: '100%' }}
                    >
                      Create Backup
                    </Button>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card title="Restore Database" className="enterprise-card">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>Restore database from a backup file</Text>
                    <Button
                      icon={<UploadOutlined />}
                      size="large"
                      style={{ width: '100%' }}
                    >
                      Select Backup File
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card title="Backup History" className="enterprise-table">
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <ClockCircleOutlined style={{ fontSize: '48px', color: 'var(--text-muted)' }} />
                    <div style={{ marginTop: '16px' }}>
                      <Text type="secondary">Backup history will appear here</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BackupRestore;