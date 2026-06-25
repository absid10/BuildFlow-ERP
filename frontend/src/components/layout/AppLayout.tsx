/**
 * BuildFlow ERP — App Layout Shell
 * 
 * Main layout wrapping all authenticated pages.
 * Sidebar + Header + Content area with breadcrumbs.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="app-layout" style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Header
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />
        <Content className="content-wrapper">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
