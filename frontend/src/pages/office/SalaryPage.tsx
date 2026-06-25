import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { SalaryPayment } from '../../types';

const MOCK_SALARIES: (SalaryPayment & { employee_name: string })[] = [
  { id: '1', employee_id: '1', employee_name: 'Ahmed Khan', amount: 120000, deductions: 5000, bonus: 10000, net_amount: 125000, month_year: 'Jun 2025', payment_date: '2025-06-05', status: 'paid', created_at: '2025-06-05T00:00:00Z' },
  { id: '2', employee_id: '2', employee_name: 'Fatima Ali', amount: 80000, deductions: 2000, bonus: 0, net_amount: 78000, month_year: 'Jun 2025', payment_date: '2025-06-05', status: 'paid', created_at: '2025-06-05T00:00:00Z' },
  { id: '3', employee_id: '3', employee_name: 'Usman Raza', amount: 200000, deductions: 10000, bonus: 20000, net_amount: 210000, month_year: 'Jun 2025', payment_date: null, status: 'pending', created_at: '2025-06-01T00:00:00Z' },
  { id: '4', employee_id: '4', employee_name: 'Zainab Malik', amount: 45000, deductions: 0, bonus: 0, net_amount: 45000, month_year: 'Jun 2025', payment_date: null, status: 'pending', created_at: '2025-06-01T00:00:00Z' },
];

const SalaryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: salaries, isLoading } = useQuery({
    queryKey: ['salaries'],
    queryFn: async () => MOCK_SALARIES,
  });

  const columns = [
    { title: 'Employee', dataIndex: 'employee_name', key: 'employee_name', render: (t: string) => <strong>{t}</strong> },
    { title: 'Month', dataIndex: 'month_year', key: 'month_year' },
    { title: 'Base Salary', dataIndex: 'amount', key: 'amount', render: (v: number) => formatCurrency(v) },
    { title: 'Deductions', dataIndex: 'deductions', key: 'deductions', render: (v: number) => formatCurrency(v) },
    { title: 'Bonus', dataIndex: 'bonus', key: 'bonus', render: (v: number) => formatCurrency(v) },
    { title: 'Net Amount', dataIndex: 'net_amount', key: 'net_amount', render: (v: number) => <strong>{formatCurrency(v)}</strong> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'paid' ? 'success' : 'warning'}>{v.toUpperCase()}</Tag> },
    { title: 'Payment Date', dataIndex: 'payment_date', key: 'payment_date', render: (v: string | null) => v ? dayjs(v).format('MMM D, YYYY') : '—' },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Salaries" description="Track and manage monthly salary payments." extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsModalOpen(true); }}>Record Payment</Button>} />
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={salaries || []} rowKey="id" loading={isLoading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} records` }} />
      </Card>
      <Modal title="Record Salary Payment" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => { message.success('Salary payment recorded'); setIsModalOpen(false); }} okText="Save" width={560}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="employee_id" label="Employee" rules={[{ required: true }]}>
            <Select placeholder="Select employee">
              <Select.Option value="1">Ahmed Khan</Select.Option>
              <Select.Option value="2">Fatima Ali</Select.Option>
              <Select.Option value="3">Usman Raza</Select.Option>
              <Select.Option value="4">Zainab Malik</Select.Option>
            </Select>
          </Form.Item>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="amount" label="Base Amount (Rs)" rules={[{ required: true }]}><InputNumber style={{ width: 180 }} min={0} /></Form.Item>
            <Form.Item name="deductions" label="Deductions (Rs)"><InputNumber style={{ width: 180 }} min={0} /></Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="bonus" label="Bonus (Rs)"><InputNumber style={{ width: 180 }} min={0} /></Form.Item>
            <Form.Item name="month_year" label="Month" rules={[{ required: true }]}><Input placeholder="e.g. Jun 2025" /></Form.Item>
          </Space>
          <Form.Item name="payment_date" label="Payment Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalaryPage;
