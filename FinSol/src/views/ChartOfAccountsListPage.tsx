import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChartOfAccount } from '../types/accountingTypes';
import { deleteChartOfAccounts, getChartOfAccounts } from '../services/chartOfAccountsService';
import { UUID } from 'crypto';

const { Title } = Typography;


const ChartOfAccountsListPage: React.FC = () => {
    const [data, setData] = useState<ChartOfAccount[]>([]);
    const navigate = useNavigate();

    const getChartOfAccount = async () => {
        var results = await getChartOfAccounts();
        if (results.success) {
            setData(results.data);

        }
    }
    useEffect(() => {
        getChartOfAccount();
    }, []);

    const handleEdit = (id: UUID) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id: UUID) => {
        var response = await deleteChartOfAccounts(id);

        if (response.success) {
            setData(prevData => prevData.filter(item => item.id !== id));
        }
    };

    const columns = [

        {
            title: 'Account Code',
            dataIndex: 'accountCode',
            key: 'accountCode',
        }, {
            title: 'Account Name',
            dataIndex: 'accountName',
            key: 'AccountName',
        },
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'ClassName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'Description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: object, record: ChartOfAccount) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                        type="link"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            type="link"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={5}>Chart of Accounts</Title>
                <Button
                    type="primary"
                    style={{ marginBottom: 16 }}
                    onClick={() => navigate('/chart-of-accounts/register')}

                >

                    Add New Account
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
            />
        </div>
    );
};

export default ChartOfAccountsListPage;
