// src/components/Dashboard.tsx
import React from 'react';
import { Layout, Card, Col, Row, Statistic, Progress, Typography, Space, Button } from 'antd';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  DollarOutlined,
  BankOutlined
} from '@ant-design/icons';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const { Content } = Layout;

// Dummy data for the charts
const memberGenderData = {
  labels: ['Male', 'Female'],
  datasets: [
    {
      label: 'Gender Distribution',
      data: [400, 300],
      backgroundColor: ['#1a365d', '#00a4df'],
      borderWidth: 0,
      hoverOffset: 10,
    },
  ],
};

const loanTrendsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Loan Applications',
      data: [65, 78, 90, 81, 56, 89],
      borderColor: '#1a365d',
      backgroundColor: 'rgba(26, 54, 93, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Disbursements',
      data: [28, 48, 70, 60, 42, 68],
      borderColor: '#00a4df',
      backgroundColor: 'rgba(0, 164, 223, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
    },
  ],
};

const monthlyCollectionsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Collections (KSH)',
      data: [1200000, 1900000, 1500000, 2100000, 1800000, 2300000],
      backgroundColor: [
        'rgba(26, 54, 93, 0.8)',
        'rgba(44, 82, 130, 0.8)',
        'rgba(49, 130, 206, 0.8)',
        'rgba(0, 164, 223, 0.8)',
        'rgba(79, 179, 212, 0.8)',
        'rgba(144, 205, 244, 0.8)',
      ],
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

// Chart options
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
          weight: 'normal' as const,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(26, 54, 93, 0.9)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#1a365d',
      borderWidth: 1,
      cornerRadius: 8,
    },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
          weight: 'normal' as const,
        },
      },
    },
    title: {
      display: true,
      text: 'Loan Trends (Last 6 Months)',
      font: {
        size: 16,
        weight: 'bold' as const,
      },
      color: '#1a365d',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#4a5568',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#4a5568',
      },
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Monthly Collections (KSH)',
      font: {
        size: 16,
        weight: 'bold' as const,
      },
      color: '#1a365d',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#4a5568',
        callback: function(value: any) {
          return 'KSH ' + (value / 1000000).toFixed(1) + 'M';
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: '#4a5568',
      },
    },
  },
};

