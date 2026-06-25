/**
 * BuildFlow ERP — Ant Design Theme Configuration
 * 
 * Per frontend-design skill: Premium, dark-mode-first UI.
 * Per kpi-dashboard-design skill: Consistent colors, professional aesthetic.
 */

import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';

const { darkAlgorithm, defaultAlgorithm } = antdTheme;

// Brand colors — inspired by construction/architecture
const brandColors = {
  primary: '#3B82F6',       // Vibrant blue
  primaryHover: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
};

export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: brandColors.primary,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    colorInfo: brandColors.info,
    borderRadius: 8,
    fontSize: 14,
    colorBgContainer: '#141414',
    colorBgElevated: '#1F1F1F',
    colorBgLayout: '#0A0A0A',
    colorBorder: '#303030',
    colorBorderSecondary: '#252525',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorTextBase: '#E5E7EB',
    controlHeight: 40,
  },
  components: {
    Layout: {
      siderBg: '#111111',
      headerBg: '#141414',
      bodyBg: '#0A0A0A',
    },
    Menu: {
      darkItemBg: '#111111',
      darkSubMenuItemBg: '#0D0D0D',
      darkItemSelectedBg: 'rgba(59, 130, 246, 0.15)',
      darkItemSelectedColor: brandColors.primary,
      darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
      itemBorderRadius: 8,
      itemMarginBlock: 4,
      itemMarginInline: 8,
      iconSize: 18,
    },
    Card: {
      colorBgContainer: '#141414',
      borderRadiusLG: 12,
    },
    Table: {
      colorBgContainer: '#141414',
      headerBg: '#1A1A1A',
      borderColor: '#252525',
      rowHoverBg: 'rgba(59, 130, 246, 0.06)',
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      primaryShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#1A1A1A',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#1A1A1A',
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Drawer: {
      colorBgElevated: '#1A1A1A',
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Statistic: {
      titleFontSize: 13,
      contentFontSize: 28,
    },
  },
};

export const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: brandColors.primary,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    colorInfo: brandColors.info,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    controlHeight: 40,
    colorBgLayout: '#F5F5F7',
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F5F5F7',
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginBlock: 4,
      itemMarginInline: 8,
      iconSize: 18,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Table: {
      headerBg: '#FAFAFA',
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      primaryShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Statistic: {
      titleFontSize: 13,
      contentFontSize: 28,
    },
  },
};

export { brandColors };
