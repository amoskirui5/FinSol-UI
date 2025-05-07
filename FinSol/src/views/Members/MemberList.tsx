import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip, Select, Input, Typography, Card, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PaginationOptions } from '../../types/paginationTypes';

import {
  EditOutlined,
  StopOutlined,
  UserAddOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { formatDate } from '../../helpers/dateFormater';
import { MemberListDto } from '../../types/Member/memberTypes';
import { maskData } from '../../Utility/maskBioData';
import { memberSearchFieldOptions } from '../../constants/searchFieldOptions';
import { fetchAllMembers } from '../../services/memberService';
import { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const MemberList: React.FC = () => {
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<MemberListDto[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('memberNumber');
  const [sortingType, setSortingType] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const options: PaginationOptions = {
    pageNumber,
    pageSize,
    searchTerm,
    searchField,
    sortDescending: sortingType,
  };

  useEffect(() => {
    fetchAllMembersAPI();
  }, [pageNumber, pageSize, searchTerm, searchField, sortingType]);

  const fetchAllMembersAPI = async () => {
    setLoading(true);
    try {
      const response = await fetchAllMembers(options);
      if (response.success) {
        setMemberData(response.data.items);
        setTotalRecords(response.data.totalRecords);
        setPageSize(response.data.pageSize);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      Modal.error({
        title: 'Error',
        content: 'Failed to load member list. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<MemberListDto> = [
    {
      title: 'Member Number',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
      sorter: (a: MemberListDto, b: MemberListDto): number => a.memberNumber.localeCompare(b.memberNumber),
    },
    {
      title: 'Name',
      dataIndex: ['firstName', 'otherName'],
      key: 'name',
      render: (_: any, record: MemberListDto) => `${record.firstName} ${record.otherName}`,
      sorter: (a: MemberListDto, b: MemberListDto): number =>
        `${a.firstName} ${a.otherName}`.localeCompare(`${b.firstName} ${b.otherName}`),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => maskData(email, 'email'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string) => maskData(phone, 'phone'),
    },
    {
      title: 'National ID',
      dataIndex: 'nationalID',
      key: 'nationalID',
      render: (nationalID: string) => maskData(nationalID, 'nationalID'),
    },
    {
      title: 'Date Joined',
      dataIndex: 'dateJoined',
      key: 'dateJoined',
      render: (value: string) => formatDate(value),
      sorter: (a: MemberListDto, b: MemberListDto): number =>
        new Date(a.dateJoined).getTime() - new Date(b.dateJoined).getTime(),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: MemberListDto) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="link" icon={<EyeOutlined />} onClick={() => viewDetails(record.memberId)} />
          </Tooltip>
          <Tooltip title="Edit Member">
            <Button type="link" icon={<EditOutlined />} onClick={() => editMember(record.memberId)} />
          </Tooltip>
          <Tooltip title="Deactivate Member">
            <Button
              type="link"
              danger
              icon={<StopOutlined />}
              onClick={() => confirmDeactivate(record.memberId, `${record.firstName} ${record.otherName}`)}
            />
          </Tooltip>
          <Tooltip title="Add Next of Kin">
            <Button type="link" icon={<UserAddOutlined />} onClick={() => addNextOfKin(record.memberId)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleRegisterMember = () => {
    navigate('/members/register');
  };

  const viewDetails = (id: string) => {
    navigate(`/members/details/${id}`);
  };

  const editMember = (id: string) => {
    navigate(`/members/edit/${id}`);
  };

  const confirmDeactivate = (id: string, name: string) => {
    Modal.confirm({
      title: 'Deactivate Member',
      content: `Are you sure you want to deactivate ${name}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deactivateMember(id),
    });
  };

  const deactivateMember = (id: string) => {
    // Placeholder for deactivation logic; replace with actual API call
    console.log(`Deactivating member with ID: ${id}`);
    fetchAllMembersAPI(); // Refresh list after deactivation
  };

  const addNextOfKin = (id: string) => {
    navigate(`/members/${id}/next-of-kin`);
  };

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value.trim());
    setPageNumber(1); // Reset to first page on new search
  }, 300);

  const handleSearchFieldChange = (value: string) => {
    setSearchField(value);
    setPageNumber(1); // Reset to first page on field change
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
    setSortingType(sorter.order === 'descend');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            Member List
          </Title>
        }
        extra={
          <Button type="primary" icon={<UserAddOutlined />} onClick={handleRegisterMember}>
            Register Member
          </Button>
        }
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
          <Space size="middle">
            <Select
              value={searchField}
              style={{ width: 200 }}
              onChange={handleSearchFieldChange}
              placeholder="Select search field"
            >
              {memberSearchFieldOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Search
              placeholder={`Search by ${memberSearchFieldOptions.find(opt => opt.value === searchField)?.label || 'field'}`}
              onSearch={handleSearch}
              onChange={e => handleSearch(e.target.value)} // Real-time search
              enterButton={<Button type="primary">Search</Button>}
              allowClear
              style={{ width: 300 }}
              loading={loading}
            />
          </Space>

          <Table
            columns={columns}
            dataSource={memberData}
            loading={loading}
            pagination={{
              current: pageNumber,
              pageSize: pageSize,
              total: totalRecords,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Total ${total} members`,
            }}
            onChange={handleTableChange}
            rowKey="memberNumber"
            bordered
            scroll={{ x: 'max-content' }}
            style={{ background: '#fff' }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default MemberList;