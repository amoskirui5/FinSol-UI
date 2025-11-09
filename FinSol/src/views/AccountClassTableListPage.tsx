import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Card, Row, Col, Input } from 'antd';
import { FolderOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { AccountClass } from '../types/Accounting/accountingTypes';
import { deleteAccountClass, getAccountClass } from '../services/chartOfAccountsService';
import { useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';

const { Title, Text } = Typography;
const { Search } = Input;

const AccountClassTableListPage: React.FC = () => {
    const [data, setData] = useState<AccountClass[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchAccountClasses = async () => {
        setLoading(true);
        try {
            const results = await getAccountClass();
            if (results.success) {
                setData(results.data);
            }
        } catch (error) {
            console.error('Error fetching account classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountClasses();
    }, []);

    const handleEdit = (id: UUID) => {
        navigate(`/account-class/edit/${id}`);
    };

    const handleDelete = async (id: UUID) => {
        const response = await deleteAccountClass(id);
        console.log(response);

        if (response.success) {
            setData(prevData => prevData.filter(item => item.id !== id));
        }
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        console.log(`Exporting account classes as ${format}`);
        // Implement export functionality
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
    );

    const columns = [
        {
            title: 'Class Name',
            dataIndex: 'name',
            key: 'ClassName',
            render: (text: string) => (
                <Text strong style={{ color: 'var(--primary-color)' }}>{text}</Text>
            ),
            sorter: (a: AccountClass, b: AccountClass) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'Description',
            ellipsis: true,
            render: (text: string) => (
                <Text type="secondary">{text || 'No description'}</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: object, record: AccountClass) => (
                <Space size="small">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                        type="text"
                        style={{ color: 'var(--primary-color)' }}
                    />
                    <Popconfirm
                        title="Delete Account Class"
                        description="Are you sure you want to delete this account class?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            style={{ color: 'var(--error-color)' }}
                        />
                    </Popconfirm>
                </Space>
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
                                    <FolderOutlined style={{ marginRight: 8 }} />
                                    Account Classes
                                </Title>
                                <Text type="secondary">
                                    Manage chart of accounts classification structure
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
                                    onClick={() => navigate('/register-account-class')}
                                    size="large"
                                >
                                    Add Account Class
                                </Button>
                            </Space>
                        </div>
                        
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={24} sm={12} md={8}>
                                <Search
                                    placeholder="Search account classes..."
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
                                        Total: {filteredData.length} classes
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
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
                                    `${range[0]}-${range[1]} of ${total} account classes`,
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AccountClassTableListPage;
