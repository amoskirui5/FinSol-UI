import React from 'react';
import { Table, Card, Input, Button, Space, Typography, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;

interface EnterpriseTableProps<T> {
  title: string;
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  addable?: boolean;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  onExport?: () => void;
  rowKey?: string | ((record: T) => string);
  pagination?: any;
}

function EnterpriseTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  loading = false,
  searchable = true,
  exportable = false,
  addable = false,
  onSearch,
  onAdd,
  onExport,
  rowKey = 'id',
  pagination = { pageSize: 10, showSizeChanger: true, showQuickJumper: true }
}: EnterpriseTableProps<T>) {
  
  const enhancedColumns: ColumnsType<T> = columns.map((col) => ({
    ...col,
    className: 'enterprise-table-cell',
    render: col.render || ((value: any) => {
      // Enhanced rendering for common data types
      if (typeof value === 'boolean') {
        return (
          <Tag color={value ? 'success' : 'error'}>
            {value ? 'Active' : 'Inactive'}
          </Tag>
        );
      }
      if (typeof value === 'number' && col.dataIndex?.toString().toLowerCase().includes('amount')) {
        return `KSH ${value.toLocaleString()}`;
      }
      return value;
    }),
  }));

  return (
    <Card
      className="enterprise-card enterprise-table-container"
      style={{ marginBottom: '24px' }}
    >
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <Title 
            level={3} 
            style={{ 
              margin: 0, 
              color: 'var(--text-primary)',
              fontSize: '20px',
              fontWeight: 600
            }}
          >
            {title}
          </Title>
        </div>
        
        <Space wrap>
          {searchable && onSearch && (
            <Search
              placeholder="Search records..."
              allowClear
              style={{ width: '280px' }}
              onSearch={onSearch}
              className="enterprise-search"
            />
          )}
          
          <Button
            icon={<FilterOutlined />}
            className="enterprise-btn-secondary"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Filter
          </Button>
          
          {exportable && onExport && (
            <Button
              icon={<ExportOutlined />}
              onClick={onExport}
              className="enterprise-btn-secondary"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Export
            </Button>
          )}
          
          {addable && onAdd && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAdd}
              className="enterprise-btn-primary"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Add New
            </Button>
          )}
        </Space>
      </div>
      
      <Table<T>
        columns={enhancedColumns}
        dataSource={data}
        loading={loading}
        rowKey={rowKey}
        pagination={pagination}
        className="enterprise-table"
        scroll={{ x: 'max-content' }}
        size="middle"
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
        style={{
          background: 'var(--surface-color)',
          borderRadius: 'var(--radius-lg)',
        }}
      />
    </Card>
  );
}

export default EnterpriseTable;
