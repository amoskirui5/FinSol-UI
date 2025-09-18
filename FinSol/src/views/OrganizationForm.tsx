import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Space,
  message,
  Divider,
  Typography
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationFormValues,
  INDUSTRIES,
  COUNTRIES,
  KENYAN_CITIES
} from '../types/organizationTypes';
import {
  createOrganization,
  updateOrganization,
  getOrganizationById
} from '../services/organizationService';
import { PageHeader, EnterpriseButton } from '../components/EnterpriseComponents';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface OrganizationFormProps {
  organizationId?: string;
  onSuccess?: (organization: Organization) => void;
  onCancel?: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organizationId,
  onSuccess,
  onCancel
}) => {
  const [form] = Form.useForm<OrganizationFormValues>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit] = useState(!!organizationId);

  // Load organization data if editing
  useEffect(() => {
    if (organizationId) {
      loadOrganization();
    }
  }, [organizationId]);

  const loadOrganization = async () => {
    if (!organizationId) return;
    
    setLoading(true);
    try {
      const response = await getOrganizationById(organizationId);
      if (response.success && response.data) {
        const org = response.data;
        form.setFieldsValue({
          ...org,
          establishedDate: org.establishedDate ? moment(org.establishedDate) : null,
          licenseExpiryDate: org.licenseExpiryDate ? moment(org.licenseExpiryDate) : null
        });
      } else {
        message.error(response.message || 'Failed to load organization');
      }
    } catch (error: any) {
      message.error('Error loading organization: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: OrganizationFormValues) => {
    setSubmitting(true);
    try {
      const requestData = {
        ...values,
        establishedDate: values.establishedDate?.toISOString() || '',
        licenseExpiryDate: values.licenseExpiryDate?.toISOString() || ''
      };

      if (isEdit && organizationId) {
        const updateData: UpdateOrganizationRequest = {
          organizationName: requestData.organizationName,
          logo: requestData.logo,
          website: requestData.website,
          description: requestData.description,
          primaryContactName: requestData.primaryContactName,
          primaryEmail: requestData.primaryEmail,
          primaryPhoneNumber: requestData.primaryPhoneNumber,
          addressLine1: requestData.addressLine1,
          addressLine2: requestData.addressLine2,
          city: requestData.city,
          stateOrProvince: requestData.stateOrProvince,
          postalCode: requestData.postalCode,
          country: requestData.country,
          bankName: requestData.bankName,
          bankAccountName: requestData.bankAccountName,
          bankAccountNumber: requestData.bankAccountNumber,
          bankBranchCode: requestData.bankBranchCode,
          swiftCode: requestData.swiftCode,
          industry: requestData.industry,
          employeeCount: requestData.employeeCount,
          licenseNumber: requestData.licenseNumber,
          licenseExpiryDate: requestData.licenseExpiryDate
        };
        await updateOrganization(organizationId, updateData);
      } else {
        const createData: CreateOrganizationRequest = {
          ...requestData,
          businessRegistrationNumber: requestData.businessRegistrationNumber,
          taxIdentificationNumber: requestData.taxIdentificationNumber
        };
        await createOrganization(createData);
      }

      // Let global interceptor handle success messages
      if (onSuccess) {
        // Create a minimal organization object for callback compatibility
        const organizationData: Organization = {
          organizationId: organizationId || 'temp-id',
          organizationName: requestData.organizationName,
          logo: requestData.logo || '',
          website: requestData.website || '',
          description: requestData.description || '',
          primaryContactName: requestData.primaryContactName,
          primaryEmail: requestData.primaryEmail,
          primaryPhoneNumber: requestData.primaryPhoneNumber,
          addressLine1: requestData.addressLine1,
          addressLine2: requestData.addressLine2 || '',
          city: requestData.city,
          stateOrProvince: requestData.stateOrProvince,
          postalCode: requestData.postalCode,
          country: requestData.country,
          bankName: requestData.bankName,
          bankAccountName: requestData.bankAccountName,
          bankAccountNumber: requestData.bankAccountNumber,
          bankBranchCode: requestData.bankBranchCode,
          swiftCode: requestData.swiftCode || '',
          industry: requestData.industry,
          employeeCount: requestData.employeeCount,
          licenseNumber: requestData.licenseNumber,
          licenseExpiryDate: requestData.licenseExpiryDate,
          establishedDate: requestData.establishedDate,
          businessRegistrationNumber: requestData.businessRegistrationNumber || '',
          taxIdentificationNumber: requestData.taxIdentificationNumber || '',
          isActive: true,
          createdBy: '',
          createdDate: new Date().toISOString(),
          updatedBy: '',
          updatedDate: new Date().toISOString()
        };
        onSuccess(organizationData);
      }
    } catch (error) {
      // Global interceptor handles error messages
      console.error(`Error ${isEdit ? 'updating' : 'creating'} organization:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="organization-form">
      <PageHeader
        title={isEdit ? 'Edit Organization' : 'Create Organization'}
        subtitle={isEdit ? 'Update organization information' : 'Add a new organization to the system'}
        extra={
          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        }
      />

      <Card className="enterprise-card" loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="enterprise-form"
          requiredMark="optional"
          scrollToFirstError
        >
          {/* Basic Information */}
          <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
            Basic Information
          </Title>
          
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="organizationName"
                label="Organization Name"
                rules={[
                  { required: true, message: 'Organization name is required' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                  { max: 200, message: 'Name must not exceed 200 characters' }
                ]}
              >
                <Input placeholder="Enter organization name" />
              </Form.Item>
            </Col>
            
            {!isEdit && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="businessRegistrationNumber"
                  label="Business Registration Number"
                  rules={[
                    { required: true, message: 'Business registration number is required' }
                  ]}
                >
                  <Input placeholder="Enter business registration number" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={24}>
            {!isEdit && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="taxIdentificationNumber"
                  label="Tax Identification Number"
                  rules={[
                    { required: true, message: 'Tax ID is required' }
                  ]}
                >
                  <Input placeholder="Enter tax identification number" />
                </Form.Item>
              </Col>
            )}
            
            <Col xs={24} md={12}>
              <Form.Item
                name="industry"
                label="Industry"
                rules={[{ required: true, message: 'Industry is required' }]}
              >
                <Select placeholder="Select industry">
                  {INDUSTRIES.map(industry => (
                    <Option key={industry} value={industry}>
                      {industry}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="establishedDate"
                label="Established Date"
                rules={[{ required: true, message: 'Established date is required' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="employeeCount"
                label="Employee Count"
                rules={[
                  { required: true, message: 'Employee count is required' },
                  { type: 'number', min: 0, message: 'Employee count must be positive' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  placeholder="Enter employee count"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item name="website" label="Website">
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea 
              rows={3}
              placeholder="Enter organization description"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Divider />

          {/* Contact Information */}
          <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
            Contact Information
          </Title>
          
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="primaryContactName"
                label="Primary Contact Name"
                rules={[{ required: true, message: 'Primary contact name is required' }]}
              >
                <Input placeholder="Enter primary contact name" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="primaryEmail"
                label="Primary Email"
                rules={[
                  { required: true, message: 'Primary email is required' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input placeholder="contact@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="primaryPhoneNumber"
                label="Primary Phone Number"
                rules={[{ required: true, message: 'Primary phone number is required' }]}
              >
                <Input placeholder="+254 700 123 456" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Address Information */}
          <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
            Address Information
          </Title>
          
          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                name="addressLine1"
                label="Address Line 1"
                rules={[{ required: true, message: 'Address line 1 is required' }]}
              >
                <Input placeholder="Enter street address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="addressLine2" label="Address Line 2">
                <Input placeholder="Apartment, suite, etc. (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'City is required' }]}
              >
                <Select
                  placeholder="Select city"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label || option?.children)?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                >
                  {KENYAN_CITIES.map(city => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="stateOrProvince"
                label="State/Province"
                rules={[{ required: true, message: 'State/Province is required' }]}
              >
                <Input placeholder="Enter state or province" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Country is required' }]}
              >
                <Select placeholder="Select country">
                  {COUNTRIES.map(country => (
                    <Option key={country.value} value={country.value}>
                      {country.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="postalCode"
                label="Postal Code"
                rules={[{ required: true, message: 'Postal code is required' }]}
              >
                <Input placeholder="Enter postal code" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Banking Information */}
          <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
            Banking Information
          </Title>
          
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true, message: 'Bank name is required' }]}
              >
                <Input placeholder="Enter bank name" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="bankAccountName"
                label="Bank Account Name"
                rules={[{ required: true, message: 'Bank account name is required' }]}
              >
                <Input placeholder="Enter account name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="bankAccountNumber"
                label="Bank Account Number"
                rules={[{ required: true, message: 'Bank account number is required' }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="bankBranchCode"
                label="Bank Branch Code"
                rules={[{ required: true, message: 'Bank branch code is required' }]}
              >
                <Input placeholder="Enter branch code" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item name="swiftCode" label="SWIFT Code">
                <Input placeholder="Enter SWIFT code (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* License Information */}
          <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
            License Information
          </Title>
          
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="licenseNumber"
                label="License Number"
                rules={[{ required: true, message: 'License number is required' }]}
              >
                <Input placeholder="Enter license number" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="licenseExpiryDate"
                label="License Expiry Date"
                rules={[{ required: true, message: 'License expiry date is required' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Form Actions */}
          <Row justify="end">
            <Col>
              <Space size="middle">
                <Button
                  onClick={handleReset}
                  icon={<ReloadOutlined />}
                  disabled={submitting}
                >
                  Reset
                </Button>
                <EnterpriseButton
                  variant="primary"
                  icon={<SaveOutlined />}
                  loading={submitting}
                  onClick={() => form.submit()}
                >
                  {isEdit ? 'Update' : 'Create'} Organization
                </EnterpriseButton>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default OrganizationForm;
