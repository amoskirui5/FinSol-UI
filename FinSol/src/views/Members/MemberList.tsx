import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PaginationOptions } from '../../types/paginationTypes';

import {EditOutlined,
StopOutlined,
UserAddOutlined,
EyeOutlined,
} from '@ant-design/icons'; 
import { formatDate } from '../../helpers/dateFormater';
import { MemberListDto } from '../../types/Member/memberTypes';
import { fetchAllMembers } from '../../services/memberService';


const MemberList: React.FC = () => {
  const navigate = useNavigate();
  const [memberData, setMemberdata] = useState<MemberListDto[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('');
  const [sortingType,SetSortingType]=useState<boolean>(false);
  const options: PaginationOptions = {
    pageNumber,
    pageSize,
    searchTerm,
    searchField,
    sortDescending:sortingType
  };
  useEffect(() => {
    fetchAllMembersAPI();
  }, [pageNumber, pageSize, searchTerm, searchField,sortingType]);

  const fetchAllMembersAPI = async () => {
    const response = await fetchAllMembers(options);
    if (response.success) {
      setMemberdata(response.data.items);
      setTotalRecords(response.data.totalRecords);
      setPageSize(response.data.pageSize);
    }

  };

const data=memberData;

  const columns = [
    {
      title: 'Member Number',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
    },
    {
      title: 'Name',
      dataIndex: 'memberName',
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
      title: 'National Id',
      dataIndex: 'nationalID',
      key: 'nationalID',
    },
    {
      title: 'Date Joined',
      dataIndex: 'dateJoined',
      key: 'dateJoined',
      render:(value:string)=>formatDate(value)
    },
    
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: MemberListDto) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="link" icon={<EyeOutlined />} onClick={() => viewDetails(record.memberId)} />
          </Tooltip>
          <Tooltip title="Edit Member">
            <Button type="link" icon={<EditOutlined />} onClick={() => editMember(record.memberId)} />
          </Tooltip>
          <Tooltip title="Deactivate Member">
            <Button type="link" danger icon={<StopOutlined />} onClick={() => deactivateMember(record.memberId)} />
          </Tooltip>
          <Tooltip title="Add Next of Kin">
            <Button type="link" icon={<UserAddOutlined />} onClick={() => addNextOfKin(record.memberId)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleRegisterMember = async () => {
    navigate('/members/register');
  }

const viewDetails = (id: string) => {
  navigate(`/members/details/${id}`); 


};

const editMember = (id: string) => {
  navigate(`/members/edit/${id}`);
};

const deactivateMember = (memberId: string) => {
};

const addNextOfKin = (memberId: string) => {
};
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ margin: 0 }}>Member List</p>
        <Button type="primary" onClick={handleRegisterMember}>Register Member</Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: pageSize }}
        rowKey="memberNumber"
        scroll={{ x: 1000 }} 
      />
    </div>
  );


};

export default MemberList;
