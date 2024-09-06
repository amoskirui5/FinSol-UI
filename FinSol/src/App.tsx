import React,{useState} from 'react';
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
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/member-list' element={<MemberList />} />
          <Route path='/member-registration' element={<MemberRegistrationForm />} />
          <Route path='/change-password' element={<ChangePasswordForm onSubmit={handlePasswordChange} />} />
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
