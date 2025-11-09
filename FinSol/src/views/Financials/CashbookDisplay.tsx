import React, { useEffect, useState } from "react";
import { Select, DatePicker, Button, Form, Table, Switch, message, Card, Row, Col, Typography, Space } from "antd";
import { WalletOutlined, FileExcelOutlined, FilePdfOutlined, CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import { CashbookRecord } from "../../types/Financials/FinancialTypes";
import { ChartOfAccount } from "../../types/Accounting/accountingTypes";
import { getChartOfAccounts } from "../../services/chartOfAccountsService";
import { fetchCashBook } from "../../services/financialStatement";
import { formatDate } from "../../helpers/dateFormater";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface FormValues {
  accountId: string;
  dateRange: [Dayjs | null, Dayjs | null];
}

const CashbookDisplay: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [cashbookData, setCashbookData] = useState<CashbookRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [useFinancialYear, setUseFinancialYear] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const accountData = await getChartOfAccounts();
    if (accountData.success) {
      setAccounts(accountData.data);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const { accountId, dateRange } = values;
    const startDate = dateRange?.[0]?.toISOString() || null;
    const endDate = dateRange?.[1]?.toISOString() || null;

    if (!useFinancialYear) {
      if (!dateRange?.[0] || !dateRange?.[1]) {
        message.error("Please select a start and end date.");
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetchCashBook(accountId, startDate, endDate);

      if (response.success) {
        setCashbookData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch cashbook data:', error);
      message.error("Failed to fetch cashbook data");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: CashbookRecord) => {
    message.info(`Transaction: ${record.transactionId}`);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    console.debug(`Exporting cashbook as ${format}`);
    // Implement export functionality
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate summary data
  const totalDebit = cashbookData.reduce((sum, record) => sum + record.debit, 0);
  const totalCredit = cashbookData.reduce((sum, record) => sum + record.credit, 0);
  const netBalance = totalDebit - totalCredit;

  const columns: ColumnsType<CashbookRecord> = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (value) => (
        <Text strong>{formatDate(value)}</Text>
      ),
      sorter: (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime(),
    },
    {
      title: "Transaction Description",
      dataIndex: "transactionDescription",
      key: "transactionDescription",
      ellipsis: true,
      render: (text: string) => (
        <Text style={{ color: 'var(--text-primary)' }}>{text}</Text>
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      align: 'right',
      render: (value: number) => (
        value > 0 ? (
          <Text style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>
            {formatCurrency(value)}
          </Text>
        ) : null
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      align: 'right',
      render: (value: number) => (
        value > 0 ? (
          <Text style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
            {formatCurrency(value)}
          </Text>
        ) : null
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      align: 'right',
      render: (value: number) => (
        <Text style={{ 
          color: value >= 0 ? 'var(--success-color)' : 'var(--error-color)',
          fontWeight: 'bold'
        }}>
          {formatCurrency(value)}
        </Text>
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
                  <WalletOutlined style={{ marginRight: 8 }} />
                  Cashbook Display
                </Title>
                <Text type="secondary">
                  View cash transactions and account balances
                </Text>
              </div>
              <Space>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={() => handleExport('excel')}
                  disabled={!cashbookData.length}
                >
                  Excel
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => handleExport('pdf')}
                  disabled={!cashbookData.length}
                >
                  PDF
                </Button>
              </Space>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ dateRange: [null, null] }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item
                    name="accountId"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SearchOutlined />
                        <Text strong>Select Account</Text>
                      </div>
                    }
                    rules={[{ required: true, message: "Please select an account!" }]}
                  >
                    <Select 
                      placeholder="Select an account" 
                      loading={!accounts.length}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {accounts.map((account) => (
                        <Select.Option key={account.id} value={account.id}>
                          {account.accountName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label={<Text strong>Use Financial Year</Text>}>
                    <Switch
                      checked={useFinancialYear}
                      onChange={(checked: boolean) => setUseFinancialYear(checked)}
                      style={{ marginTop: '4px' }}
                    />
                  </Form.Item>
                </Col>

                {!useFinancialYear && (
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      name="dateRange"
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarOutlined />
                          <Text strong>Date Range</Text>
                        </div>
                      }
                      rules={[
                        {
                          required: !useFinancialYear,
                          message: "Please select a date range when not using the financial year.",
                        },
                      ]}
                    >
                      <RangePicker format="DD/MM/YYYY" />
                    </Form.Item>
                  </Col>
                )}

                <Col xs={24}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                      Generate Cashbook Report
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Summary Cards */}
      {cashbookData.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card className="metrics-card">
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  Total Debits
                </Text>
                <Title level={3} style={{ margin: 0, color: 'var(--error-color)' }}>
                  {formatCurrency(totalDebit)}
                </Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="metrics-card">
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  Total Credits
                </Text>
                <Title level={3} style={{ margin: 0, color: 'var(--success-color)' }}>
                  {formatCurrency(totalCredit)}
                </Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="metrics-card">
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  Net Balance
                </Text>
                <Title level={3} style={{ 
                  margin: 0, 
                  color: netBalance >= 0 ? 'var(--success-color)' : 'var(--error-color)' 
                }}>
                  {formatCurrency(netBalance)}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Cashbook Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <Table<CashbookRecord>
              columns={columns}
              dataSource={cashbookData}
              rowKey="transactionId"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`,
              }}
              className="enterprise-table"
              onRow={(record: CashbookRecord) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: 'pointer' },
              })}
              summary={() => 
                cashbookData.length > 0 ? (
                  <Table.Summary.Row style={{ backgroundColor: 'var(--background-secondary)' }}>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Text strong style={{ fontSize: '16px' }}>Totals</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ fontSize: '16px', color: 'var(--error-color)' }}>
                          {formatCurrency(totalDebit)}
                        </Text>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ fontSize: '16px', color: 'var(--success-color)' }}>
                          {formatCurrency(totalCredit)}
                        </Text>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ 
                          fontSize: '16px', 
                          color: netBalance >= 0 ? 'var(--success-color)' : 'var(--error-color)' 
                        }}>
                          {formatCurrency(netBalance)}
                        </Text>
                      </div>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                ) : null
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CashbookDisplay;
