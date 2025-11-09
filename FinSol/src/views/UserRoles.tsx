import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Row, Col, Tag, Input, Modal, Form, Select, Checkbox, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserRole {
  key: string;
  roleId: string;
  roleName: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModified: string;
}

const UserRoles: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserRole[]>([]);
  const [filteredData, setFilteredData] = useState<UserRole[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const availablePermissions = [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'members.view', 'members.create', 'members.edit', 'members.delete',
    'loans.view', 'loans.create', 'loans.approve', 'loans.disburse',
    'deposits.view', 'deposits.create', 'deposits.edit',
    'reports.view', 'reports.generate',
    'settings.view', 'settings.edit',
    'admin.full_access'
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with actual service
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData: UserRole[] = [
          {
            key: '1',
            roleId: 'ROLE001',
            roleName: 'Administrator',
            description: 'Full system access with all permissions',
            permissions: ['admin.full_access'],
            userCount: 2,
            status: 'active',
            createdDate: '2024-01-01',
            lastModified: '2024-01-20'
          },
          {
            key: '2',
            roleId: 'ROLE002',
            roleName: 'Loan Officer',
            description: 'Manage loan applications and approvals',
            permissions: ['loans.view', 'loans.create', 'loans.approve', 'members.view'],
            userCount: 5,
            status: 'active',
            createdDate: '2024-01-01',
            lastModified: '2024-01-15'
          },
          {
            key: '3',
            roleId: 'ROLE003',
            roleName: 'Teller',
            description: 'Handle member deposits and basic transactions',
            permissions: ['members.view', 'deposits.view', 'deposits.create'],
            userCount: 8,
            status: 'active',
            createdDate: '2024-01-01',
            lastModified: '2024-01-10'
          },
          {
            key: '4',
            roleId: 'ROLE004',
            roleName: 'Accountant',
            description: 'Generate reports and view financial data',
            permissions: ['reports.view', 'reports.generate', 'deposits.view', 'loans.view'],
            userCount: 3,
            status: 'active',
            createdDate: '2024-01-01',
            lastModified: '2024-01-18'
          }
        ];
        setData(mockData);
      } catch (error) {
        console.error('Error fetching user roles:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter(item =>
        item.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.roleId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [data, searchText]);

  

  const handleCreate = () => {
    setSelectedRole(null);
    setIsEditing(false);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      permissions: []
    });
    setModalVisible(true);
  };

  const handleEdit = (record: UserRole) => {
    setSelectedRole(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record
    });
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        roleId: selectedRole ? selectedRole.roleId : `ROLE${String(data.length + 1).padStart(3, '0')}`,
        userCount: selectedRole ? selectedRole.userCount : 0,
        createdDate: selectedRole ? selectedRole.createdDate : new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      if (isEditing && selectedRole) {
        // Update existing role
        const updatedData = data.map(item => 
          item.key === selectedRole.key 
            ? { ...item, ...formattedValues }
            : item
        );
        setData(updatedData);
      } else {
        // Create new role
        const newRole: UserRole = {
          key: String(data.length + 1),
          ...formattedValues
        };
        setData([...data, newRole]);
      }
      
      setModalVisible(false);
      setSelectedRole(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getStatusTag = (status: string) => {
    return status === 'active' ? 
      <Tag color="green">Active</Tag> : 
      <Tag color="red">Inactive</Tag>;
  };

  const columns = [
    {
      title: 'Role ID',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text: string) => <Text strong style={{ color: 'var(--primary-color)' }}>{text}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <div>
          {permissions.slice(0, 2).map(permission => (
            <Tag key={permission} style={{ margin: '2px' }}>
              {permission}
            </Tag>
          ))}
          {permissions.length > 2 && (
            <Tag style={{ margin: '2px' }}>
              +{permissions.length - 2} more
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'Users',
      dataIndex: 'userCount',
      key: 'userCount',
      align: 'center' as const,
      render: (count: number) => (
        <div style={{ textAlign: 'center' }}>
          <UserOutlined style={{ marginRight: 4 }} />
          <Text strong>{count}</Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: UserRole) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.info(`Delete role: ${record.roleId} (not implemented)`)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="enterprise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>
                  User Roles
                </Title>
                <Text type="secondary">
                  Manage user roles and permissions
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                className="enterprise-btn-primary"
              >
                Create Role
              </Button>
            </div>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by role name or description"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
            </Row>
            
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              className="enterprise-table"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} roles`,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? 'Edit Role' : 'Create New Role'}
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false);
          setSelectedRole(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="Role Name"
                rules={[{ required: true, message: 'Please enter role name' }]}
              >
                <Input placeholder="Enter role name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter role description"
            />
          </Form.Item>
          
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                {availablePermissions.map(permission => (
                  <Col span={12} key={permission}>
                    <Checkbox value={permission} style={{ fontSize: '12px' }}>
                      {permission}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRoles;