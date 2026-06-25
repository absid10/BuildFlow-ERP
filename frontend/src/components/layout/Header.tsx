/**
 * BuildFlow ERP — Header Component
 * 
 * Search, notifications bell, theme toggle, user dropdown.
 */

import React from 'react';
import { Layout, Input, Badge, Avatar, Dropdown, Space, Switch, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `${user?.full_name}`,
      disabled: true,
    },
    {
      key: 'role',
      label: (
        <span style={{ textTransform: 'capitalize', opacity: 0.6, fontSize: 12 }}>
          {user?.role}
        </span>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <AntHeader className="app-header">
      <Space size="middle" align="center">
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          onClick: onToggleSidebar,
          style: { fontSize: 18, cursor: 'pointer' },
        })}
        <Input
          placeholder="Search... (Ctrl+K)"
          prefix={<SearchOutlined style={{ opacity: 0.4 }} />}
          style={{ width: 320, borderRadius: 8 }}
          size="middle"
        />
      </Space>

      <Space size="middle" align="center">
        {/* Theme Toggle */}
        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
        </Tooltip>

        {/* User Menu */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              style={{
                backgroundColor: '#3B82F6',
                cursor: 'pointer',
              }}
              icon={<UserOutlined />}
            />
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
