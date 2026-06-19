import { fetchService } from './genericFetchService';

export const getAllUsers = () =>
  fetchService('/admin/users', { method: 'GET' });

export const getAllComplaints = () =>
  fetchService('/admin/complaints', { method: 'GET' });

export const updateComplaintStatus = (complaintId, status) =>
  fetchService(`/admin/complaints/${complaintId}`, { method: 'PATCH', data: { status } });

export const getAllSemesters = () =>
  fetchService('/semesters', { method: 'GET' });

export const getCurrentSemester = () =>
  fetchService('/semesters/current', { method: 'GET' });

export const createSemester = (data) =>
  fetchService('/admin/semesters', { method: 'POST', data });

export const getDepartments = () =>
  fetchService('/departments', { method: 'GET' });
