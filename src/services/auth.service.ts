import { AxiosInstance } from 'axios';
import { AuthResponse } from '../types';
import { handleAxiosError } from '../utils/error-handler';
import { LyricValidationError } from '../errors/lyric-api.error';

export class AuthService {
  constructor(private readonly client: AxiosInstance) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!email || !password) {
        throw new LyricValidationError('Email and password are required');
      }

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await this.client.post<AuthResponse>('/login', formData);

      if (!response.data.success) {
        throw new LyricValidationError(response.data.message || 'Login failed');
      }

      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
}