import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Switch, Form, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { TrialBalanceEntry } from '../../types/Financials/FinancialTypes';
import { fetchTrialBalance } from '../../services/financialStatement';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const TrialBalance: React.FC = () => {  
  const [data, setData] = useState<TrialBalanceEntry[]>([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [useFinancialYear, setUseFinancialYear] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().startOf('year').format('YYYY-MM-DD'),
    dayjs().endOf('year').format('YYYY-MM-DD'),
  ]);

  useEffect(() => {
    const fetchTrialBalanceItems = async () => {
      const result = await fetchTrialBalance(
        useFinancialYear ? undefined : dateRange[0],
        useFinancialYear ? undefined : dateRange[1]
      );

      if (result.success) {
        setData(result.data.entries);
        setTotalDebit(result.data.totalDebit);
        setTotalCredit(result.data.totalCredit);
      }
    };

    fetchTrialBalanceItems();
  }, [useFinancialYear, dateRange]);

  const onDateChange = (dates: [any, any] | null) => {
    if (dates) {
      setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
    }
  };

  const columns: ColumnsType<TrialBalanceEntry> = [
    { title: 'Account Name', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Debit', dataIndex: 'debit', key: 'debit' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Trial Balance Report</Title>
      <Form layout="inline" style={{ marginBottom: '16px' }}>
        <Form.Item label="Use Current Financial Year">
          <Switch checked={useFinancialYear} onChange={setUseFinancialYear} />
        </Form.Item>
        <Form.Item label="Date Range" style={{ marginLeft: useFinancialYear ? '8px' : '0' }}>
          <RangePicker
            value={useFinancialYear ? undefined : [dayjs(dateRange[0]), dayjs(dateRange[1])]}
            disabled={useFinancialYear}
            onChange={onDateChange}
          />
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="accountName"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>{totalDebit}</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>{totalCredit}</Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default TrialBalance;
