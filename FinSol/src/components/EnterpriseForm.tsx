import React from 'react';
import { Form, Button, Card, Row, Col, Space, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader, EnterpriseButton } from './EnterpriseComponents';

interface EnterpriseFormProps {
  title: string;
  subtitle?: string;
  onSubmit: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
  children?: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
  showActions?: boolean;
  onReset?: () => void;
}

const EnterpriseForm: React.FC<EnterpriseFormProps> = ({
  title,
  subtitle,
  onSubmit,
  loading = false,
  initialValues,
  children,
  layout = 'vertical',
  showActions = true,
  onReset
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const handleReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="enterprise-form-container">
      <PageHeader 
        title={title}
        subtitle={subtitle}
      />
      
      <Card 
        className="enterprise-card"
        style={{ 
          background: 'var(--surface-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-base)'
        }}
      >
        <Form
          form={form}
          layout={layout}
          onFinish={handleSubmit}
          initialValues={initialValues}
          className="enterprise-form"
          requiredMark="optional"
          scrollToFirstError
        >
          {children}
          
          {showActions && (
            <>
              <Divider />
              <Row justify="end">
                <Col>
                  <Space size="middle">
                    <Button
                      onClick={handleReset}
                      icon={<ReloadOutlined />}
                      className="enterprise-btn-secondary"
                      disabled={loading}
                    >
                      Reset
                    </Button>
                    <EnterpriseButton
                      variant="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      onClick={() => form.submit()}
                    >
                      Save Changes
                    </EnterpriseButton>
                  </Space>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default EnterpriseForm;
