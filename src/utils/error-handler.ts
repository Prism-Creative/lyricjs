import axios, { AxiosError } from 'axios';
import {
  LyricApiError,
  LyricAuthenticationError,
  LyricValidationError,
  LyricNotFoundError,
  LyricNetworkError,
} from '../errors/lyric-api.error';

export function handleAxiosError(error: unknown): any {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const response = axiosError.response;
    const data = response?.data as any;

    // Handle token expiration
    if (
      data?.type === 'mt:authorization' &&
      data?.message === 'Token Expired'
    ) {
      throw new LyricAuthenticationError('Token expired', data);
    }

    // Handle other authentication errors
    if (response?.status === 401) {
      throw new LyricAuthenticationError(
        data?.message || 'Authentication failed',
        data,
      );
    }

    // Handle validation errors
    if (response?.status === 400) {
      throw new LyricValidationError(
        data?.message || 'Validation failed',
        data,
      );
    }

    // Handle not found errors
    if (response?.status === 404) {
      throw new LyricNotFoundError(data?.message || 'Resource not found', data);
    }

    // Handle network errors
    if (axiosError.code === 'ECONNABORTED' || !response) {
      throw new LyricNetworkError(
        'Network error: Unable to reach Lyric Health API',
      );
    }

    // Handle any other API errors
    throw new LyricApiError(
      data?.message || 'An error occurred with the Lyric Health API',
      response?.status,
      data?.type,
      data,
    );
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    throw new LyricApiError(error.message);
  }

  throw new LyricApiError('An unknown error occurred');
}
