import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Tooltip, 
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
  UndoOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { 
  Organization, 
  OrganizationFilters,
  INDUSTRIES,
  COUNTRIES
} from '../types/organizationTypes';
import { 
  getOrganizations, 
  deleteOrganization, 
  reactivateOrganization 
} from '../services/organizationService';
import { PageHeader } from '../components/EnterpriseComponents';

const { Search } = Input;
const { Option } = Select;

interface OrganizationListPageProps {
  onEdit?: (organization: Organization) => void;
  onView?: (organization: Organization) => void;
  onCreate?: () => void;
}

const OrganizationListPage: React.FC<OrganizationListPageProps> = ({
  onEdit,
  onView,
  onCreate
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<OrganizationFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'OrganizationName',
    sortDescending: false,
    isActive: true // Default to show active organizations
  });
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await getOrganizations(filters);
      if (response.success) {
        setOrganizations(response.data.items);
        setTotalCount(response.data.totalRecords);
      } else {
        message.error(response.message || 'Failed to fetch organizations');
      }
    } catch (error: any) {
      message.error('Error loading organizations: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [filters]);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteOrganization(id);
      if (response.success) {
        message.success('Organization deleted successfully');
        fetchOrganizations();
      } else {
        message.error(response.message || 'Failed to delete organization');
      }
    } catch (error: any) {
      message.error('Error deleting organization: ' + (error.message || 'Unknown error'));
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      const response = await reactivateOrganization(id);
      if (response.success) {
        message.success('Organization reactivated successfully');
        fetchOrganizations();
      } else {
        message.error(response.message || 'Failed to reactivate organization');
      }
    } catch (error: any) {
      message.error('Error reactivating organization: ' + (error.message || 'Unknown error'));
    }
  };

  const handleFilterChange = (key: keyof OrganizationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      pageNumber: 1 // Reset to first page when filtering
    }));
  };

  const handleTableChange = (pagination: any, _tableFilters: any, sorter: any) => {
    setFilters(prev => ({
      ...prev,
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || 'OrganizationName',
      sortDescending: sorter.order === 'descend'
    }));
  };

  const resetFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'OrganizationName',
      sortDescending: false,
      isActive: true
    });
  };

  const columns: ColumnsType<Organization> = [
    {
      title: 'Organization',
      dataIndex: 'organizationName',
      key: 'organizationName',
      sorter: true,
      render: (text: string, record: Organization) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {text}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {record.businessRegistrationNumber}
          </div>
        </div>
      )
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
      sorter: true,
      render: (industry: string) => (
        <Tag color="blue" style={{ borderRadius: '6px' }}>
          {industry}
        </Tag>
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (record: Organization) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.city}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {record.stateOrProvince}, {record.country}
          </div>
        </div>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (record: Organization) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.primaryContactName}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {record.primaryEmail}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {record.primaryPhoneNumber}
          </div>
        </div>
      )
    },
    {
      title: 'Employees',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      sorter: true,
      render: (count: number) => count.toLocaleString()
    },
    {
      title: 'Established',
      dataIndex: 'establishedDate',
      key: 'establishedDate',
      sorter: true,
      render: (date: string) => moment(date).format('MMM DD, YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'} style={{ borderRadius: '6px' }}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (record: Organization) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView?.(record)}
              style={{ color: 'var(--info-color)' }}
            />
          </Tooltip>
          
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit?.(record)}
              style={{ color: 'var(--primary-color)' }}
            />
          </Tooltip>
          
          {record.isActive ? (
            <Popconfirm
              title="Are you sure you want to delete this organization?"
              onConfirm={() => handleDelete(record.organizationId)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{ color: 'var(--error-color)' }}
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to reactivate this organization?"
              onConfirm={() => handleReactivate(record.organizationId)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Reactivate">
                <Button
                  type="text"
                  icon={<UndoOutlined />}
                  size="small"
                  style={{ color: 'var(--success-color)' }}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="organization-list-page">
      <PageHeader 
        title="Organizations"
        subtitle="Manage your organization directory"
        extra={
          <Space>
            <Button
              icon={<ExportOutlined />}
              className="enterprise-btn-secondary"
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
              className="enterprise-btn-primary"
            >
              Add Organization
            </Button>
          </Space>
        }
      />

      <Card className="enterprise-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="Search organizations..."
              allowClear
              onSearch={(value) => handleFilterChange('organizationName', value)}
              style={{ width: '100%' }}
            />
          </Col>
          
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Industry"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('industry', value)}
            >
              {INDUSTRIES.map(industry => (
                <Option key={industry} value={industry}>{industry}</Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Country"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('country', value)}
            >
              {COUNTRIES.map(country => (
                <Option key={country.value} value={country.value}>
                  {country.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={12} sm={6} md={3}>
            <Space>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Show Active:
              </span>
              <Switch
                checked={filters.isActive === true}
                onChange={(checked) => handleFilterChange('isActive', checked ? true : undefined)}
              />
            </Space>
          </Col>
          
          <Col xs={12} sm={6} md={3}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                title="Reset Filters"
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchOrganizations}
                loading={loading}
                title="Refresh"
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="enterprise-card enterprise-table">
        <Table<Organization>
          columns={columns}
          dataSource={organizations}
          loading={loading}
          rowKey="organizationId"
          pagination={{
            current: filters.pageNumber,
            pageSize: filters.pageSize,
            total: totalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} organizations`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default OrganizationListPage;
