import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, getAllComplaints, updateComplaintStatus, createSemester } from '../../services/adminService';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers', async (_, { rejectWithValue }) => {
    const result = await getAllUsers();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchAllComplaints = createAsyncThunk(
  'admin/fetchComplaints', async (_, { rejectWithValue }) => {
    const result = await getAllComplaints();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const resolveComplaint = createAsyncThunk(
  'admin/resolveComplaint', async ({ complaintId, status }, { rejectWithValue }) => {
    const result = await updateComplaintStatus(complaintId, status);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const addSemester = createAsyncThunk(
  'admin/addSemester', async (semesterData, { rejectWithValue }) => {
    const result = await createSemester(semesterData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
