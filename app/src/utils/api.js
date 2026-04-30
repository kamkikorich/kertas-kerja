import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Proposals
export const createProposal = (formData) =>
  api.post('/api/proposals', formData);

export const getProposals = () =>
  api.get('/api/proposals');

export const getProposal = (id) =>
  api.get(`/api/proposals/${id}`);

export const deleteProposal = (id) =>
  api.delete(`/api/proposals/${id}`);

export default api;
