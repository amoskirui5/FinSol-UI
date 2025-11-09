import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './views/UserLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import PageNotFound from './views/PageNotFound';
import Dashboard from './views/Dashboard';
import MemberRegistrationForm from './views/RegisterMemberForm';
import MemberList from './views/Members/MemberList';
import UserList from './views/UserList';
import { User } from './types/System/systemUsersTypes';
import ChangePasswordForm, { ChangePasswordFormValues } from './views/ChangePasswordForm';
import { UUID } from 'crypto';
import AccountClassTableListPage from './views/AccountClassTableListPage';
import AccountClassRegistration from './views/AccountClassRegistration';
import ChartOfAccountsListPage from './views/ChartOfAccountsListPage';
import ChartOfAccountsRegistrationForm from './views/ChartOfAccountsRegistrationForm';
import LoanTypeForm from './views/LoanTypeForm';
import LoanTypesPage from './views/LoanTypesPage';
import LoanTypeDetailsPage from './views/LoanTypeDetailsPage';
import MemberForm from './views/Members/MemberForm';
import MemberDetails from './views/Members/MemberDetails';
import MemberAccountsTable from './views/MemberAccount/MemberAccountsTable';
import CreateMemberAccountForm from './views/MemberAccount/CreateMemberAccountForm';
import CreateReceiptForm from './views/Members/CreateReceiptForm';
import LoanApplicationForm from './views/MemberAccount/LoanApplicationForm';
import LoanApplicationsPage from './views/MemberAccount/LoanApplicationsPage';
import LoanApprovalForm from './views/MemberAccount/LoanApprovalForm';
import LoanDisbursementForm from './views/MemberAccount/LoanDisbursementForm';
import MemberStatement from './views/MemberAccount/MemberStatement';
import TrialBalance from './views/Financials/TrialBalance';
import BalanceSheet from './views/Financials/BalanceSheet';
import CashbookDisplay from './views/Financials/CashbookDisplay';
import CreatePaymentForm from './views/Members/CreatePaymentForm';
import NextOfKinForm from './views/Members/NextOfKinForm';
import FinancialYearTable from './components/FinancialYearPage';
import OrganizationManagementPage from './views/OrganizationManagementPage';
import ProfitLoss from './views/Financials/ProfitLoss';
import LoanApprovals from './views/LoanApprovals';
import LoanDisbursements from './views/LoanDisbursements';
import MemberDeposits from './views/MemberDeposits';
import MemberShareCapital from './views/MemberShareCapital';
import Administration from './views/Administration';
import UserRoles from './views/UserRoles';
import AccessLogs from './views/AccessLogs';
import GeneralSettings from './views/GeneralSettings';
import EmailSettings from './views/EmailSettings';
import BackupRestore from './views/BackupRestore';
import PasswordPolicy from './views/PasswordPolicy';
import TwoFactorAuth from './views/TwoFactorAuth';
import AuditTrail from './views/AuditTrail';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleStatusChange = (id: UUID, isActive: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isActive } : user
      )
    );
  };
  const handlePasswordChange = (_values: ChangePasswordFormValues) => {
    // Password change handling will be implemented here (avoid logging sensitive data)
  };


  return (
    <Router>

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/members-list' element={<MemberList />} />
          <Route path='/member-registration' element={<MemberRegistrationForm />} />
          <Route path='/account-class' element={<AccountClassTableListPage />} />
          <Route path='/register-account-class' element={<AccountClassRegistration />} />
          <Route path='/change-password' element={<ChangePasswordForm onSubmit={handlePasswordChange} />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccountsListPage />} />
          <Route path="/chart-of-accounts/register" element={<ChartOfAccountsRegistrationForm />} />
          <Route path="/loan-type/register" element={<LoanTypeForm />} />
          <Route path="/loan-type/edit/:id" element={<LoanTypeForm />} />
          <Route path="/edit/:id" element={<ChartOfAccountsRegistrationForm />} />
          <Route path="/account-class/edit/:id" element={<AccountClassRegistration />} />
          <Route path="/loan-types/details/:id" element={<LoanTypeDetailsPage />} />
          <Route path='/loan-types' element={<LoanTypesPage />} />
          <Route path="/members/register" element={<MemberForm isUpdate={false} />} />
          <Route path="/members/edit/:id" element={<MemberForm isUpdate={true} />} />
          <Route path="/members/details/:id" element={<MemberDetails />} />
          <Route path="/member-account-settings" element={<MemberAccountsTable />} />
          <Route path="/create-member-account" element={<CreateMemberAccountForm />} />
          <Route path='/member-receipt' element={<CreateReceiptForm />} />
          <Route path='/create-loan-application' element={<LoanApplicationForm />} />
          <Route path='/loan-applications' element={<LoanApplicationsPage />} />
          <Route path='/loan-approval/:loanApplicationId' element={<LoanApprovalForm />} />
          <Route path='/loan-disbursement/:loanApplicationId' element={<LoanDisbursementForm />} />
          <Route path='/member-statement' element={<MemberStatement />} />
          <Route path='/finance/trial-balance' element={<TrialBalance />} />
          <Route path='/finance/balance-sheet' element={<BalanceSheet />} />
          <Route path='/finance/cash-book' element={<CashbookDisplay />} />
          <Route path='/member-payments' element={<CreatePaymentForm />} />
          <Route path='/next-of-kin' element={<NextOfKinForm />} />
          <Route path='/financial-year' element={<FinancialYearTable />} />
          <Route path='/organizations' element={<OrganizationManagementPage />} />
          <Route path='/finance/profit-loss' element={<ProfitLoss />} />
          <Route path='/loan-approvals' element={<LoanApprovals />} />
          <Route path='/loan-disbursements' element={<LoanDisbursements />} />
          <Route path='/member-deposits' element={<MemberDeposits />} />
          <Route path='/member-share-capital' element={<MemberShareCapital />} />
          <Route path='/administration' element={<Administration />} />
          <Route path='/user-roles' element={<UserRoles />} />
          <Route path='/access-logs' element={<AccessLogs />} />
          <Route path='/general-settings' element={<GeneralSettings />} />
          <Route path='/email-settings' element={<EmailSettings />} />
          <Route path='/backup-restore' element={<BackupRestore />} />
          <Route path='/password-policy' element={<PasswordPolicy />} />
          <Route path='/two-factor-authentication' element={<TwoFactorAuth />} />
          <Route path='/audit-trail' element={<AuditTrail />} />


          <Route
            path="/user-accounts"
            element={
              <UserList
                users={users}
                onStatusChange={handleStatusChange}
              />
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>

  );
};

export default App;
