import { AxiosInstance } from 'axios';
import { PharmacySearchResponse } from '../types';
import { handleAxiosError } from '../utils/error-handler';
import { LyricValidationError } from '../errors/lyric-api.error';

export class PharmacyService {
  constructor(private readonly client: AxiosInstance) {}

  async searchPharmacies(
    query: string,
    zipCode?: string,
  ): Promise<PharmacySearchResponse> {
    try {
      if (!query) {
        throw new LyricValidationError('Search query is required');
      }

      const response = await this.client.get<PharmacySearchResponse>(
        '/pharmacy/search',
        {
          params: {
            query,
            ...(zipCode && { zipCode }),
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to search pharmacies',
        );
      }

      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
}
