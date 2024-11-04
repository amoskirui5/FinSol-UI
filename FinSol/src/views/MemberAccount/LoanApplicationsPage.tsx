import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import LoanApplicationsTable from '../../components/LoanApplicationsTable';

const LoanApplicationsPage: React.FC = () => {
  const navigate = useNavigate(); 

  const handleCreateLoanApplication = () => {
    navigate('/create-loan-application'); 
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Loan Applications</h1>
        <Button type="primary" onClick={handleCreateLoanApplication}>
          Create Loan Application
        </Button>
      </div>
      <LoanApplicationsTable />
    </div>
  );
};

export default LoanApplicationsPage;
