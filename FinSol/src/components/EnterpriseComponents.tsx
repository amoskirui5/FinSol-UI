import React from 'react';
import { Button, Card, Typography, Space, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Status Badge Component
interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending';
  text: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const statusConfig = {
    success: { color: 'var(--success-color)', icon: <CheckCircleOutlined /> },
    error: { color: 'var(--error-color)', icon: <CloseCircleOutlined /> },
    warning: { color: 'var(--warning-color)', icon: <ClockCircleOutlined /> },
    info: { color: 'var(--info-color)', icon: <ClockCircleOutlined /> },
    pending: { color: 'var(--text-muted)', icon: <ClockCircleOutlined /> },
  };

  const config = statusConfig[status];

  return (
    <Tag 
      icon={config.icon} 
      color={config.color}
      style={{
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        padding: '4px 12px',
        border: `1px solid ${config.color}33`
      }}
    >
      {text}
    </Tag>
  );
};

// Currency Formatter Component
interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  size?: 'small' | 'default' | 'large';
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  amount, 
  currency = 'KSH', 
  size = 'default' 
}) => {
  const fontSize = {
    small: '14px',
    default: '16px',
    large: '20px'
  };

  return (
    <Text 
      strong 
      style={{ 
        color: 'var(--primary-color)', 
        fontSize: fontSize[size],
        fontFamily: 'monospace'
      }}
    >
      {currency} {amount.toLocaleString()}
    </Text>
  );
};

// Enterprise Button variants
interface EnterpriseButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
}

export const EnterpriseButton: React.FC<EnterpriseButtonProps> = ({
  variant = 'primary',
  children,
  icon,
  onClick,
  loading,
  disabled,
  size = 'middle'
}) => {
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
      border: 'none',
      color: 'white'
    },
    secondary: {
      background: 'var(--surface-color)',
      border: '1px solid var(--border-medium)',
      color: 'var(--text-primary)'
    },
    success: {
      background: 'linear-gradient(135deg, var(--success-color), var(--success-light))',
      border: 'none',
      color: 'white'
    },
    danger: {
      background: 'linear-gradient(135deg, var(--error-color), var(--error-light))',
      border: 'none',
      color: 'white'
    },
    warning: {
      background: 'linear-gradient(135deg, var(--warning-color), var(--warning-light))',
      border: 'none',
      color: 'white'
    }
  };

  return (
    <Button
      type={variant === 'primary' ? 'primary' : 'default'}
      icon={icon}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      size={size}
      style={{
        ...variantStyles[variant],
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {children}
    </Button>
  );
};

// Page Header Component
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  breadcrumb?: { title: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  extra, 
  breadcrumb 
}) => {
  return (
    <div 
      style={{
        background: 'var(--surface-color)',
        padding: '24px 32px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)'
      }}
      className="page-header fade-in"
    >
      {breadcrumb && (
        <div style={{ marginBottom: '8px' }}>
          <Space split="/">
            {breadcrumb.map((crumb, index) => (
              <Text 
                key={index}
                style={{ 
                  color: index === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '12px'
                }}
              >
                {crumb.title}
              </Text>
            ))}
          </Space>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title 
            level={2} 
            style={{ 
              margin: '0 0 8px 0', 
              color: 'var(--text-primary)',
              fontWeight: 600
            }}
          >
            {title}
          </Title>
          {subtitle && (
            <Text style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              {subtitle}
            </Text>
          )}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'var(--primary-color)',
  loading = false
}) => {
  return (
    <Card 
      className="metrics-card" 
      loading={loading}
      hoverable
      style={{
        background: 'linear-gradient(135deg, var(--surface-color) 0%, var(--background-primary) 100%)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color}, ${color}88)`
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Text>
          <div style={{ margin: '8px 0' }}>
            <Title 
              level={2} 
              style={{ 
                color: color, 
                margin: 0,
                fontWeight: 700,
                fontSize: '32px'
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Title>
          </div>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Text 
                style={{ 
                  color: trend.isPositive ? 'var(--success-color)' : 'var(--error-color)',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Text>
            </div>
          )}
        </div>
        {icon && (
          <div style={{ 
            fontSize: '24px', 
            color: `${color}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: `${color}11`,
            borderRadius: 'var(--radius-md)'
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
