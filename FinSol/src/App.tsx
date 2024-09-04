import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './views/UserLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import PageNotFound from './views/PageNotFound';
import Dashboard from './views/Dashboard';
import MemberRegistrationForm from './views/RegisterMemberForm';
import MemberList from './views/MemberList';


const App: React.FC = () => {

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
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>

  );
};

export default App;
