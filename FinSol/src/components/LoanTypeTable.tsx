import React from 'react';
import { Table, Button, Popconfirm, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { LoanType, LoanTypeTableProps } from '../types/loanTypeTypes';
import { formatCurrency } from '../Utility/formatCurrency';

const { Title } = Typography;


const LoanTypeTable: React.FC<LoanTypeTableProps> = ({ loanTypes, onViewDetails, onEdit, onDelete, onRegister, totalRecords,
    pageNumber,
    pageSize }) => {
    const columns = [
        {
            title: 'Loan Name',
            dataIndex: 'loanName',
            key: 'loanName',
        },
        {
            title: 'Account Name',
            dataIndex: 'chartOfAccountName',
            key: 'chartOfAccountName',
        },
        {
            title: 'Interest Rate (%)',
            dataIndex: 'interestRate',
            key: 'interestRate',
        },
        {
            title: 'Maximum Loan Amount',
            dataIndex: 'maximumLoanAmount',
            key: 'maximumLoanAmount',
            render: (value: number) => formatCurrency(value),
        },
        {
            title: 'Minimum Loan Amount',
            dataIndex: 'minimumLoanAmount',
            key: 'minimumLoanAmount',
            render: (value: number) => formatCurrency(value),

        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: LoanType) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => onViewDetails(record.loanTypeId)}
                    >
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record.loanTypeId)}
                    >

                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this loan type?"
                        onConfirm={() => onDelete(record.loanTypeId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                        >

                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Title level={5} style={{ marginBottom: '16px' }}>
                Loan Types
                <Button type="primary" style={{ float: 'right' }} onClick={onRegister}>
                    Register Loan Type
                </Button>
            </Title>
            <Table
                dataSource={loanTypes}
                columns={columns}
                rowKey="loanTypeId"
                pagination={{
                    current: pageNumber,
                    pageSize: pageSize,
                    total: totalRecords,
                }}
            />
        </>
    );
};

export default LoanTypeTable;
