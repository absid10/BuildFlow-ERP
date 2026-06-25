import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { Loan } from '../../types';

const statusColors: Record<string, string> = { active: 'processing', settled: 'success', defaulted: 'error' };
const typeColors: Record<string, string> = { lent: 'blue', borrowed: 'orange' };

const MOCK_LOANS: Loan[] = [
  { id: '1', loan_type: 'lent', party_name: 'Ali Construction Co.', party_phone: '0300-1112233', principal_amount: 2000000, amount_paid: 500000, outstanding_balance: 1500000, interest_rate: 0, loan_date: '2025-01-10', due_date: '2025-12-31', status: 'active', notes: 'For material purchase', created_by: null, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '2', loan_type: 'borrowed', party_name: 'National Bank', party_phone: null, principal_amount: 5000000, amount_paid: 2000000, outstanding_balance: 3000000, interest_rate: 12.5, loan_date: '2024-06-01', due_date: '2026-06-01', status: 'active', notes: 'Business expansion loan', created_by: null, created_at: '2024-06-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '3', loan_type: 'lent', party_name: 'Rashid Traders', party_phone: '0321-4445566', principal_amount: 500000, amount_paid: 500000, outstanding_balance: 0, interest_rate: 0, loan_date: '2024-03-15', due_date: '2024-09-15', status: 'settled', notes: 'Fully repaid', created_by: null, created_at: '2024-03-15T00:00:00Z', updated_at: '2024-09-10T00:00:00Z' },
];

const LoanListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Loan | null>(null);
  const [form] = Form.useForm();

  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => MOCK_LOANS,
  });

  const columns = [
    { title: 'Party', dataIndex: 'party_name', key: 'party', render: (t: string, r: Loan) => <a onClick={() => setDetailItem(r)} style={{ fontWeight: 600 }}>{t}</a> },
    { title: 'Type', dataIndex: 'loan_type', key: 'type', render: (v: string) => <Tag color={typeColors[v]}>{v === 'lent' ? 'GIVEN' : 'TAKEN'}</Tag> },
    { title: 'Principal', dataIndex: 'principal_amount', key: 'principal', render: (v: number) => formatCurrency(v) },
    { title: 'Paid', dataIndex: 'amount_paid', key: 'paid', render: (v: number) => formatCurrency(v) },
    { title: 'Outstanding', dataIndex: 'outstanding_balance', key: 'outstanding', render: (v: number) => <span style={{ color: v > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>{formatCurrency(v)}</span> },
    { title: 'Interest %', dataIndex: 'interest_rate', key: 'interest', render: (v: number) => v > 0 ? `${v}%` : '—' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due', render: (v: string | null) => v ? dayjs(v).format('MMM D, YYYY') : '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={statusColors[v]}>{v.toUpperCase()}</Tag> },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: Loan) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailItem(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => message.info('Edit loan')} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Loans" description="Track money lent and borrowed." extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsModalOpen(true); }}>Add Loan</Button>} />
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={loans || []} rowKey="id" loading={isLoading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} loans` }} />
      </Card>

      <Modal title="Add Loan" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => { message.success('Loan recorded'); setIsModalOpen(false); }} okText="Save" width={560}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="loan_type" label="Type" rules={[{ required: true }]}><Select style={{ width: 200 }} placeholder="Select type"><Select.Option value="lent">Given (Lent)</Select.Option><Select.Option value="borrowed">Taken (Borrowed)</Select.Option></Select></Form.Item>
            <Form.Item name="party_name" label="Party Name" rules={[{ required: true }]}><Input placeholder="e.g. Ali Construction" /></Form.Item>
          </Space>
          <Form.Item name="party_phone" label="Phone"><Input placeholder="0300-1234567" /></Form.Item>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="principal_amount" label="Amount (Rs)" rules={[{ required: true }]}><InputNumber style={{ width: 180 }} min={0} /></Form.Item>
            <Form.Item name="interest_rate" label="Interest Rate %"><InputNumber style={{ width: 180 }} min={0} max={100} /></Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="loan_date" label="Loan Date"><DatePicker style={{ width: 200 }} /></Form.Item>
            <Form.Item name="due_date" label="Due Date"><DatePicker style={{ width: 200 }} /></Form.Item>
          </Space>
          <Form.Item name="notes" label="Notes"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Loan Details" open={!!detailItem} onCancel={() => setDetailItem(null)} footer={<Button onClick={() => setDetailItem(null)}>Close</Button>} width={560}>
        {detailItem && (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Party">{detailItem.party_name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{detailItem.party_phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Type"><Tag color={typeColors[detailItem.loan_type]}>{detailItem.loan_type === 'lent' ? 'GIVEN' : 'TAKEN'}</Tag></Descriptions.Item>
            <Descriptions.Item label="Principal">{formatCurrency(detailItem.principal_amount)}</Descriptions.Item>
            <Descriptions.Item label="Paid">{formatCurrency(detailItem.amount_paid)}</Descriptions.Item>
            <Descriptions.Item label="Outstanding">{formatCurrency(detailItem.outstanding_balance)}</Descriptions.Item>
            <Descriptions.Item label="Interest">{detailItem.interest_rate > 0 ? `${detailItem.interest_rate}%` : 'None'}</Descriptions.Item>
            <Descriptions.Item label="Loan Date">{detailItem.loan_date ? dayjs(detailItem.loan_date).format('MMM D, YYYY') : '—'}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{detailItem.due_date ? dayjs(detailItem.due_date).format('MMM D, YYYY') : '—'}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={statusColors[detailItem.status]}>{detailItem.status.toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Notes">{detailItem.notes || '—'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LoanListPage;
