import { AxiosInstance } from 'axios';
import { TimezoneResponse } from '../types';

export class TimezoneService {
  constructor(private readonly client: AxiosInstance) {}

  async getTimezones(): Promise<TimezoneResponse> {
    const response = await this.client.get<TimezoneResponse>('/timezones/all');
    return response.data;
  }
}
