import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  precision?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'cyan';
  trend?: number;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision = 2,
  icon,
  color,
  trend,
  loading = false,
}) => {
  const isUp = trend && trend > 0;
  const trendColor = isUp ? '#10B981' : '#EF4444';

  return (
    <Card bordered={false} className={`stat-card stat-card-${color}`} loading={loading}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Statistic
            title={<span style={{ fontWeight: 600, opacity: 0.8 }}>{title}</span>}
            value={value}
            precision={typeof value === 'number' && !Number.isInteger(value) ? precision : 0}
            prefix={prefix}
            suffix={suffix}
          />
          {trend !== undefined && (
            <div className={`stat-card-trend ${isUp ? 'up' : 'down'}`} style={{ marginTop: 8 }}>
              {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className="stat-card-icon" style={{ background: `var(--ant-color-${color}-bg)` }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
