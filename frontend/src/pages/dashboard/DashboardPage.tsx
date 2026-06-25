import React from 'react';
import { Row, Col, Card, Typography, List, Avatar, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
  DollarOutlined,
  ProjectOutlined,
  ShopOutlined,
  WalletOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { dashboardApi } from '../../api/dashboard';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { data: kpis, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: dashboardApi.getKPIs,
  });

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['dashboard', 'revenueSummary'],
    queryFn: dashboardApi.getRevenueSummary,
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['dashboard', 'recentActivity'],
    queryFn: dashboardApi.getRecentActivity,
  });

  return (
    <div className="fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your business metrics and recent activity."
        extra={<Text type="secondary">{dayjs().format('MMMM D, YYYY')}</Text>}
      />

      {/* KPI Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Revenue"
            value={kpis?.total_revenue || 0}
            prefix="$"
            icon={<RiseOutlined />}
            color="blue"
            trend={kpis?.revenue_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Expenses"
            value={kpis?.total_expenses || 0}
            prefix="$"
            icon={<DollarOutlined />}
            color="red"
            trend={kpis?.expense_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Net Profit"
            value={kpis?.net_profit || 0}
            prefix="$"
            icon={<WalletOutlined />}
            color="green"
            trend={kpis?.profit_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Outstanding Payments"
            value={kpis?.outstanding_payments || 0}
            prefix="$"
            icon={<DollarOutlined />}
            color="orange"
            trend={kpis?.outstanding_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Active Projects"
            value={kpis?.active_projects || 0}
            icon={<ProjectOutlined />}
            color="purple"
            trend={kpis?.projects_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Investments"
            value={kpis?.total_investments || 0}
            prefix="$"
            icon={<ShopOutlined />}
            color="cyan"
            trend={kpis?.investments_trend}
            loading={isLoadingKPIs}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card bordered={false} className="chart-container" style={{ height: '100%' }}>
            <div className="chart-title">Revenue & Expenses (YTD)</div>
            {isLoadingRevenue ? (
              <LoadingSkeleton />
            ) : (
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="var(--ant-color-text-secondary)" />
                    <YAxis
                      stroke="var(--ant-color-text-secondary)"
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--ant-color-border-secondary)" vertical={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'var(--ant-color-bg-elevated)',
                        borderColor: 'var(--ant-color-border)',
                        borderRadius: 8,
                        color: 'var(--ant-color-text)',
                      }}
                      itemStyle={{ color: 'var(--ant-color-text)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#EF4444"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorExpense)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ height: '100%', borderRadius: 12 }}>
            <div className="chart-title">Recent Activity</div>
            {isLoadingActivities ? (
              <LoadingSkeleton avatar paragraph={{ rows: 5 }} />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={(item) => (
                  <List.Item style={{ borderBottomColor: 'var(--ant-color-border-secondary)' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}
                        >
                          {item.user_name.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{item.action}</span>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(item.created_at).fromNow()}
                          </Text>
                        </Space>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.user_name} • {item.entity_type}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
