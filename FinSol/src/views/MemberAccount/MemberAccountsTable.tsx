import React, { useEffect, useState } from 'react';
import { Button, Col, Popconfirm, Row, Table, Tooltip } from 'antd';
import { MemberAccountsListResponseDTO } from '../../types/MemberAccount/memberAccountTypes';
import { Link } from 'react-router-dom';
import { fetchMemberAccountSettings } from '../../services/memberAccountService';
import { mapEnumToString } from '../../helpers/enumConversion';
import { MemberAccountType } from '../../enums/enums';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../Utility/formatCurrency';

const MemberAccountsTable: React.FC = () => {
  const [data, setData] = useState<MemberAccountsListResponseDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchMemberAccountSettings();
      if (response.success) {
        setData(response.data);
      }
    };

    fetchData();
  }, []);


  const handleEdit = (accountId: string) => {
    // Handle edit logic here, e.g., redirect to edit form
    console.log('Edit:', accountId);
  };

  const handleDelete = (accountId: string) => {
    // Handle delete logic here, e.g., make API call to delete
    console.log('Delete:', accountId);
  };

  const handleView = (accountId: string) => {
    // Handle view details logic, e.g., redirect to details page
    console.log('View:', accountId);
  };

  const columns = [
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (value: number) => mapEnumToString(MemberAccountType, value),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Min Amount',
      dataIndex: 'minimumAmount',
      key: 'minimumAmount',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Max Amount',
      dataIndex: 'maximumAmount',
      key: 'maximumAmount',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Withdrawable',
      dataIndex: 'isWithdrawable',
      key: 'isWithdrawable',
      render: (text: boolean) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Can Guarantee',
      dataIndex: 'canGuarantee',
      key: 'canGuarantee',
      render: (text: boolean) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text: boolean) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MemberAccountsListResponseDTO) => (
        <div>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleView(record.accountId)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.accountId)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this item?"
              onConfirm={() => handleDelete(record.accountId)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                type="link"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];


  return (
    <>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Link to="/create-member-account">
            <Button type="primary">Create New Account</Button>
          </Link>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="accountId" />
    </>
  );
};

export default MemberAccountsTable;
