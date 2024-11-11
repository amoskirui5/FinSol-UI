import React, { useEffect, useState } from "react";
import { Select, DatePicker, Button, Form, Table, Switch, message } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { CashbookRecord } from "../../types/Financials/FinancialTypes";
import { ChartOfAccount } from "../../types/accountingTypes";
import { getChartOfAccounts } from "../../services/chartOfAccountsService";
import { fetchCashBook } from "../../services/financialStatement";
import { format } from "path";
import { formatDate } from "../../helpers/dateFormater";

const { RangePicker } = DatePicker;

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
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: CashbookRecord) => {
    // Here you can implement navigation to an edit page, or open a modal for editing, etc.
    message.info(`You clicked on ${record.transactionId}`);
    // For example: navigate(`/edit-transaction/${record.transactionId}`);
  };

  const columns: ColumnsType<CashbookRecord> = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (value) => formatDate(value)
    },
    {
      title: "Transaction Description",
      dataIndex: "transactionDescription",
      key: "transactionDescription",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      render: (value) => value.toFixed(2),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (value) => value.toFixed(2),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value) => value.toFixed(2),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ dateRange: [null, null] }}
      >
        <Form.Item
          name="accountId"
          label="Select Account"
          rules={[{ required: true, message: "Please select an account!" }]}
        >
          <Select placeholder="Select an account" loading={!accounts.length}>
            {accounts.map((account) => (
              <Select.Option key={account.id} value={account.id}>
                {account.accountName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Use Active Financial Year Dates">
          <Switch
            checked={useFinancialYear}
            onChange={(checked: boolean) => setUseFinancialYear(checked)}
          />
        </Form.Item>

        {!useFinancialYear && (
          <Form.Item
            name="dateRange"
            label="Select Date Range"
            rules={[
              {
                required: !useFinancialYear,
                message: "Please select a date range when not using the financial year.",
              },
            ]}
          >
            <RangePicker />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Table<CashbookRecord>
        columns={columns}
        dataSource={cashbookData}
        rowKey="transactionId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ marginTop: '20px' }}
        onRow={(record: CashbookRecord) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
      />;
    </div>
  );
};

export default CashbookDisplay;
