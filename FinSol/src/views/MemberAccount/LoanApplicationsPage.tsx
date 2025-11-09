import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  message,
  Spin
} from 'antd';
import { useNavigate } from 'react-router-dom'; 
import { 
  PlusOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import LoanApplicationsTable from '../../components/LoanApplicationsTable';

const { Title } = Typography;

interface LoanApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const LoanApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<LoanApplicationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to fetch loan application statistics
      // const response = await fetchLoanApplicationStats();
      // Mock data for now
      setStats({
        total: 45,
        pending: 12,
        approved: 28,
        rejected: 5
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoanApplication = () => {
    navigate('/create-loan-application'); 
  };

  const handleRefresh = () => {
    fetchStats();
    message.success('Data refreshed successfully');
  };

  return (
    <div className="page-container">
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Applications"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: 'var(--primary-color)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending Review"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: 'var(--warning-color)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'var(--success-color)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Rejected"
              value={stats.rejected}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: 'var(--error-color)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="enterprise-card">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Loan Applications Management
            </Title>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
              Manage member loan applications, review, approve or reject applications
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className="action-button"
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateLoanApplication}
              className="primary-button"
            >
              New Application
            </Button>
          </div>
        </div>

        {/* Table Component */}
        <Spin spinning={loading}>
          <LoanApplicationsTable />
        </Spin>
      </Card>
    </div>
  );
};

export default LoanApplicationsPage;
