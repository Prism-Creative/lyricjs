import { AxiosInstance } from 'axios';
import {
  ConsultationEligibilityResponse,
  ConsultationStartResponse,
  ConsultationPayload,
  BaseResponse,
  ProviderAvailabilityParams,
  ProviderAvailabilityResponse,
} from '../types';
import { handleAxiosError } from '../utils/error-handler';
import { LyricValidationError } from '../errors/lyric-api.error';

export class ConsultationService {
  constructor(private readonly client: AxiosInstance) {}

  async getEligibleMembers(
    consultationType: 'urgentcare' | 'primarycare',
    modality: 'phone' | 'video',
  ): Promise<ConsultationEligibilityResponse> {
    try {
      const response = await this.client.get<ConsultationEligibilityResponse>(
        `/v2/consultation/eligibility`,
        {
          params: {
            consultation_type: consultationType,
            modality,
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get eligible members',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async startConsultation(
    consultationType: 'urgentcare' | 'primarycare',
    userId: number,
    modality: 'phone' | 'video',
  ): Promise<ConsultationStartResponse> {
    try {
      const response = await this.client.get<ConsultationStartResponse>(
        `/v2/consultation/${consultationType}`,
        {
          params: {
            user_id: userId,
            modality,
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to start consultation',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async createConsultation(
    consultationType: 'urgentcare' | 'primarycare',
    payload: ConsultationPayload,
  ): Promise<BaseResponse> {
    try {
      // Validate required fields
      if (!payload.patient?.user_id) {
        throw new LyricValidationError('User ID is required');
      }

      if (!payload.state) {
        throw new LyricValidationError('State is required');
      }

      const response = await this.client.post<BaseResponse>(
        `/consultation/createConsultation/${consultationType}`,
        payload,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to create consultation',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async getProviderAvailability(
    params: ProviderAvailabilityParams,
  ): Promise<ProviderAvailabilityResponse> {
    try {
      // Validate required fields
      if (!params.userId || !params.state || !params.date) {
        throw new LyricValidationError('User ID, state, and date are required');
      }

      const response = await this.client.get<ProviderAvailabilityResponse>(
        '/v2/consultation/availability',
        { params },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get provider availability',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }
}
