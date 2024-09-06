import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm } from 'antd';
import axios from 'axios';
import { AccountClass } from '../types/accountingTypes';
import { getAccountClass } from '../services/accountingService';
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
        navigate(`/edit/${id}`);
    };

    const handleDelete = (id: UUID) => {
        axios.delete(`/api/account-class/${id}`)
            .then(() => {
                setData(prevData => prevData.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('Error deleting account class', error);
            });
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
            render: (_:object, record: AccountClass) => (
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
            <Title level={2}>Account Classes</Title>
            <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/register-account-class')}>
                Add New Account Class
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
            />
        </div>
    );
};

export default AccountClassTableListPage;
