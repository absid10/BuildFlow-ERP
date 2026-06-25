import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { Investment } from '../../types';

const statusColors: Record<string, string> = { active: 'processing', sold: 'success', cancelled: 'error' };

const MOCK_INVESTMENTS: Investment[] = [
  { id: '1', property_name: 'Plot #45, DHA Phase 8', property_type: 'Residential Plot', location: 'DHA Phase 8, Lahore', total_value: 15000000, amount_paid: 10000000, remaining_balance: 5000000, purchase_date: '2024-03-15', status: 'active', notes: 'Payment plan: 3 installments remaining', created_by: null, created_at: '2024-03-15T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '2', property_name: 'Shop #12, Johar Town', property_type: 'Commercial', location: 'Johar Town, Lahore', total_value: 8500000, amount_paid: 8500000, remaining_balance: 0, purchase_date: '2023-01-10', status: 'active', notes: 'Fully paid. Generating rental income.', created_by: null, created_at: '2023-01-10T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '3', property_name: 'Flat #301, Bahria Heights', property_type: 'Apartment', location: 'Bahria Town, Lahore', total_value: 12000000, amount_paid: 12000000, remaining_balance: 0, purchase_date: '2022-06-20', status: 'sold', notes: 'Sold at Rs 14,500,000. Profit: Rs 2,500,000', created_by: null, created_at: '2022-06-20T00:00:00Z', updated_at: '2025-04-15T00:00:00Z' },
];

const InvestmentListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Investment | null>(null);
  const [form] = Form.useForm();

  const { data: investments, isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => MOCK_INVESTMENTS,
  });

  const columns = [
    { title: 'Property', dataIndex: 'property_name', key: 'name', render: (t: string, r: Investment) => <a onClick={() => setDetailItem(r)} style={{ fontWeight: 600 }}>{t}</a> },
    { title: 'Type', dataIndex: 'property_type', key: 'type' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Total Value', dataIndex: 'total_value', key: 'value', render: (v: number) => formatCurrency(v), sorter: (a: Investment, b: Investment) => a.total_value - b.total_value },
    { title: 'Paid', dataIndex: 'amount_paid', key: 'paid', render: (v: number) => formatCurrency(v) },
    { title: 'Remaining', dataIndex: 'remaining_balance', key: 'remaining', render: (v: number) => <span style={{ color: v > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>{formatCurrency(v)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={statusColors[v]}>{v.toUpperCase()}</Tag> },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: Investment) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailItem(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => message.info('Edit investment')} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Investments" description="Track property investments, payments, and returns." extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsModalOpen(true); }}>Add Investment</Button>} />
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={investments || []} rowKey="id" loading={isLoading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} investments` }} />
      </Card>

      {/* Add Modal */}
      <Modal title="Add Investment" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => { message.success('Investment added'); setIsModalOpen(false); }} okText="Add" width={560}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="property_name" label="Property Name" rules={[{ required: true }]}><Input placeholder="e.g. Plot #45, DHA Phase 8" /></Form.Item>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="property_type" label="Property Type"><Input placeholder="e.g. Residential Plot" /></Form.Item>
            <Form.Item name="location" label="Location"><Input placeholder="e.g. DHA Phase 8, Lahore" /></Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="total_value" label="Total Value (Rs)" rules={[{ required: true }]}><InputNumber style={{ width: 200 }} min={0} /></Form.Item>
            <Form.Item name="amount_paid" label="Amount Paid (Rs)" rules={[{ required: true }]}><InputNumber style={{ width: 200 }} min={0} /></Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="purchase_date" label="Purchase Date"><DatePicker style={{ width: 200 }} /></Form.Item>
            <Form.Item name="status" label="Status" initialValue="active">
              <Select style={{ width: 200 }}><Select.Option value="active">Active</Select.Option><Select.Option value="sold">Sold</Select.Option><Select.Option value="cancelled">Cancelled</Select.Option></Select>
            </Form.Item>
          </Space>
          <Form.Item name="notes" label="Notes"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title="Investment Details" open={!!detailItem} onCancel={() => setDetailItem(null)} footer={<Button onClick={() => setDetailItem(null)}>Close</Button>} width={560}>
        {detailItem && (
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Property">{detailItem.property_name}</Descriptions.Item>
            <Descriptions.Item label="Type">{detailItem.property_type}</Descriptions.Item>
            <Descriptions.Item label="Location">{detailItem.location}</Descriptions.Item>
            <Descriptions.Item label="Total Value">{formatCurrency(detailItem.total_value)}</Descriptions.Item>
            <Descriptions.Item label="Amount Paid">{formatCurrency(detailItem.amount_paid)}</Descriptions.Item>
            <Descriptions.Item label="Remaining">{formatCurrency(detailItem.remaining_balance)}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={statusColors[detailItem.status]}>{detailItem.status.toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Purchase Date">{detailItem.purchase_date ? dayjs(detailItem.purchase_date).format('MMM D, YYYY') : '—'}</Descriptions.Item>
            <Descriptions.Item label="Notes">{detailItem.notes || '—'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default InvestmentListPage;
