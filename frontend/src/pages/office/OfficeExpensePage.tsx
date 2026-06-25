import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { OfficeExpense } from '../../types';

const categoryLabels: Record<string, string> = { rent: 'Rent', utilities: 'Utilities', supplies: 'Supplies', maintenance: 'Maintenance', misc: 'Miscellaneous' };
const categoryColors: Record<string, string> = { rent: 'blue', utilities: 'orange', supplies: 'green', maintenance: 'purple', misc: 'default' };

const MOCK_EXPENSES: OfficeExpense[] = [
  { id: '1', category: 'rent', description: 'Office rent for June 2025', amount: 150000, expense_date: '2025-06-01', receipt_url: null, created_by: null, created_at: '2025-06-01T00:00:00Z' },
  { id: '2', category: 'utilities', description: 'Electricity bill', amount: 25000, expense_date: '2025-06-05', receipt_url: null, created_by: null, created_at: '2025-06-05T00:00:00Z' },
  { id: '3', category: 'utilities', description: 'Internet & Phone bill', amount: 8000, expense_date: '2025-06-03', receipt_url: null, created_by: null, created_at: '2025-06-03T00:00:00Z' },
  { id: '4', category: 'supplies', description: 'Office stationery and printer ink', amount: 5500, expense_date: '2025-06-10', receipt_url: null, created_by: null, created_at: '2025-06-10T00:00:00Z' },
  { id: '5', category: 'maintenance', description: 'AC servicing', amount: 12000, expense_date: '2025-06-12', receipt_url: null, created_by: null, created_at: '2025-06-12T00:00:00Z' },
  { id: '6', category: 'misc', description: 'Staff lunch for meeting', amount: 3500, expense_date: '2025-06-15', receipt_url: null, created_by: null, created_at: '2025-06-15T00:00:00Z' },
];

const OfficeExpensePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['office-expenses'],
    queryFn: async () => MOCK_EXPENSES,
  });

  const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

  const columns = [
    { title: 'Description', dataIndex: 'description', key: 'description', render: (t: string) => <strong>{t}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (v: string) => <Tag color={categoryColors[v]}>{categoryLabels[v]}</Tag>, filters: Object.entries(categoryLabels).map(([val, text]) => ({ text, value: val })), onFilter: (value: any, record: OfficeExpense) => record.category === value },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => formatCurrency(v), sorter: (a: OfficeExpense, b: OfficeExpense) => a.amount - b.amount },
    { title: 'Date', dataIndex: 'expense_date', key: 'date', render: (v: string | null) => v ? dayjs(v).format('MMM D, YYYY') : '—', sorter: (a: OfficeExpense, b: OfficeExpense) => dayjs(a.expense_date).unix() - dayjs(b.expense_date).unix() },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: OfficeExpense) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => message.info('Edit modal')} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => message.info('Delete confirmation')} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Office Expenses" description={`Total this month: ${formatCurrency(totalExpenses)}`} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsModalOpen(true); }}>Add Expense</Button>} />
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={expenses || []} rowKey="id" loading={isLoading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} expenses` }} />
      </Card>
      <Modal title="Add Office Expense" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => { message.success('Expense added'); setIsModalOpen(false); }} okText="Add" width={500}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              {Object.entries(categoryLabels).map(([val, label]) => <Select.Option key={val} value={val}>{label}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input placeholder="e.g. Electricity bill" /></Form.Item>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="amount" label="Amount (Rs)" rules={[{ required: true }]}><InputNumber style={{ width: 200 }} min={0} /></Form.Item>
            <Form.Item name="expense_date" label="Date" rules={[{ required: true }]}><DatePicker style={{ width: 200 }} /></Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficeExpensePage;
