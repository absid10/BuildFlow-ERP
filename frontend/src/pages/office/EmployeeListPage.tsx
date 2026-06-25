import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { Employee } from '../../types';

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Ahmed Khan', phone: '0300-1234567', email: 'ahmed@buildflow.com', designation: 'Site Engineer', department: 'Construction', base_salary: 120000, joining_date: '2023-01-15', is_active: true, created_at: '2023-01-15T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '2', name: 'Fatima Ali', phone: '0321-9876543', email: 'fatima@buildflow.com', designation: 'Accountant', department: 'Finance', base_salary: 80000, joining_date: '2023-06-01', is_active: true, created_at: '2023-06-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '3', name: 'Usman Raza', phone: '0333-5551234', email: 'usman@buildflow.com', designation: 'Project Manager', department: 'Management', base_salary: 200000, joining_date: '2022-03-20', is_active: true, created_at: '2022-03-20T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '4', name: 'Zainab Malik', phone: '0345-6789012', email: null, designation: 'Office Assistant', department: 'Admin', base_salary: 45000, joining_date: '2024-02-01', is_active: true, created_at: '2024-02-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '5', name: 'Bilal Hussain', phone: '0312-4445556', email: null, designation: 'Driver', department: 'Operations', base_salary: 35000, joining_date: '2024-08-15', is_active: false, created_at: '2024-08-15T00:00:00Z', updated_at: '2025-03-01T00:00:00Z' },
];

const EmployeeListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => MOCK_EMPLOYEES,
  });

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    form.setFieldsValue({
      ...emp,
      joining_date: emp.joining_date ? dayjs(emp.joining_date) : null,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success(editingEmployee ? 'Employee updated' : 'Employee added');
      setIsModalOpen(false);
    } catch { /* validation */ }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (t: string) => <strong>{t}</strong> },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Salary', dataIndex: 'base_salary', key: 'salary', render: (v: number) => formatCurrency(v), sorter: (a: Employee, b: Employee) => a.base_salary - b.base_salary },
    { title: 'Status', dataIndex: 'is_active', key: 'status', render: (v: boolean) => <Tag color={v ? 'success' : 'default'}>{v ? 'Active' : 'Inactive'}</Tag> },
    { title: 'Joining Date', dataIndex: 'joining_date', key: 'joining', render: (v: string) => v ? dayjs(v).format('MMM D, YYYY') : '—' },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: Employee) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => message.info('Delete confirmation')} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Employees" description="Manage office staff and their details." extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Employee</Button>} />
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={employees || []} rowKey="id" loading={isLoading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} employees` }} />
      </Card>
      <Modal title={editingEmployee ? 'Edit Employee' : 'Add Employee'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleSave} okText={editingEmployee ? 'Update' : 'Add'} width={560}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input placeholder="e.g. Ahmed Khan" /></Form.Item>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="phone" label="Phone"><Input placeholder="0300-1234567" /></Form.Item>
            <Form.Item name="email" label="Email"><Input placeholder="email@example.com" /></Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="designation" label="Designation"><Input placeholder="e.g. Site Engineer" /></Form.Item>
            <Form.Item name="department" label="Department"><Input placeholder="e.g. Construction" /></Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="base_salary" label="Monthly Salary (Rs)" rules={[{ required: true }]}>
              <InputNumber style={{ width: 200 }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="joining_date" label="Joining Date"><DatePicker style={{ width: 200 }} /></Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeListPage;
