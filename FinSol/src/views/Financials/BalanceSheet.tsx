import React, { useEffect, useState } from 'react';
import { Table, Switch, Form, Typography, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BalanceSheetEntry, Totals } from '../../types/Financials/FinancialTypes';
import { fetchBalanceSheet } from '../../services/financialStatement';

const { Title } = Typography;
const { Option } = Select;

const BalanceSheet: React.FC = () => {
    const [assets, setAssets] = useState<BalanceSheetEntry[]>([]);
    const [liabilities, setLiabilities] = useState<BalanceSheetEntry[]>([]);
    const [equity, setEquity] = useState<BalanceSheetEntry[]>([]);
    const [useFinancialYear, setUseFinancialYear] = useState(true);
    const [selectedYears, setSelectedYears] = useState<number[]>([
        new Date().getFullYear(), 
        new Date().getFullYear() - 1, 
    ]);

    const [totals, setTotals] = useState<Totals>({
        assets: {},
        liabilities: {},
        equity: {},
    });

    useEffect(() => {
        fetchBalanceSheetItems();
    }, [useFinancialYear, selectedYears]);

    const fetchBalanceSheetItems = async () => {
        const years = useFinancialYear ? null : selectedYears;
        const result = await fetchBalanceSheet(years);

        if (result.success) {
            
            setAssets(result.data.assets);
            setLiabilities(result.data.liabilities);
            setEquity(result.data.equity);
            setTotals({
                assets: result.data.totalAssetsByYear,
                liabilities: result.data.totalLiabilitiesByYear,
                equity: result.data.totalEquityByYear,
            });
        }
    };

    const onYearChange = (years: number[]) => {
        setSelectedYears(years);
    };

    const columns: ColumnsType<BalanceSheetEntry> = [
        { title: 'Account Name', dataIndex: 'accountName', key: 'accountName' },
        ...selectedYears.map(year => ({
            title: year.toString(),
            dataIndex: ['amountsByYear', year.toString()],
            key: year.toString(),
        })),
    ];

    const totalsDataSource = [
        {
            accountName: 'Total Assets',
            ...selectedYears.reduce((acc, year) => ({ ...acc, [year]: totals.assets[year] || 0 }), {}),
        },
        {
            accountName: 'Total Liabilities',
            ...selectedYears.reduce((acc, year) => ({ ...acc, [year]: totals.liabilities[year] || 0 }), {}),
        },
        {
            accountName: 'Total Equity',
            ...selectedYears.reduce((acc, year) => ({ ...acc, [year]: totals.equity[year] || 0 }), {}),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3}>Balance Sheet</Title>
            <Form layout="inline" style={{ marginBottom: '16px' }}>
                <Form.Item label="Use Financial Year">
                    <Switch checked={useFinancialYear} onChange={setUseFinancialYear} />
                </Form.Item>
                {!useFinancialYear && (
                    <Form.Item label="Select Years">
                        <Select
                            mode="multiple"
                            value={selectedYears}
                            onChange={onYearChange}
                            style={{ minWidth: '200px' }}
                        >
                            {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                )}
            </Form>

            <Title level={4}>Assets</Title>
            <Table columns={columns} dataSource={assets} pagination={false} rowKey="accountName" />

            <Title level={4}>Liabilities</Title>
            <Table columns={columns} dataSource={liabilities} pagination={false} rowKey="accountName" />

            <Title level={4}>Equity</Title>
            <Table columns={columns} dataSource={equity} pagination={false} rowKey="accountName" />

            <Table
                columns={columns}
                dataSource={totalsDataSource}
                pagination={false}
                rowKey="accountName"
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                        {selectedYears.map((year, index) => (
                            <Table.Summary.Cell index={index + 1} key={year}>
                                {(totals.assets[year] || 0) +
                                    (totals.liabilities[year] || 0) +
                                    (totals.equity[year] || 0)}
                            </Table.Summary.Cell>
                        ))}
                    </Table.Summary.Row>
                )}
            />
        </div>
    );
};

export default BalanceSheet;
