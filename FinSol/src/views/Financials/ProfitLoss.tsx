import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, Space, Typography, Row, Col, Spin } from 'antd';
import { CalendarOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ProfitLossItem {
  key: string;
  accountName: string;
  accountCode: string;
  currentPeriod: number;
  previousPeriod: number;
  variance: number;
  variancePercent: number;
}

const ProfitLoss: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('year'),
    dayjs()
  ]);

  const [revenueData, setRevenueData] = useState<ProfitLossItem[]>([]);
  const [expenseData, setExpenseData] = useState<ProfitLossItem[]>([]);

  useEffect(() => {
    fetchProfitLossData();
  }, [dateRange]);

  const fetchProfitLossData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRevenueData([
        {
          key: '1',
          accountName: 'Interest Income',
          accountCode: '4001',
          currentPeriod: 125000,
          previousPeriod: 110000,
          variance: 15000,
          variancePercent: 13.6
        },
        {
          key: '2',
          accountName: 'Service Fees',
          accountCode: '4002',
          currentPeriod: 45000,
          previousPeriod: 38000,
          variance: 7000,
          variancePercent: 18.4
        },
        {
          key: '3',
          accountName: 'Other Income',
          accountCode: '4003',
          currentPeriod: 12000,
          previousPeriod: 15000,
          variance: -3000,
          variancePercent: -20.0
        }
      ]);

      setExpenseData([
        {
          key: '1',
          accountName: 'Staff Salaries',
          accountCode: '5001',
          currentPeriod: 80000,
          previousPeriod: 75000,
          variance: 5000,
          variancePercent: 6.7
        },
        {
          key: '2',
          accountName: 'Office Rent',
          accountCode: '5002',
          currentPeriod: 24000,
          previousPeriod: 24000,
          variance: 0,
          variancePercent: 0
        },
        {
          key: '3',
          accountName: 'Utilities',
          accountCode: '5003',
          currentPeriod: 8000,
          previousPeriod: 7500,
          variance: 500,
          variancePercent: 6.7
        }
      ]);
    } catch (error) {
      console.error('Error fetching profit and loss data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (text: string, record: ProfitLossItem) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.accountCode}
          </Text>
        </div>
      ),
    },
    {
      title: 'Current Period',
      dataIndex: 'currentPeriod',
      key: 'currentPeriod',
      align: 'right' as const,
      render: (value: number) => (
        <Text style={{ fontWeight: 500 }}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </Text>
      ),
    },
    {
      title: 'Previous Period',
      dataIndex: 'previousPeriod',
      key: 'previousPeriod',
      align: 'right' as const,
      render: (value: number) => (
        <Text type="secondary">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </Text>
      ),
    },
    {
      title: 'Variance',
      dataIndex: 'variance',
      key: 'variance',
      align: 'right' as const,
      render: (value: number, record: ProfitLossItem) => (
        <div>
          <Text type={value >= 0 ? 'success' : 'danger'} style={{ fontWeight: 500 }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              signDisplay: 'always',
            }).format(value)}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ({record.variancePercent > 0 ? '+' : ''}{record.variancePercent.toFixed(1)}%)
          </Text>
        </div>
      ),
    },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.currentPeriod, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.currentPeriod, 0);
  const netIncome = totalRevenue - totalExpenses;

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting profit & loss as ${format}`);
    // Implement export functionality
  };

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                  Profit & Loss Statement
                </Title>
                <Text type="secondary">
                  View income and expenses for the selected period
                </Text>
              </div>
              <Space>
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined />}
                />
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => handleExport('excel')}
                >
                  Excel
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => handleExport('pdf')}
                >
                  PDF
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Spin spinning={loading}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Revenue Section */}
              <Card 
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '16px', color: 'var(--primary-color)' }}>
                      REVENUE
                    </Text>
                    <Text strong style={{ fontSize: '16px', color: 'var(--success-color)' }}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(totalRevenue)}
                    </Text>
                  </div>
                }
                className="enterprise-table"
              >
                <Table
                  columns={columns}
                  dataSource={revenueData}
                  pagination={false}
                  size="middle"
                />
              </Card>

              {/* Expenses Section */}
              <Card 
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '16px', color: 'var(--primary-color)' }}>
                      EXPENSES
                    </Text>
                    <Text strong style={{ fontSize: '16px', color: 'var(--error-color)' }}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(totalExpenses)}
                    </Text>
                  </div>
                }
                className="enterprise-table"
              >
                <Table
                  columns={columns}
                  dataSource={expenseData}
                  pagination={false}
                  size="middle"
                />
              </Card>

              {/* Net Income Summary */}
              <Card className="enterprise-card">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                        Total Revenue
                      </Text>
                      <Title level={3} style={{ margin: 0, color: 'var(--success-color)' }}>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(totalRevenue)}
                      </Title>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                        Total Expenses
                      </Text>
                      <Title level={3} style={{ margin: 0, color: 'var(--error-color)' }}>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(totalExpenses)}
                      </Title>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                        Net Income
                      </Text>
                      <Title 
                        level={3} 
                        style={{ 
                          margin: 0, 
                          color: netIncome >= 0 ? 'var(--success-color)' : 'var(--error-color)' 
                        }}
                      >
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          signDisplay: 'always',
                        }).format(netIncome)}
                      </Title>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default ProfitLoss;