import { AxiosInstance } from 'axios';
import { StateRulesResponse, StatesResponse } from '../types';

export class StateService {
  constructor(private readonly client: AxiosInstance) {}

  async getStateRules(
    userId: number,
    stateAbbreviation: string,
  ): Promise<StateRulesResponse> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('stateAbbreviation', stateAbbreviation);

    const response = await this.client.postForm<StateRulesResponse>(
      '/states/rules/byUser',
      formData,
    );
    return response.data;
  }

  async getAllStates(): Promise<StatesResponse> {
    const response = await this.client.get<StatesResponse>('/states/all');
    return response.data;
  }
}
