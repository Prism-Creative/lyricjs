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
import { apiClient } from '../utils';

export interface PetConsultation {
  phoneNumber: string;
  modality: 'phone' | 'video';
  problemId: number;
  description: string;
  optIn: boolean;
  petConsultTimeZone?: string;
}

export interface ConsultationFilters {
  start?: number;
  length?: number;
  status?: 'all' | 'new' | 'canceled' | 'inprogress' | 'complete';
  petConsultId?: string;
}

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

  static async createPetConsultation(consultation: PetConsultation) {
    const formData = new FormData();
    Object.entries(consultation).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.post(
      '/consultation/createConsultation/primarycare',
      formData,
    );
  }

  static async getPetConsultations(filters: ConsultationFilters) {
    const formData = new FormData();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.post(
      '/petConsultationHistory/getPetConsultations',
      formData,
    );
  }

  async searchMedications(query: string) {
    try {
      const response = await this.client.get('/medication/search', {
        params: { query },
      });

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to search medications',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async searchMedicationAllergies(query: string) {
    try {
      const response = await this.client.get('/medicationAllergies/search', {
        params: { query },
      });

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to search medication allergies',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async searchPharmacies(query: string, zipCode?: string) {
    try {
      const response = await this.client.get('/pharmacy/search', {
        params: {
          query,
          zipCode,
        },
      });

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to search pharmacies',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async addAttachment(userId: number, file: File) {
    try {
      const formData = new FormData();
      formData.append('AttachmentFile', file);

      const response = await this.client.post(
        `/attachment/add/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to upload attachment',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async validateStateRules(userId: number, stateAbbreviation: string) {
    try {
      const formData = new FormData();
      formData.append('userId', userId.toString());
      formData.append('stateAbbreviation', stateAbbreviation);

      const response = await this.client.post('/states/rules/byUser', formData);

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to validate state rules',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async getAllStates() {
    try {
      const response = await this.client.get('/states/all');

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get states',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async getAllTimezones() {
    try {
      const response = await this.client.get('/timezones/all');

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get timezones',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }
}
