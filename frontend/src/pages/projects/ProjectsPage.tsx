import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, DatePicker, message, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { Project, ProjectStatus } from '../../types';

// ── Mock data (will swap to real API when backend is connected) ──
const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Skyline Residential Tower', description: 'A 20-story luxury residential tower in DHA Phase 6', budget: 50000000, spent: 12500000, status: 'in_progress', start_date: '2025-01-15', end_date: '2026-06-30', progress_percent: 35, location: 'DHA Phase 6, Lahore', created_by: null, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-06-20T00:00:00Z' },
  { id: '2', name: 'Downtown Commercial Hub', description: 'Mixed-use commercial plaza with retail and office spaces', budget: 85000000, spent: 4500000, status: 'planning', start_date: '2025-07-01', end_date: '2027-12-31', progress_percent: 5, location: 'Gulberg III, Lahore', created_by: null, created_at: '2025-06-01T00:00:00Z', updated_at: '2025-06-18T00:00:00Z' },
  { id: '3', name: 'Green Valley Villas', description: 'Gated community with 50 luxury villas', budget: 120000000, spent: 95000000, status: 'completed', start_date: '2023-03-01', end_date: '2025-05-30', progress_percent: 100, location: 'Bahria Town, Lahore', created_by: null, created_at: '2023-02-15T00:00:00Z', updated_at: '2025-05-30T00:00:00Z' },
  { id: '4', name: 'Riverview Apartments', description: 'Affordable housing project near Ravi River', budget: 30000000, spent: 8000000, status: 'on_hold', start_date: '2024-09-01', end_date: '2026-03-31', progress_percent: 20, location: 'Raiwind Road, Lahore', created_by: null, created_at: '2024-08-20T00:00:00Z', updated_at: '2025-04-10T00:00:00Z' },
];

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  // Mock query — will swap to real API
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => MOCK_PROJECTS,
  });

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      start_date: project.start_date ? dayjs(project.start_date) : null,
      end_date: project.end_date ? dayjs(project.end_date) : null,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success(editingProject ? 'Project updated successfully' : 'Project created successfully');
      setIsModalOpen(false);
    } catch {
      // validation errors shown in form
    }
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
      filters: Object.entries(statusLabels).map(([value, text]) => ({ text, value })),
      onFilter: (value: any, record: Project) => record.status === value,
    },
    {
      title: 'Budget',
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
      sorter: (a: Project, b: Project) => a.progress_percent - b.progress_percent,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailProject(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => message.info('Delete confirmation would appear here')} />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            New Project
          </Button>
        }
      />

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={projects || []}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} projects` }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editingProject ? 'Edit Project' : 'New Project'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={editingProject ? 'Update' : 'Create'}
        width={640}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Project Name" rules={[{ required: true, message: 'Please enter project name' }]}>
            <Input placeholder="e.g. Skyline Tower" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Brief description of the project" />
          </Form.Item>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="budget" label="Budget (Rs)" rules={[{ required: true, message: 'Enter budget' }]}>
              <InputNumber style={{ width: 200 }} min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select style={{ width: 180 }} placeholder="Select status">
                {Object.entries(statusLabels).map(([val, label]) => (
                  <Select.Option key={val} value={val}>{label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="start_date" label="Start Date">
              <DatePicker style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="end_date" label="End Date">
              <DatePicker style={{ width: 200 }} />
            </Form.Item>
          </Space>
          <Form.Item name="location" label="Location">
            <Input placeholder="e.g. DHA Phase 6, Lahore" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Project Details"
        open={!!detailProject}
        onCancel={() => setDetailProject(null)}
        footer={[
          <Button key="close" onClick={() => setDetailProject(null)}>Close</Button>,
          <Button key="edit" type="primary" onClick={() => { if (detailProject) { handleEdit(detailProject); setDetailProject(null); } }}>Edit</Button>,
        ]}
        width={640}
      >
        {detailProject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            <div><strong>Name:</strong> {detailProject.name}</div>
            <div><strong>Description:</strong> {detailProject.description || '—'}</div>
            <div><strong>Status:</strong> <Tag color={statusColors[detailProject.status]}>{statusLabels[detailProject.status]}</Tag></div>
            <div><strong>Budget:</strong> {formatCurrency(detailProject.budget)}</div>
            <div><strong>Spent:</strong> {formatCurrency(detailProject.spent)}</div>
            <div><strong>Progress:</strong> <Progress percent={detailProject.progress_percent} size="small" style={{ width: 200 }} /></div>
            <div><strong>Location:</strong> {detailProject.location || '—'}</div>
            <div><strong>Start Date:</strong> {detailProject.start_date ? dayjs(detailProject.start_date).format('MMM D, YYYY') : '—'}</div>
            <div><strong>End Date:</strong> {detailProject.end_date ? dayjs(detailProject.end_date).format('MMM D, YYYY') : '—'}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
