import apiClient from './client';
import { SeedResponse } from './types';

export const seedDemoData = async (): Promise<SeedResponse> => {
  const res = await apiClient.post<SeedResponse>('/seed');
  return res.data;
};
