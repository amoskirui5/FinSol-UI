import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Tooltip, Card, Row, Col, Input, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, BankOutlined, SearchOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ChartOfAccount } from '../types/Accounting/accountingTypes';
import { deleteChartOfAccounts, getChartOfAccounts } from '../services/chartOfAccountsService';
import { UUID } from 'crypto';

const { Title, Text } = Typography;
const { Search } = Input;

const ChartOfAccountsListPage: React.FC = () => {
    const [data, setData] = useState<ChartOfAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const getChartOfAccount = async () => {
        setLoading(true);
        try {
            const results = await getChartOfAccounts();
            if (results.success) {
                setData(results.data);
            }
        } catch (error) {
            console.error('Error fetching chart of accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getChartOfAccount();
    }, []);

    const handleEdit = (id: UUID) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id: UUID) => {
        const response = await deleteChartOfAccounts(id);
        if (response.success) {
            setData(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        console.log(`Exporting chart of accounts as ${format}`);
        // Implement export functionality
    };

    const getAccountTypeColor = (className: string) => {
        const colors = {
            'Asset': 'blue',
            'Liability': 'red',
            'Equity': 'green',
            'Revenue': 'cyan',
            'Expense': 'orange'
        };
        return colors[className as keyof typeof colors] || 'default';
    };

    const filteredData = data.filter(item =>
        item.accountName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.accountCode.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.className && item.className.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.subClassName && item.subClassName.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
    );

    const columns = [
        {
            title: 'Account Code',
            dataIndex: 'accountCode',
            key: 'accountCode',
            render: (text: string) => (
                <Text strong style={{ color: 'var(--primary-color)', fontFamily: 'monospace' }}>
                    {text}
                </Text>
            ),
            sorter: (a: ChartOfAccount, b: ChartOfAccount) => a.accountCode.localeCompare(b.accountCode),
            width: 120,
        },
        {
            title: 'Account Name',
            dataIndex: 'accountName',
            key: 'accountName',
            render: (text: string) => (
                <Text strong>{text}</Text>
            ),
            sorter: (a: ChartOfAccount, b: ChartOfAccount) => a.accountName.localeCompare(b.accountName),
        },
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className',
            render: (className: string) => (
                <Tag color={getAccountTypeColor(className)}>
                    {className}
                </Tag>
            ),
            filters: [
                { text: 'Asset', value: 'Asset' },
                { text: 'Liability', value: 'Liability' },
                { text: 'Equity', value: 'Equity' },
                { text: 'Revenue', value: 'Revenue' },
                { text: 'Expense', value: 'Expense' },
            ],
            onFilter: (value: any, record: ChartOfAccount) => record.className === value,
            width: 120,
        },
        {
            title: 'Sub Class Name',
            dataIndex: 'subClassName',
            key: 'subClassName',
            render: (text: string) => (
                <Text type="secondary">{text || 'N/A'}</Text>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text: string) => (
                <Text type="secondary">{text || 'No description'}</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: object, record: ChartOfAccount) => (
                <Space size="small">
                    <Tooltip title="Edit Account">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                            type="text"
                            style={{ color: 'var(--primary-color)' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Account"
                        description="Are you sure you want to delete this account?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Account">
                            <Button 
                                icon={<DeleteOutlined />} 
                                type="text" 
                                style={{ color: 'var(--error-color)' }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Calculate summary statistics by class
    const summaryByClass = filteredData.reduce((acc, account) => {
        const className = account.className || 'Unknown';
        if (!acc[className]) {
            acc[className] = { count: 0, accounts: [] };
        }
        acc[className].count += 1;
        acc[className].accounts.push(account);
        return acc;
    }, {} as Record<string, { count: number; accounts: ChartOfAccount[] }>);

    return (
        <div className="fade-in">
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card className="enterprise-card">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}>
                            <div>
                                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                                    <BankOutlined style={{ marginRight: 8 }} />
                                    Chart of Accounts
                                </Title>
                                <Text type="secondary">
                                    Manage your complete chart of accounts structure
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
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('/chart-of-accounts/register')}
                                    size="large"
                                >
                                    Add Account
                                </Button>
                            </Space>
                        </div>
                        
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={24} sm={12} md={8}>
                                <Search
                                    placeholder="Search accounts..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    size="large"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={16}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                                    <Text type="secondary">
                                        Total: {filteredData.length} accounts
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {Object.entries(summaryByClass).map(([className, data]) => (
                    <Col key={className} xs={24} sm={12} lg={6}>
                        <Card className="metrics-card">
                            <div style={{ textAlign: 'center' }}>
                                <Tag 
                                    color={getAccountTypeColor(className)} 
                                    style={{ marginBottom: '8px', fontSize: '12px' }}
                                >
                                    {className}
                                </Tag>
                                <Title level={3} style={{ margin: 0, color: 'var(--primary-color)' }}>
                                    {data.count}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {data.count === 1 ? 'Account' : 'Accounts'}
                                </Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card className="enterprise-card">
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="id"
                            loading={loading}
                            className="enterprise-table"
                            pagination={{
                                pageSize: 20,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} accounts`,
                            }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ChartOfAccountsListPage;

