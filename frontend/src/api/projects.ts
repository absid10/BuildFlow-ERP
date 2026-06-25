/**
 * BuildFlow ERP — Projects API
 */

import apiClient from './client';
import type { PaginatedResponse, Project, ProjectDocument } from '../types';

export interface ProjectCreatePayload {
  name: string;
  category: string;
  project_type: string;
  ownership: string;
  client_name?: string | null;
  budget: number;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  payment_terms?: string | null;
  total_land_area?: number | null;
  total_land_area_unit?: string | null;
  built_up_area?: number | null;
  built_up_area_unit?: string | null;
}

export interface ProjectNameCheck {
  exists: boolean;
  matching_names: string[];
}

export const projectsApi = {
  list: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Project>> => {
    const skip = (page - 1) * pageSize;
    const res = await apiClient.get<PaginatedResponse<Project>>('/api/v1/projects/', {
      params: { skip, limit: pageSize },
    });
    return res.data;
  },

  get: async (id: string): Promise<Project & { documents?: ProjectDocument[] }> => {
    const res = await apiClient.get(`/api/v1/projects/${id}`);
    return res.data;
  },

  create: async (data: ProjectCreatePayload): Promise<Project> => {
    const res = await apiClient.post('/api/v1/projects/', data);
    return res.data;
  },

  update: async (id: string, data: Partial<ProjectCreatePayload>): Promise<Project> => {
    const res = await apiClient.put(`/api/v1/projects/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/projects/${id}`);
  },

  checkName: async (name: string, excludeId?: string): Promise<ProjectNameCheck> => {
    const res = await apiClient.get<ProjectNameCheck>('/api/v1/projects/check-name', {
      params: { name, exclude_id: excludeId },
    });
    return res.data;
  },

  uploadDocument: async (projectId: string, file: File, title: string): Promise<ProjectDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    const res = await apiClient.post(`/api/v1/projects/${projectId}/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteDocument: async (projectId: string, documentId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/projects/${projectId}/documents/${documentId}`);
  },
};