const Dashboard: React.FC = () => {
  return (
    <Layout style={{ background: 'var(--background-primary)' }}>
      <Content style={{ padding: '24px', background: 'transparent' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <Typography.Title 
            level={2} 
            style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '8px',
              fontWeight: 600
            }}
          >
            Dashboard Overview
          </Typography.Title>
          <Typography.Text 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '16px' 
            }}
          >
            Welcome to your financial management dashboard
          </Typography.Text>
        </div>

        {/* Key Metrics Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metrics-card" hoverable>
              <Statistic
                title="Total Members"
                value={1200}
                prefix={<UserOutlined style={{ color: 'var(--primary-color)' }} />}
                valueStyle={{ 
                  color: 'var(--primary-color)', 
                  fontWeight: 700,
                  fontSize: '32px' 
                }}
                suffix={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <ArrowUpOutlined style={{ color: 'var(--success-color)', fontSize: '12px' }} />
                    <Typography.Text style={{ color: 'var(--success-color)', fontSize: '12px' }}>
                      +12.5%
                    </Typography.Text>
                  </div>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="metrics-card" hoverable>
              <Statistic
                title="Active Loans"
                value={350}
                prefix={<DollarOutlined style={{ color: 'var(--accent-color)' }} />}
                valueStyle={{ 
                  color: 'var(--accent-color)', 
                  fontWeight: 700,
                  fontSize: '32px' 
                }}
                suffix={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <ArrowUpOutlined style={{ color: 'var(--success-color)', fontSize: '12px' }} />
                    <Typography.Text style={{ color: 'var(--success-color)', fontSize: '12px' }}>
                      +8.3%
                    </Typography.Text>
                  </div>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="metrics-card" hoverable>
              <Statistic
                title="Total Deposits"
                value={2450000}
                prefix={<BankOutlined style={{ color: 'var(--success-color)' }} />}
                formatter={(value) => `KSH ${(Number(value) / 1000000).toFixed(2)}M`}
                valueStyle={{ 
                  color: 'var(--success-color)', 
                  fontWeight: 700,
                  fontSize: '32px' 
                }}
                suffix={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <ArrowUpOutlined style={{ color: 'var(--success-color)', fontSize: '12px' }} />
                    <Typography.Text style={{ color: 'var(--success-color)', fontSize: '12px' }}>
                      +15.2%
                    </Typography.Text>
                  </div>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="metrics-card" hoverable>
              <Statistic
                title="Pending Applications"
                value={23}
                prefix={<ArrowUpOutlined style={{ color: 'var(--warning-color)' }} />}
                valueStyle={{ 
                  color: 'var(--warning-color)', 
                  fontWeight: 700,
                  fontSize: '32px' 
                }}
                suffix={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <ArrowDownOutlined style={{ color: 'var(--error-color)', fontSize: '12px' }} />
                    <Typography.Text style={{ color: 'var(--error-color)', fontSize: '12px' }}>
                      -5.1%
                    </Typography.Text>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Charts and Analytics Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} lg={8}>
            <Card 
              className="enterprise-card" 
              title={
                <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
                  Member Distribution
                </Typography.Title>
              }
              hoverable
            >
              <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={memberGenderData} options={pieOptions} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card 
              className="enterprise-card" 
              title={
                <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
                  Loan Performance Trends
                </Typography.Title>
              }
              hoverable
            >
              <div style={{ height: '320px' }}>
                <Line data={loanTrendsData} options={lineOptions} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Additional Metrics Row */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card 
              className="enterprise-card" 
              title={
                <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
                  Monthly Collections Performance
                </Typography.Title>
              }
              hoverable
            >
              <div style={{ height: '320px' }}>
                <Bar data={monthlyCollectionsData} options={barOptions} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card className="enterprise-card" hoverable>
                <Statistic
                  title="Collection Rate"
                  value={94.5}
                  suffix="%"
                  valueStyle={{ color: 'var(--success-color)', fontWeight: 700, fontSize: '28px' }}
                />
                <Progress
                  percent={94.5}
                  strokeColor={{
                    '0%': 'var(--success-color)',
                    '100%': 'var(--success-light)',
                  }}
                  trailColor="var(--border-light)"
                  strokeWidth={8}
                  style={{ marginTop: '16px' }}
                />
              </Card>

              <Card className="enterprise-card" hoverable>
                <Statistic
                  title="Default Rate"
                  value={2.1}
                  suffix="%"
                  valueStyle={{ color: 'var(--error-color)', fontWeight: 700, fontSize: '28px' }}
                />
                <Progress
                  percent={2.1}
                  strokeColor={{
                    '0%': 'var(--error-color)',
                    '100%': 'var(--error-light)',
                  }}
                  trailColor="var(--border-light)"
                  strokeWidth={8}
                  style={{ marginTop: '16px' }}
                />
              </Card>

              <Card className="enterprise-card" hoverable>
                <div style={{ textAlign: 'center' }}>
                  <Typography.Title 
                    level={4} 
                    style={{ 
                      color: 'var(--text-primary)', 
                      marginBottom: '16px' 
                    }}
                  >
                    Quick Actions
                  </Typography.Title>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      style={{ width: '100%' }}
                      className="enterprise-btn-primary"
                    >
                      New Member Registration
                    </Button>
                    <Button 
                      size="large" 
                      style={{ width: '100%' }}
                      className="enterprise-btn-secondary"
                    >
                      Process Loan Application
                    </Button>
                    <Button 
                      size="large" 
                      style={{ width: '100%' }}
                      className="enterprise-btn-secondary"
                    >
                      Generate Reports
                    </Button>
                  </Space>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
