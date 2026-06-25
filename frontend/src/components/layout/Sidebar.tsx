/**
 * BuildFlow ERP — Sidebar Component
 * 
 * Per frontend-design skill: Distinctive, professional sidebar.
 * Per kpi-dashboard-design skill: Module-organized navigation.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  BankOutlined,
  ShopOutlined,
  HomeOutlined,
  DollarOutlined,
  CalendarOutlined,
  WalletOutlined,
  BarChartOutlined,
  FileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/AuthContext';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: '/projects',
        icon: <ProjectOutlined />,
        label: 'Projects',
      },
      {
        key: '/contractors',
        icon: <TeamOutlined />,
        label: 'Contractors',
      },
      {
        key: 'office',
        icon: <BankOutlined />,
        label: 'Office',
        children: [
          { key: '/office/employees', label: 'Employees' },
          { key: '/office/salaries', label: 'Salaries' },
          { key: '/office/expenses', label: 'Expenses' },
        ],
      },
      {
        key: '/investments',
        icon: <ShopOutlined />,
        label: 'Investments',
      },
      {
        key: 'sales',
        icon: <HomeOutlined />,
        label: 'Sales',
        children: [
          { key: '/sales/properties', label: 'Properties' },
          { key: '/sales/customers', label: 'Customers' },
          { key: '/sales', label: 'All Sales' },
        ],
      },
      {
        key: '/tuesday-payments',
        icon: <CalendarOutlined />,
        label: 'Tuesday Payments',
      },
      {
        key: '/loans',
        icon: <WalletOutlined />,
        label: 'Loans',
      },
      {
        key: '/reports',
        icon: <BarChartOutlined />,
        label: 'Reports',
      },
      {
        key: '/documents',
        icon: <FileOutlined />,
        label: 'Documents',
      },
    ];

    // Admin-only menu
    if (user?.role === 'admin') {
      items.push({
        key: '/users',
        icon: <UserOutlined />,
        label: 'User Management',
      });
    }

    return items;
  };

  const getSelectedKeys = (): string[] => {
    const path = location.pathname;
    // Handle exact and nested routes
    if (path === '/') return ['/'];
    
    // Find the best match
    const menuPaths = [
      '/projects', '/contractors', '/office/employees', '/office/salaries',
      '/office/expenses', '/investments', '/sales/properties', '/sales/customers',
      '/sales', '/tuesday-payments', '/loans', '/reports', '/documents', '/users',
    ];
    
    const match = menuPaths
      .filter((p) => path.startsWith(p))
      .sort((a, b) => b.length - a.length)[0];
    
    return match ? [match] : ['/'];
  };

  const getOpenKeys = (): string[] => {
    const path = location.pathname;
    if (path.startsWith('/office')) return ['office'];
    if (path.startsWith('/sales')) return ['sales'];
    return [];
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      collapsedWidth={80}
      breakpoint="lg"
      className="app-sider"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        className="sidebar-logo"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
      >
        <div className="sidebar-logo-icon">B</div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            BuildFlow <span>ERP</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={collapsed ? [] : getOpenKeys()}
        items={getMenuItems()}
        onClick={({ key }) => {
          if (!key.startsWith('office') && !key.startsWith('sales') && key !== 'office' && key !== 'sales') {
            navigate(key);
          }
        }}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
