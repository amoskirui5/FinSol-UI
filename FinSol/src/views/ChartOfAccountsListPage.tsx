import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Tooltip, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ChartOfAccount } from '../types/accountingTypes';
import { deleteChartOfAccounts, getChartOfAccounts } from '../services/chartOfAccountsService';
import { UUID } from 'crypto';

const { Title } = Typography;

const ChartOfAccountsListPage: React.FC = () => {
    const [data, setData] = useState<ChartOfAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const getChartOfAccount = async () => {
        setLoading(true);
        const results = await getChartOfAccounts();
        if (results.success) {
            setData(results.data);
        }
        setLoading(false);
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

    const columns = [
        {
            title: 'Account Code',
            dataIndex: 'accountCode',
            key: 'accountCode',
            sorter: (a: ChartOfAccount, b: ChartOfAccount) => a.accountCode.localeCompare(b.accountCode),
        },
        {
            title: 'Account Name',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className',
        },
         {
            title: 'Sub Class Name',
            dataIndex: 'subClassName',
            key: 'subClassName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: object, record: ChartOfAccount) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                            type="link"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button icon={<DeleteOutlined />} type="link" danger />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
            }}>
                <Title level={4} style={{ margin: 0 }}>Chart of Accounts</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/chart-of-accounts/register')}
                >
                    Add New Account
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: false }}
            />
        </Card>
    );
};

export default ChartOfAccountsListPage;

