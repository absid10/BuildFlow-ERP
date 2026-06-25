import React from 'react';
import { Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import PageHeader from '../../components/common/PageHeader';
import type { Project } from '../../types';

// Mock API call for offline demo
const fetchProjects = async () => {
  return {
    items: [
      {
        id: '1',
        name: 'Skyline Residential Tower',
        status: 'in_progress',
        budget: 5000000,
        spent: 1250000,
        progress_percent: 35,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Downtown Commercial Hub',
        status: 'planning',
        budget: 8500000,
        spent: 45000,
        progress_percent: 5,
        created_at: new Date().toISOString()
      }
    ],
    total: 2,
    page_size: 20
  };
};

const ProjectsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          planning: 'default',
          in_progress: 'processing',
          completed: 'success',
          on_hold: 'warning',
          cancelled: 'error',
        };
        return <Tag color={colors[status] || 'default'}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (val: number) => `$${(val || 0).toLocaleString()}`,
    },
    {
      title: 'Progress',
      dataIndex: 'progress_percent',
      key: 'progress',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val: string) => dayjs(val).format('MMM D, YYYY'),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <a>View Details</a>,
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Projects"
        description="Manage your construction and real estate projects."
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Project
          </Button>
        }
      />
      
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={data?.items || []}
          rowKey="id"
          loading={isLoading}
          pagination={{ total: data?.total, pageSize: data?.page_size }}
        />
      </Card>
    </div>
  );
};

export default ProjectsPage;
