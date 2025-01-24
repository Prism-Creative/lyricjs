import { AxiosInstance } from 'axios';
import { MedicationSearchResponse, MedicationResponse } from '../types';

export class MedicationService {
  constructor(private readonly client: AxiosInstance) {}

  async searchMedications(query: string): Promise<MedicationSearchResponse> {
    const response = await this.client.get<MedicationSearchResponse>(
      '/medication/search',
      {
        params: { query },
      },
    );
    return response.data;
  }

  async getActiveMedications(): Promise<MedicationResponse> {
    const response = await this.client.get<MedicationResponse>(
      '/medication/getActive',
    );
    return response.data;
  }
}
