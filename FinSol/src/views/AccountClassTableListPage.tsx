import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import { AccountClass } from '../types/accountingTypes';
import { deleteAccountClass, getAccountClass } from '../services/chartOfAccountsService';
import { useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AccountClassTableListPage: React.FC = () => {

    const [data, setData] = useState<AccountClass[]>([]);
    const navigate = useNavigate();

    const fetchAccountClasses = async () => {
        var results = await getAccountClass();
        if (results.success) {
            setData(results.data);
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

    const columns = [
        {
            title: 'Class Name',
            dataIndex: 'name',
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
            render: (_: object, record: AccountClass) => (
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

                <Title level={5}>Account Classes</Title>
                <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/register-account-class')}>
                    Add New Account Class
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

export default AccountClassTableListPage;
