import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppHeader from './components/Header';
import RegisterMemberForm from './views/RegisterMemberForm';
import NotFound from './views/NotFound';
import MemberList from './views/MemberList';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} onCollapse={(collapsed) => setCollapsed(collapsed)} />
        <Layout>
          <AppHeader collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: 'white',
              borderRadius: '8px',
            }}
          >
            <Routes>
            <Route path="/member-list" element={<MemberList />} />
              <Route path="/member-registration" element={<RegisterMemberForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
              padding: '10px 50px',
              background: 'white',
              borderTop: '1px solid #e8e8e8',
            }}
          >
            Footer Content
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
