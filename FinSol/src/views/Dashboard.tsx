// src/components/Dashboard.tsx
import React from 'react';
import { Layout, Card, Col, Row, Statistic } from 'antd';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const { Content } = Layout;

// Dummy data for the charts
const pieData = {
  labels: ['Male', 'Female'],
  datasets: [
    {
      label: 'Gender Distribution',
      data: [400, 300],
      backgroundColor: ['#0088FE', '#FF8042'],
    },
  ],
};

// Options for Pie chart
const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}`,
      },
    },
  },
};

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <Content style={{ padding: '20px', background: '#fff' }}>
        <Row gutter={16}>
          {/* Loans Issued */}
          <Col span={6}>
            <Card>
              <Statistic title="Loans Issued" value={1128} />
            </Card>
          </Col>

          {/* Repaid Loans */}
          <Col span={6}>
            <Card>
              <Statistic title="Repaid Loans" value={934} />
            </Card>
          </Col>

          {/* Pending Disbursements */}
          <Col span={6}>
            <Card>
              <Statistic title="Pending Disbursements" value={201} />
            </Card>
          </Col>

          {/* Members */}
          <Col span={6}>
            <Card>
              <Statistic title="Total Members" value={200} />
              <div style={{ marginTop: 16, width: '100%', height: '300px' }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          {/* Active Members */}
          <Col span={12}>
            <Card>
              <Statistic title="Active Members" value={180} />
            </Card>
          </Col>

          {/* Total Loans */}
          <Col span={12}>
            <Card>
              <Statistic title="Total Loans" value={350} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
