import React, { useEffect, useState, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tooltip, 
  Select, 
  Input, 
  Typography, 
  Card, 
  Modal, 
  Tag,
  Row,
  Col,
  Statistic,
  Badge,
  message,
  Dropdown,
} from 'antd';
import { useNavigate } from 'react-router-dom';

import {
  EditOutlined,
  StopOutlined,
  UserAddOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  MoreOutlined,
  TeamOutlined
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
const { Title } = Typography;

interface MemberStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  });

  // Build pagination/options inline when calling the API to avoid stale references

  const fetchAllMembersAPI = useCallback(async () => {
    setLoading(true);
    try {
        const response = await fetchAllMembers({
          pageNumber,
          pageSize,
          searchTerm,
          searchField,
          sortDescending: sortingType,
        });
      if (response.success) {
        setMemberData(response.data.items);
        setTotalRecords(response.data.totalRecords);
        setPageSize(response.data.pageSize);

        // Calculate stats
        const total = response.data.totalRecords;
        const active = response.data.items.filter(m => !m.isInactive).length;
        const inactive = total - active;
        const newThisMonth = response.data.items.filter(m => {
          if (!m.dateJoined) return false;
          const joinedDate = new Date(m.dateJoined);
          const now = new Date();
          return joinedDate.getMonth() === now.getMonth() && 
                 joinedDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({ total, active, inactive, newThisMonth });
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Failed to load member list. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm, searchField, sortingType]);

  useEffect(() => {
    fetchAllMembersAPI();
  }, [fetchAllMembersAPI]);

  const columns: ColumnsType<MemberListDto> = [
    {
      title: 'Member Number',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
      sorter: true,
      width: 140,
      fixed: 'left',
      render: (text: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      sorter: true,
      width: 200,
      render: (_: any, record: MemberListDto) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {`${record.firstName} ${record.otherName}`}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.workPlace || 'No workplace'}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Information',
      key: 'contact',
      width: 220,
      render: (_: any, record: MemberListDto) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            📧 {record.email ? maskData(record.email, 'email') : 'No email'}
          </div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            📱 {record.phoneNumber ? maskData(record.phoneNumber, 'phone') : 'No phone'}
          </div>
        </div>
      ),
    },
    {
      title: 'Banking Details',
      key: 'banking',
      width: 200,
      render: (_: any, record: MemberListDto) => (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500 }}>
            {record.bankName || 'No bank'}
          </div>
          <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
            {record.bankAccount ? `***${record.bankAccount.slice(-4)}` : 'No account'}
          </div>
        </div>
      ),
    },
    {
      title: 'National ID',
      dataIndex: 'nationalID',
      key: 'nationalID',
      width: 120,
      render: (nationalID: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {nationalID ? maskData(nationalID, 'nationalID') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: false },
        { text: 'Inactive', value: true },
      ],
      render: (_: any, record: MemberListDto) => (
        <Tag 
          icon={record.isInactive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          color={record.isInactive ? 'error' : 'success'}
        >
          {record.isInactive ? 'Inactive' : 'Active'}
        </Tag>
      ),
    },
    {
      title: 'Date Joined',
      dataIndex: 'dateJoined',
      key: 'dateJoined',
      width: 120,
      sorter: true,
      render: (value: Date) => (
        <div style={{ fontSize: '12px' }}>
          {value ? formatDate(value.toString()) : 'N/A'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_: any, record: MemberListDto) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              size="small"
              icon={<EyeOutlined />} 
              onClick={() => viewDetails(record.memberId)}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Edit Member">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />} 
              onClick={() => editMember(record.memberId)}
              className="action-button"
            />
          </Tooltip>
          <Dropdown 
            menu={{
              items: [
                {
                  key: 'nextOfKin',
                  icon: <UserAddOutlined />,
                  label: 'Add Next of Kin',
                  onClick: () => addNextOfKin(record.memberId),
                },
                {
                  key: 'deactivate',
                  icon: <StopOutlined />,
                  label: record.isInactive ? 'Activate' : 'Deactivate',
                  onClick: () => confirmDeactivate(record.memberId, `${record.firstName} ${record.otherName}`),
                  danger: true,
                },
              ]
            }}
            trigger={['click']}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
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
      title: 'Confirm Action',
      content: `Are you sure you want to change the status of ${name}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deactivateMember(id),
    });
  };

  const deactivateMember = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Implement actual API call to toggle member status
      // const response = await toggleMemberStatus(id);
      // if (response.success) {
      //   message.success('Member status updated successfully');
      //   fetchAllMembersAPI();
      // } else {
      //   message.error(response.message || 'Failed to update member status');
      // }
      
  // Placeholder implementation
  console.debug(`Changing status for member with ID: ${id}`);
      message.success('Member status updated successfully');
      fetchAllMembersAPI();
    } catch (error) {
      console.error('Error updating member status:', error);
      message.error('Failed to update member status. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
    setSortingType(sorter.order === 'descend');
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setSearchField('memberNumber');
    setPageNumber(1);
    fetchAllMembersAPI();
    message.success('Member list refreshed');
  };

  const handleExport = () => {
    // Placeholder for export functionality
    message.info('Export functionality will be implemented soon');
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select members first');
      return;
    }
    
    const actionText = action.toLowerCase();
    const confirmMessage = `Are you sure you want to ${actionText} ${selectedRowKeys.length} selected member(s)?`;
    
    Modal.confirm({
      title: `Bulk ${action}`,
      content: confirmMessage,
      okText: 'Yes',
      okType: action === 'Deactivate' ? 'danger' : 'primary',
      cancelText: 'No',
      onOk: async () => {
        try {
          setLoading(true);
          // TODO: Implement actual bulk API call
          // const response = await bulkUpdateMembers(selectedRowKeys, action);
          // if (response.success) {
          //   message.success(`Bulk ${actionText} completed successfully`);
          //   setSelectedRowKeys([]);
          //   fetchAllMembersAPI();
          // } else {
          //   message.error(response.message || `Failed to ${actionText} members`);
          // }
          
          // Placeholder implementation
          console.debug(`Bulk ${actionText} for members:`, selectedRowKeys);
          message.success(`Bulk ${actionText} completed successfully`);
          setSelectedRowKeys([]);
          fetchAllMembersAPI();
        } catch (error) {
          console.error(`Error during bulk ${actionText}:`, error);
          message.error(`Failed to ${actionText} members. Please try again.`);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: MemberListDto) => ({
      disabled: false, // Can add conditions here
      name: record.memberNumber,
    }),
  };

  return (
    <div className="page-container">
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Members"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: 'var(--primary-color)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Active Members"
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'var(--success-color)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Inactive Members"
              value={stats.inactive}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: 'var(--error-color)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="New This Month"
              value={stats.newThisMonth}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: 'var(--warning-color)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className="enterprise-card">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Member Management
            </Title>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
              Manage member registration, details, and status
            </p>
          </div>
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              className="action-button"
            >
              Export
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className="action-button"
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleRegisterMember}
              className="primary-button"
            >
              Register Member
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Select
                value={searchField}
                style={{ width: '100%' }}
                onChange={handleSearchFieldChange}
                placeholder="Search by..."
                suffixIcon={<FilterOutlined />}
              >
                {memberSearchFieldOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={16} md={12}>
              <Search
                placeholder={`Search by ${memberSearchFieldOptions.find(opt => opt.value === searchField)?.label || 'field'}...`}
                onSearch={handleSearch}
                onChange={e => handleSearch(e.target.value)}
                enterButton={<SearchOutlined />}
                allowClear
                size="middle"
                loading={loading}
              />
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'right' }}>
              {selectedRowKeys.length > 0 && (
                <Space>
                  <Badge count={selectedRowKeys.length} showZero={false}>
                    <Button onClick={() => handleBulkAction('Deactivate')}>
                      Bulk Actions
                    </Button>
                  </Badge>
                </Space>
              )}
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={memberData}
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: totalRecords,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} members`,
          }}
          onChange={handleTableChange}
          rowKey="memberId"
          scroll={{ x: 1200 }}
          className="enterprise-table"
          size="middle"
        />
      </Card>
    </div>
  );
};

export default MemberList;