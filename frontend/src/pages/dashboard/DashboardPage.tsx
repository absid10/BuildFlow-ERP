import React from 'react';
import { Row, Col, Card, Typography, List, Avatar, Space, Table, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
  DollarOutlined,
  ProjectOutlined,
  ShopOutlined,
  WalletOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { dashboardApi } from '../../api/dashboard';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatters';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { data: kpis, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: dashboardApi.getKPIs,
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

      {/* KPI Cards — Simple, large numbers, no complex charts (client: "simple rkh bhai") */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(kpis?.total_revenue)}
            icon={<RiseOutlined />}
            color="blue"
            trend={kpis?.revenue_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Expenses"
            value={formatCurrency(kpis?.total_expenses)}
            icon={<DollarOutlined />}
            color="red"
            trend={kpis?.expense_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Net Profit"
            value={formatCurrency(kpis?.net_profit)}
            icon={<WalletOutlined />}
            color="green"
            trend={kpis?.profit_trend}
            loading={isLoadingKPIs}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Outstanding Payments"
            value={formatCurrency(kpis?.outstanding_payments)}
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
            value={formatCurrency(kpis?.total_investments)}
            icon={<ShopOutlined />}
            color="cyan"
            trend={kpis?.investments_trend}
            loading={isLoadingKPIs}
          />
        </Col>
      </Row>

      {/* Recent Activity — simple list, no complex graphs */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div className="chart-title">Recent Activity</div>
            {isLoadingActivities ? (
              <LoadingSkeleton />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={activities}
                locale={{ emptyText: 'No recent activity' }}
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
