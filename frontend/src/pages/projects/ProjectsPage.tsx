import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, message, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import { projectsApi } from '../../api/projects';
import {
  getCategoryLabel, getProjectTypeLabel, getOwnershipLabel,
} from '../../utils/projectConstants';
import type { Project, ProjectStatus } from '../../types';

const statusColors: Record<ProjectStatus, string> = {
  planning: 'default',
  in_progress: 'processing',
  completed: 'success',
  on_hold: 'warning',
  cancelled: 'error',
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
};

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => projectsApi.list(page, 10),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      message.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => message.error('Failed to delete project'),
  });

  const handleDelete = (project: Project) => {
    Modal.confirm({
      title: 'Delete Project',
      content: `Are you sure you want to delete "${project.name}"? This cannot be undone.`,
      okType: 'danger',
      onOk: () => deleteMutation.mutate(project.id),
    });
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <a onClick={() => setDetailProject(record)} style={{ fontWeight: 600 }}>{text}</a>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v: string | null) => v ? getCategoryLabel(v) : '—',
    },
    {
      title: 'Type',
      dataIndex: 'project_type',
      key: 'project_type',
      render: (v: string | null) => v ? getProjectTypeLabel(v) : '—',
    },
    {
      title: 'Ownership',
      dataIndex: 'ownership',
      key: 'ownership',
      render: (v: string | null) => v ? getOwnershipLabel(v) : '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Est. Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (val: number) => formatCurrency(val),
      sorter: (a: Project, b: Project) => a.budget - b.budget,
    },
    {
      title: 'Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'Progress',
      dataIndex: 'progress_percent',
      key: 'progress',
      render: (val: number) => <Progress percent={val} size="small" />,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Project) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailProject(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/projects/${record.id}/edit`)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Projects"
        description="Manage your construction and real estate projects."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/projects/new')}>
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
          pagination={{
            current: page,
            pageSize: 10,
            total: data?.total || 0,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} projects`,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      <Modal
        title="Project Details"
        open={!!detailProject}
        onCancel={() => setDetailProject(null)}
        footer={[
          <Button key="close" onClick={() => setDetailProject(null)}>Close</Button>,
          <Button key="edit" type="primary" onClick={() => {
            if (detailProject) { navigate(`/projects/${detailProject.id}/edit`); setDetailProject(null); }
          }}>Edit</Button>,
        ]}
        width={720}
      >
        {detailProject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <div><strong>Name:</strong> {detailProject.name}</div>
            <div><strong>Category:</strong> {detailProject.category ? getCategoryLabel(detailProject.category) : '—'}</div>
            <div><strong>Type:</strong> {detailProject.project_type ? getProjectTypeLabel(detailProject.project_type) : '—'}</div>
            <div><strong>Ownership:</strong> {detailProject.ownership ? getOwnershipLabel(detailProject.ownership) : '—'}</div>
            {detailProject.client_name && <div><strong>Client:</strong> {detailProject.client_name}</div>}
            <div><strong>Status:</strong> <Tag color={statusColors[detailProject.status]}>{statusLabels[detailProject.status]}</Tag></div>
            <div><strong>Est. Budget:</strong> {formatCurrency(detailProject.budget)}</div>
            <div><strong>Spent:</strong> {formatCurrency(detailProject.spent)}</div>
            <div><strong>Progress:</strong> <Progress percent={detailProject.progress_percent} size="small" style={{ width: 200 }} /></div>
            <div><strong>Location:</strong> {detailProject.location || '—'}</div>
            <div><strong>Start Date:</strong> {detailProject.start_date ? dayjs(detailProject.start_date).format('MMM D, YYYY') : '—'}</div>
            <div><strong>Expected End:</strong> {detailProject.end_date ? dayjs(detailProject.end_date).format('MMM D, YYYY') : '—'}</div>
            {detailProject.total_land_area && (
              <div><strong>Land Area:</strong> {detailProject.total_land_area} {detailProject.total_land_area_unit}</div>
            )}
            {detailProject.built_up_area && (
              <div><strong>Built-up Area:</strong> {detailProject.built_up_area} {detailProject.built_up_area_unit}</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
