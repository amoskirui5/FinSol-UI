import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './views/UserLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import PageNotFound from './views/PageNotFound';
import Dashboard from './views/Dashboard';
import MemberRegistrationForm from './views/RegisterMemberForm';
import MemberList from './views/MemberList';
import UserList from './views/UserList';
import { User } from './types/systemUsersTypes';
import ChangePasswordForm, { ChangePasswordFormValues } from './views/ChangePasswordForm';
import { UUID } from 'crypto';
import AccountClassTableListPage from './views/AccountClassTableListPage';
import AccountClassRegistration from './views/AccountClassRegistration';
import ChartOfAccountsListPage from './views/ChartOfAccountsListPage';
import ChartOfAccountsRegistrationForm from './views/ChartOfAccountsRegistrationForm';
import LoanTypeForm from './views/LoanTypeForm';
import { createLoanType, editLoanType } from './services/loanTypeService';
import LoanTypesPage from './views/LoanTypesPage';
import LoanTypeDetailsPage from './views/LoanTypeDetailsPage';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleStatusChange = (id: UUID, isActive: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isActive } : user
      )
    );
  };
  const handlePasswordChange = (values: ChangePasswordFormValues) => {
    console.log('Password change request:', values);
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
          <Route index  element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/member-list' element={<MemberList />} />
          <Route path='/member-registration' element={<MemberRegistrationForm />} />
          <Route path='/account-class' element={<AccountClassTableListPage />} />
          <Route path='/register-account-class' element={<AccountClassRegistration />} />
          <Route path='/change-password' element={<ChangePasswordForm onSubmit={handlePasswordChange} />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccountsListPage />} />
          <Route path="/chart-of-accounts/register" element={<ChartOfAccountsRegistrationForm />} />
          <Route path="/loan-type/register" element={<LoanTypeForm/>} />
          <Route path="/loan-type/edit/:id" element={<LoanTypeForm />} />
          <Route path="/edit/:id" element={<ChartOfAccountsRegistrationForm />} /> 
          <Route path="/account-class/edit/:id" element={<AccountClassRegistration />} /> 
          <Route path="/loan-types/details/:id" element={<LoanTypeDetailsPage />} /> 
          <Route path='/loan-types' element={<LoanTypesPage/>}/>
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
