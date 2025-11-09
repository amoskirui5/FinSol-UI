import React, { useEffect, useState } from 'react';
import { Table, Switch, Typography, Select, Card, Row, Col, Button, Space } from 'antd';
import { BankOutlined, FileExcelOutlined, FilePdfOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { BalanceSheetEntry, Totals } from '../../types/Financials/FinancialTypes';
import { fetchBalanceSheet } from '../../services/financialStatement';

const { Title, Text } = Typography;
const { Option } = Select;

const BalanceSheet: React.FC = () => {
    const [assets, setAssets] = useState<BalanceSheetEntry[]>([]);
    const [liabilities, setLiabilities] = useState<BalanceSheetEntry[]>([]);
    const [equity, setEquity] = useState<BalanceSheetEntry[]>([]);
    const [useFinancialYear, setUseFinancialYear] = useState(true);
    const [loading, setLoading] = useState(false);
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
        const fetchBalanceSheetItems = async () => {
            setLoading(true);
            try {
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
            } catch (error) {
                console.error('Error fetching balance sheet:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalanceSheetItems();
    }, [useFinancialYear, selectedYears]);

    const onYearChange = (years: number[]) => {
        setSelectedYears(years);
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        // Minimal debug logging — replace with real export implementation when ready
        console.debug(`Exporting balance sheet as ${format}`);
        // TODO: implement export functionality (call export service or generate file client-side)
    };

    const formatCurrency = (amount?: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    const columns: ColumnsType<BalanceSheetEntry> = [
        { 
            title: 'Account Name', 
            dataIndex: 'accountName', 
            key: 'accountName',
            render: (text: string) => <Text strong>{text}</Text>
        },
        ...selectedYears.map(year => ({
            title: year.toString(),
            dataIndex: ['amountsByYear', year.toString()] as [string, string],
            key: year.toString(),
            align: 'right' as const,
            render: (value: number) => (
                <Text style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(value)}
                </Text>
            )
        })),
    ];

    const renderSection = (title: string, dataSource: BalanceSheetEntry[], totalsData: Record<string, number>) => (
        <Card className="enterprise-card" style={{ marginBottom: 24 }}>
            <Title level={4} style={{ color: 'var(--primary-color)', marginBottom: 16 }}>
                {title}
            </Title>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                rowKey="accountName"
                className="enterprise-table"
                loading={loading}
                summary={() => (
                    <Table.Summary.Row style={{ backgroundColor: 'var(--background-secondary)' }}>
                        <Table.Summary.Cell index={0}>
                            <Text strong style={{ fontSize: '16px' }}>Total {title}</Text>
                        </Table.Summary.Cell>
                        {selectedYears.map((year, index) => (
                            <Table.Summary.Cell index={index + 1} key={year}>
                                <div style={{ textAlign: 'right' }}>
                                    <Text strong style={{ fontSize: '16px', color: 'var(--primary-color)' }}>
                                        {formatCurrency(totalsData[year] || 0)}
                                    </Text>
                                </div>
                            </Table.Summary.Cell>
                        ))}
                    </Table.Summary.Row>
                )}
            />
        </Card>
    );

    return (
        <div className="fade-in">
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card className="enterprise-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                                    <BankOutlined style={{ marginRight: 8 }} />
                                    Balance Sheet
                                </Title>
                                <Text type="secondary">
                                    Financial position for selected periods
                                </Text>
                            </div>
                            <Space>
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
                        
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={24} sm={12} md={8}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text strong>Use Financial Year:</Text>
                                    <Switch checked={useFinancialYear} onChange={setUseFinancialYear} />
                                </div>
                            </Col>
                            {!useFinancialYear && (
                                <Col xs={24} sm={12} md={16}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CalendarOutlined />
                                        <Text strong>Select Years:</Text>
                                        <Select
                                            mode="multiple"
                                            value={selectedYears}
                                            onChange={onYearChange}
                                            style={{ minWidth: '200px' }}
                                            placeholder="Select years to compare"
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
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    {renderSection('Assets', assets, totals.assets)}
                    {renderSection('Liabilities', liabilities, totals.liabilities)}
                    {renderSection('Equity', equity, totals.equity)}
                </Col>
            </Row>

            {/* Balance Verification */}
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card className="metrics-card" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                        <Title level={4} style={{ color: 'white', textAlign: 'center', margin: 0 }}>
                            Balance Verification
                        </Title>
                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                            {selectedYears.map(year => {
                                const totalAssets = totals.assets[year] || 0;
                                const totalLiabilitiesAndEquity = (totals.liabilities[year] || 0) + (totals.equity[year] || 0);
                                const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;
                                
                                return (
                                    <Col key={year} xs={24} sm={12} lg={selectedYears.length > 2 ? 8 : 12}>
                                        <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                            <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', display: 'block' }}>
                                                {year}
                                            </Text>
                                            <Text style={{ color: 'white', display: 'block' }}>
                                                Assets: {formatCurrency(totalAssets)}
                                            </Text>
                                            <Text style={{ color: 'white', display: 'block' }}>
                                                Liab. + Equity: {formatCurrency(totalLiabilitiesAndEquity)}
                                            </Text>
                                            <Text style={{ 
                                                color: isBalanced ? '#52c41a' : '#ff7875', 
                                                fontWeight: 'bold',
                                                display: 'block',
                                                marginTop: '8px'
                                            }}>
                                                {isBalanced ? '✓ BALANCED' : '⚠️ OUT OF BALANCE'}
                                            </Text>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BalanceSheet;
