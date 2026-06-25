import React from 'react';
import { Card, Table, Button, Tag, Space, Typography, Row, Col, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { DollarOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TuesdayPaymentItem {
  id: string;
  party_name: string;
  party_type: 'contractor' | 'supplier' | 'installment' | 'loan';
  project_name: string | null;
  amount: number;
  due_date: string;
  status: 'pending' | 'overdue';
  notes: string | null;
}

const MOCK_PAYMENTS: TuesdayPaymentItem[] = [
  { id: '1', party_name: 'Hassan Builders', party_type: 'contractor', project_name: 'Skyline Tower', amount: 350000, due_date: '2025-07-01', status: 'pending', notes: 'Steel work payment' },
  { id: '2', party_name: 'Lahore Cement Depot', party_type: 'supplier', project_name: 'Skyline Tower', amount: 180000, due_date: '2025-07-01', status: 'pending', notes: '200 bags cement' },
  { id: '3', party_name: 'Mr. Arif (Plot buyer)', party_type: 'installment', project_name: null, amount: 500000, due_date: '2025-06-24', status: 'overdue', notes: 'Installment #4 overdue' },
  { id: '4', party_name: 'National Bank', party_type: 'loan', project_name: null, amount: 250000, due_date: '2025-07-01', status: 'pending', notes: 'Monthly EMI' },
  { id: '5', party_name: 'Waqas Electric Works', party_type: 'contractor', project_name: 'Downtown Hub', amount: 95000, due_date: '2025-07-01', status: 'pending', notes: 'Electrical wiring Phase 1' },
];

// Next Tuesday calculator
const getNextTuesday = (): string => {
  const today = dayjs();
  const day = today.day();
  const daysUntilTuesday = day <= 2 ? 2 - day : 9 - day;
  return today.add(daysUntilTuesday, 'day').format('dddd, MMMM D, YYYY');
};

const typeLabels: Record<string, string> = { contractor: 'Contractor', supplier: 'Supplier', installment: 'Installment', loan: 'Loan/EMI' };
const typeColors: Record<string, string> = { contractor: 'blue', supplier: 'green', installment: 'orange', loan: 'purple' };

const TuesdayPaymentPage: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['tuesday-payments'],
    queryFn: async () => MOCK_PAYMENTS,
  });

  const totalDue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const overdueCount = payments?.filter(p => p.status === 'overdue').length || 0;

  const handleExportExcel = () => {
    // Will connect to backend export endpoint
    message.success('Downloading Excel file...');
  };

  const columns = [
    { title: 'Party', dataIndex: 'party_name', key: 'party', render: (t: string) => <strong>{t}</strong> },
    { title: 'Type', dataIndex: 'party_type', key: 'type', render: (v: string) => <Tag color={typeColors[v]}>{typeLabels[v]}</Tag> },
    { title: 'Project', dataIndex: 'project_name', key: 'project', render: (v: string | null) => v || '—' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => <strong>{formatCurrency(v)}</strong> },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due', render: (v: string) => dayjs(v).format('MMM D, YYYY') },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'overdue' ? 'error' : 'warning'}>{v.toUpperCase()}</Tag> },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', render: (v: string | null) => v || '—' },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Tuesday Payments"
        description={`Payment summary for ${getNextTuesday()}`}
        extra={
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Export to Excel</Button>
            <Button icon={<DownloadOutlined />} onClick={() => message.success('Downloading PDF...')}>Download PDF</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <StatCard title="Total Due This Tuesday" value={formatCurrency(totalDue)} icon={<DollarOutlined />} color="orange" loading={isLoading} />
        </Col>
        <Col xs={24} sm={12}>
          <StatCard title="Overdue Payments" value={overdueCount} icon={<CalendarOutlined />} color="red" loading={isLoading} />
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={payments || []}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}><strong>TOTAL</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3}><strong style={{ fontSize: 16 }}>{formatCurrency(totalDue)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={4} colSpan={3} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
};

export default TuesdayPaymentPage;
