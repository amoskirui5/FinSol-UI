import React, { useState } from 'react';
import { Modal, message } from 'antd';
import OrganizationListPage from './OrganizationListPage';
import OrganizationForm from './OrganizationForm';
import { Organization } from '../types/organizationTypes';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const OrganizationManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreate = () => {
    setSelectedOrganization(null);
    setViewMode('create');
    setIsModalVisible(true);
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setViewMode('edit');
    setIsModalVisible(true);
  };

  const handleView = (organization: Organization) => {
    setSelectedOrganization(organization);
    setViewMode('view');
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrganization(null);
    setViewMode('list');
  };

  const handleFormSuccess = (_organization: Organization) => {
    message.success(`Organization ${viewMode === 'create' ? 'created' : 'updated'} successfully!`);
    handleModalClose();
    // The list will refresh automatically due to the organization change
  };

  const getModalTitle = () => {
    switch (viewMode) {
      case 'create':
        return 'Create New Organization';
      case 'edit':
        return `Edit Organization: ${selectedOrganization?.organizationName || ''}`;
      case 'view':
        return `Organization Details: ${selectedOrganization?.organizationName || ''}`;
      default:
        return '';
    }
  };

  const renderModalContent = () => {
    if (viewMode === 'view') {
      return <OrganizationDetailsView organization={selectedOrganization} />;
    }
    
    return (
      <OrganizationForm
        organizationId={selectedOrganization?.organizationId}
        onSuccess={handleFormSuccess}
        onCancel={handleModalClose}
      />
    );
  };

  return (
    <div className="organization-management-page">
      <OrganizationListPage
        onCreate={handleCreate}
        onEdit={handleEdit}
        onView={handleView}
      />

      <Modal
        title={getModalTitle()}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={viewMode === 'view' ? 800 : 1200}
        destroyOnClose
        style={{ top: 20 }}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

// Organization Details View Component
interface OrganizationDetailsViewProps {
  organization: Organization | null;
}

const OrganizationDetailsView: React.FC<OrganizationDetailsViewProps> = ({ organization }) => {
  if (!organization) {
    return <div>No organization data available</div>;
  }

  return (
    <div className="organization-details-view" style={{ padding: '24px' }}>
      <div className="organization-details-grid">
        {/* Add detailed view implementation here */}
        <p><strong>Organization Name:</strong> {organization.organizationName}</p>
        <p><strong>Business Registration:</strong> {organization.businessRegistrationNumber}</p>
        <p><strong>Industry:</strong> {organization.industry}</p>
        <p><strong>Contact:</strong> {organization.primaryContactName}</p>
        <p><strong>Email:</strong> {organization.primaryEmail}</p>
        <p><strong>Phone:</strong> {organization.primaryPhoneNumber}</p>
        <p><strong>Location:</strong> {organization.city}, {organization.stateOrProvince}, {organization.country}</p>
        <p><strong>Employee Count:</strong> {organization.employeeCount.toLocaleString()}</p>
        <p><strong>Status:</strong> {organization.isActive ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
};

export default OrganizationManagementPage;
