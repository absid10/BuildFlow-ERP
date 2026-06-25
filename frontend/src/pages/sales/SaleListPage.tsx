import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import type { PropertySale } from '../../types';

const statusColors: Record<string, string> = { active: 'processing', completed: 'success', cancelled: 'error' };

const MOCK_SALES: (PropertySale & { customer_name: string; property_name: string })[] = [
  { id: '1', property_id: '1', customer_id: '1', customer_name: 'Tariq Mehmood', property_name: 'Villa #12, Green Valley', total_price: 25000000, discount: 500000, net_price: 24500000, amount_paid: 15000000, outstanding_balance: 9500000, sale_date: '2025-01-15', agreement_date: '2025-01-10', status: 'active', created_by: null, created_at: '2025-01-15T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: '2', property_id: '2', customer_id: '2', customer_name: 'Ayesha Siddiqui', property_name: 'Flat #501, Skyline Tower', total_price: 12000000, discount: 0, net_price: 12000000, amount_paid: 12000000, outstanding_balance: 0, sale_date: '2024-08-20', agreement_date: '2024-08-15', status: 'completed', created_by: null, created_at: '2024-08-20T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: '3', property_id: '3', customer_id: '3', customer_name: 'Imran Qureshi', property_name: 'Shop #8, Downtown Hub', total_price: 8500000, discount: 200000, net_price: 8300000, amount_paid: 3000000, outstanding_balance: 5300000, sale_date: '2025-03-10', agreement_date: '2025-03-05', status: 'active', created_by: null, created_at: '2025-03-10T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
];

const SaleListPage: React.FC = () => {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => MOCK_SALES,
  });

  const columns = [
    { title: 'Customer', dataIndex: 'customer_name', key: 'customer', render: (t: string) => <strong>{t}</strong> },
    { title: 'Property', dataIndex: 'property_name', key: 'property' },
    { title: 'Net Price', dataIndex: 'net_price', key: 'net_price', render: (v: number) => formatCurrency(v) },
    { title: 'Paid', dataIndex: 'amount_paid', key: 'paid', render: (v: number) => formatCurrency(v) },
    { title: 'Outstanding', dataIndex: 'outstanding_balance', key: 'outstanding', render: (v: number) => <span style={{ color: v > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>{formatCurrency(v)}</span> },
    { title: 'Sale Date', dataIndex: 'sale_date', key: 'date', render: (v: string | null) => v ? dayjs(v).format('MMM D, YYYY') : '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={statusColors[v]}>{v.toUpperCase()}</Tag> },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => message.info('View sale details & installments')} />
          <Button type="text" icon={<EditOutlined />} onClick={() => message.info('Edit sale')} />
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Property Sales" description="Track sales, payments, and installments." extra={<Button type="primary" icon={<PlusOutlined />}>New Sale</Button>} />
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table columns={columns} dataSource={sales || []} rowKey="id" loading={isLoading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} sales` }} />
      </Card>
    </div>
  );
};

export default SaleListPage;
