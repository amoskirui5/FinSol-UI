import React from 'react';
import { Table, Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

interface Member {
  key: string;
  name: string;
  email: string;
  phoneNumber: string;
  bankAccount: string;
  bankName: string;
  workplace: string;
  worktype: string;
}

const data: Member[] = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    bankAccount: '0011223344',
    bankName: 'Bank A',
    workplace: 'Office A',
    worktype: 'Full-time',
  },
];

const MemberList: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Bank Account',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: 'Workplace',
      dataIndex: 'workplace',
      key: 'workplace',
    },
    {
      title: 'Work Type',
      dataIndex: 'worktype',
      key: 'worktype',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Member) => (
        <Space size="middle">
          <Link to={`/member-details/${record.key}`}>
            <Button type="link">View Details</Button>
          </Link>
        </Space>
      ),
    },
  ];

const handleRegisterMember=async()=>{
  navigate('/member-registration');
}

return (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <p style={{ margin: 0 }}>Member List</p>
      <Button type="primary" onClick={handleRegisterMember}>Register Member</Button>
    </div>

    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      rowKey="key"
    />
  </div>
);


};

export default MemberList;
