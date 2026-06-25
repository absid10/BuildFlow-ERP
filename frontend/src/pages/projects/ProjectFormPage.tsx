import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal,
  Row, Select, Space, Upload, message, Typography, Divider, Alert, List, Tag,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, UploadOutlined,
  DeleteOutlined, FileOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { projectsApi } from '../../api/projects';
import {
  PROJECT_CATEGORIES, PROJECT_TYPE_GROUPS, OWNERSHIP_TYPES,
  PAYMENT_TERMS, LAND_AREA_UNITS, BUILT_AREA_UNITS, DOCUMENT_TYPES,
  ALLOWED_FILE_EXTENSIONS,
} from '../../utils/projectConstants';
import type { ProjectDocument } from '../../types';

const { Title, Text } = Typography;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface PendingUpload {
  uid: string;
  file: File;
  title: string;
}

function calcDuration(start: Dayjs | null, end: Dayjs | null): string {
  if (!start || !end || !end.isAfter(start)) return '—';
  const days = end.diff(start, 'day');
  const months = Math.floor(days / 30);
  const remDays = days % 30;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}, ${remDays} day${remDays !== 1 ? 's' : ''} (${days} days)`;
  return `${days} day${days !== 1 ? 's' : ''}`;
}

const ProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [existingDocs, setExistingDocs] = useState<ProjectDocument[]>([]);

  const ownership = Form.useWatch('ownership', form);
  const startDate = Form.useWatch('start_date', form);
  const endDate = Form.useWatch('expected_end_date', form);

  const duration = useMemo(
    () => calcDuration(startDate, endDate),
    [startDate, endDate]
  );

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        category: project.category,
        project_type: project.project_type,
        ownership: project.ownership,
        client_name: project.client_name,
        start_date: project.start_date ? dayjs(project.start_date) : null,
        expected_end_date: project.end_date ? dayjs(project.end_date) : null,
        budget: project.budget,
        location: project.location,
        payment_terms: project.payment_terms,
        total_land_area: project.total_land_area,
        total_land_area_unit: project.total_land_area_unit || 'sq_ft',
        built_up_area: project.built_up_area,
        built_up_area_unit: project.built_up_area_unit || 'sq_ft',
      });
      setExistingDocs(project.documents || []);
    }
  }, [project, form]);

  const buildPayload = (values: Record<string, unknown>) => ({
    name: values.name as string,
    category: values.category as string,
    project_type: values.project_type as string,
    ownership: values.ownership as string,
    client_name: values.ownership === 'self_owned' ? null : (values.client_name as string) || null,
    budget: Number(values.budget) || 0,
    start_date: values.start_date ? (values.start_date as Dayjs).format('YYYY-MM-DD') : null,
    end_date: values.expected_end_date ? (values.expected_end_date as Dayjs).format('YYYY-MM-DD') : null,
    location: (values.location as string) || null,
    payment_terms: values.ownership === 'client_owned' ? (values.payment_terms as string) || null : null,
    total_land_area: values.total_land_area ? Number(values.total_land_area) : null,
    total_land_area_unit: values.total_land_area ? (values.total_land_area_unit as string) : null,
    built_up_area: values.built_up_area ? Number(values.built_up_area) : null,
    built_up_area_unit: values.built_up_area ? (values.built_up_area_unit as string) : null,
  });

  const uploadPendingFiles = async (projectId: string) => {
    for (const item of pendingUploads) {
      await projectsApi.uploadDocument(projectId, item.file, item.title);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const name = (values.name as string).trim();

      const nameCheck = await projectsApi.checkName(name, isEdit ? id : undefined);
      if (nameCheck.exists) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: 'Duplicate Project Name',
            content: (
              <div>
                <p>A project with a similar name already exists:</p>
                <ul>{nameCheck.matching_names.map((n) => <li key={n}><strong>{n}</strong></li>)}</ul>
                <p>Do you want to continue anyway?</p>
              </div>
            ),
            okText: 'Continue',
            cancelText: 'Cancel',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });
        if (!confirmed) return;
      }

      setSaving(true);
      const payload = buildPayload(values);

      let savedId = id;
      if (isEdit && id) {
        await projectsApi.update(id, payload);
        message.success('Project updated successfully');
      } else {
        const created = await projectsApi.create(payload);
        savedId = created.id;
        message.success('Project created successfully');
      }

      if (savedId && pendingUploads.length > 0) {
        await uploadPendingFiles(savedId);
        message.success(`${pendingUploads.length} document(s) uploaded`);
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (file: File, docTitle: string) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      message.error(`File type not allowed. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error('File exceeds 10MB limit');
      return false;
    }
    setPendingUploads((prev) => [
      ...prev,
      { uid: `${Date.now()}-${file.name}`, file, title: docTitle || file.name },
    ]);
    return false;
  };

  const removePending = (uid: string) => {
    setPendingUploads((prev) => prev.filter((p) => p.uid !== uid));
  };

  const handleDeleteExistingDoc = async (doc: ProjectDocument) => {
    if (!id) return;
    Modal.confirm({
      title: 'Delete Document',
      content: `Remove "${doc.title}"?`,
      okType: 'danger',
      onOk: async () => {
        await projectsApi.deleteDocument(id, doc.id);
        setExistingDocs((prev) => prev.filter((d) => d.id !== doc.id));
        message.success('Document deleted');
      },
    });
  };

  if (isEdit && isLoading) {
    return <div style={{ padding: 48, textAlign: 'center' }}>Loading project...</div>;
  }

  return (
    <div className="project-form-page fade-in">
      {/* Full-screen header bar */}
      <div className="project-form-header">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? 'Edit Project' : 'New Project'}
          </Title>
        </Space>
        <Space>
          <Button onClick={() => navigate('/projects')}>Cancel</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
            {isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          total_land_area_unit: 'sq_ft',
          built_up_area_unit: 'sq_ft',
          ownership: 'self_owned',
        }}
        className="project-form-body"
      >
        {/* Section 1–3: Basic Info */}
        <Card title="Project Details" bordered={false} className="project-form-section">
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Project Name"
                rules={[
                  { required: true, message: 'Project name is required' },
                  { max: 100, message: 'Maximum 100 characters' },
                ]}
                extra="Unique business name to identify the project (e.g. Green Valley Villa, Skyline Residency)"
              >
                <Input placeholder="e.g. Green Valley Villa" maxLength={100} showCount />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Project Category"
                rules={[{ required: true, message: 'Select a category' }]}
                extra="Nature of business or service being provided"
              >
                <Select placeholder="Select category" optionLabelProp="label">
                  {PROJECT_CATEGORIES.map((c) => (
                    <Select.Option key={c.value} value={c.value} label={c.label}>
                      <div><strong>{c.label}</strong></div>
                      <div style={{ fontSize: 12, opacity: 0.65 }}>{c.description}</div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="project_type"
                label="Project Type"
                rules={[{ required: true, message: 'Select project type' }]}
                extra="Type of property or structure being constructed"
              >
                <Select placeholder="Select type" showSearch optionFilterProp="label">
                  {PROJECT_TYPE_GROUPS.map((group) => (
                    <Select.OptGroup key={group.label} label={group.label}>
                      {group.options.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value} label={opt.label}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="ownership"
                label="Ownership"
                rules={[{ required: true, message: 'Select ownership model' }]}
                extra="Determines the overall financial workflow"
              >
                <Select placeholder="Select ownership">
                  {OWNERSHIP_TYPES.map((o) => (
                    <Select.Option key={o.value} value={o.value}>
                      <div><strong>{o.label}</strong></div>
                      <div style={{ fontSize: 12, opacity: 0.65 }}>{o.description}</div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 4–5: Client */}
        {ownership && ownership !== 'self_owned' && (
          <Card title="Client Information" bordered={false} className="project-form-section">
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <Form.Item name="client_name" label="Client Name">
                  <Input placeholder="Enter client name" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Section 6–9: Schedule & Budget */}
        <Card title="Schedule & Budget" bordered={false} className="project-form-section">
          <Row gutter={[24, 0]}>
            <Col xs={24} md={8}>
              <Form.Item name="start_date" label="Start Date" extra="Actual commencement date">
                <DatePicker style={{ width: '100%' }} format="MMM D, YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="expected_end_date" label="Expected End Date" extra="Expected completion date">
                <DatePicker style={{ width: '100%' }} format="MMM D, YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Project Duration">
                <Input value={duration} readOnly disabled style={{ fontWeight: 600 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="budget"
                label="Estimated Budget (Rs)"
                extra="Estimated internal cost to execute — not amount receivable from client"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => Number(v?.replace(/,/g, '') || 0) as unknown as 0}
                  placeholder="e.g. 1,80,00,000"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 10: Payment Terms */}
        {ownership === 'client_owned' && (
          <Card title="Payment Terms" bordered={false} className="project-form-section">
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="payment_terms"
                  label="Payment Terms"
                  extra="How the client will make payments"
                >
                  <Select placeholder="Select payment terms" allowClear>
                    {PAYMENT_TERMS.map((p) => (
                      <Select.Option key={p.value} value={p.value}>{p.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Section 9, 11–12: Location & Area */}
        <Card title="Location & Area" bordered={false} className="project-form-section">
          <Row gutter={[24, 0]}>
            <Col xs={24}>
              <Form.Item name="location" label="Project Location" extra="Complete address of the project site">
                <Input.TextArea rows={3} placeholder="Full site address including city, area, landmarks..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="total_land_area" label="Total Land Area">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 2400" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="total_land_area_unit" label="Unit">
                <Select options={LAND_AREA_UNITS.map((u) => ({ value: u.value, label: u.label }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="built_up_area" label="Built-up Area">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 3200" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="built_up_area_unit" label="Unit">
                <Select options={BUILT_AREA_UNITS.map((u) => ({ value: u.value, label: u.label }))} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 13: Documents */}
        <Card title="Project Documents" bordered={false} className="project-form-section">
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Supported formats: PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX — Max 10MB per file"
          />

          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Upload relevant documents: agreements, plans, drawings, approvals, BOQ, photos, etc.
          </Text>

          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            {DOCUMENT_TYPES.map((docType) => (
              <Col key={docType}>
                <Upload
                  beforeUpload={(file) => handleFileSelect(file, docType)}
                  showUploadList={false}
                  multiple
                >
                  <Button icon={<UploadOutlined />} size="small">{docType}</Button>
                </Upload>
              </Col>
            ))}
          </Row>

          {pendingUploads.length > 0 && (
            <>
              <Divider titlePlacement="start">Pending Uploads</Divider>
              <List
                size="small"
                dataSource={pendingUploads}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button key="del" type="text" danger icon={<DeleteOutlined />} onClick={() => removePending(item.uid)} />,
                    ]}
                  >
                    <Space>
                      <FileOutlined />
                      <span>{item.title}</span>
                      <Tag>{item.file.name}</Tag>
                      <Text type="secondary">({(item.file.size / 1024).toFixed(0)} KB)</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </>
          )}

          {existingDocs.length > 0 && (
            <>
              <Divider titlePlacement="start">Uploaded Documents</Divider>
              <List
                size="small"
                dataSource={existingDocs}
                renderItem={(doc) => (
                  <List.Item
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        icon={<EyeOutlined />}
                        href={`${API_BASE}${doc.file_url}`}
                        target="_blank"
                      >
                        View
                      </Button>,
                      <Button
                        key="del"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteExistingDoc(doc)}
                      />,
                    ]}
                  >
                    <Space>
                      <FileOutlined />
                      <span>{doc.title}</span>
                      {doc.file_type && <Tag>{doc.file_type}</Tag>}
                    </Space>
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>

        {/* Sticky footer actions */}
        <div className="project-form-footer">
          <Space>
            <Button onClick={() => navigate('/projects')}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              {isEdit ? 'Update Project' : 'Create Project'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default ProjectFormPage;
