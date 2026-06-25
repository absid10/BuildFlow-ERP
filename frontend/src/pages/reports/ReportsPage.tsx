import React from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Space, Table, Tag, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { DollarOutlined, RiseOutlined, WalletOutlined, ProjectOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface ReportSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  total_outstanding: number;
}

const MOCK_SUMMARY: ReportSummary = {
  total_revenue: 45000000,
  total_expenses: 28000000,
  net_profit: 17000000,
  total_outstanding: 14800000,
};

const MOCK_BREAKDOWN = [
  { key: '1', category: 'Project Revenue', amount: 35000000, type: 'income' },
  { key: '2', category: 'Property Sales', amount: 10000000, type: 'income' },
  { key: '3', category: 'Material Expenses', amount: 12000000, type: 'expense' },
  { key: '4', category: 'Labor / Contractor', amount: 8000000, type: 'expense' },
  { key: '5', category: 'Office Expenses', amount: 2400000, type: 'expense' },
  { key: '6', category: 'Salaries', amount: 4800000, type: 'expense' },
  { key: '7', category: 'Loan EMIs', amount: 800000, type: 'expense' },
];

const ReportsPage: React.FC = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: async () => MOCK_SUMMARY,
  });

  const handleExportExcel = () => {
    message.success('Downloading report as Excel...');
  };

  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category', render: (t: string) => <strong>{t}</strong> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => formatCurrency(v) },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v: string) => <Tag color={v === 'income' ? 'success' : 'error'}>{v.toUpperCase()}</Tag> },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Reports"
        description="Financial summaries and export to Excel."
        extra={
          <Space>
            <Select defaultValue="monthly" style={{ width: 140 }}>
              <Select.Option value="monthly">Monthly</Select.Option>
              <Select.Option value="yearly">Yearly</Select.Option>
              <Select.Option value="custom">Custom Range</Select.Option>
            </Select>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Export Excel</Button>
            <Button icon={<DownloadOutlined />} onClick={() => message.success('Downloading PDF...')}>Download PDF</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Revenue" value={formatCurrency(summary?.total_revenue)} icon={<RiseOutlined />} color="blue" loading={isLoading} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Expenses" value={formatCurrency(summary?.total_expenses)} icon={<DollarOutlined />} color="red" loading={isLoading} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Net Profit" value={formatCurrency(summary?.net_profit)} icon={<WalletOutlined />} color="green" loading={isLoading} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Outstanding" value={formatCurrency(summary?.total_outstanding)} icon={<ProjectOutlined />} color="orange" loading={isLoading} />
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 12 }} title="Revenue & Expense Breakdown">
        <Table
          columns={columns}
          dataSource={MOCK_BREAKDOWN}
          rowKey="key"
          pagination={false}
          summary={() => {
            const income = MOCK_BREAKDOWN.filter(b => b.type === 'income').reduce((s, b) => s + b.amount, 0);
            const expense = MOCK_BREAKDOWN.filter(b => b.type === 'expense').reduce((s, b) => s + b.amount, 0);
            return (
              <>
                <Table.Summary.Row style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                  <Table.Summary.Cell index={0}><strong>Total Income</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong style={{ color: '#10B981' }}>{formatCurrency(income)}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                </Table.Summary.Row>
                <Table.Summary.Row style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                  <Table.Summary.Cell index={0}><strong>Total Expenses</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong style={{ color: '#EF4444' }}>{formatCurrency(expense)}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong style={{ fontSize: 15 }}>NET PROFIT</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong style={{ fontSize: 15, color: '#3B82F6' }}>{formatCurrency(income - expense)}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default ReportsPage;
