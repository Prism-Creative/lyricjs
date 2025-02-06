import { AxiosInstance } from 'axios';
import {
  CreatePrimaryMemberPayload,
  CreateDependentPayload,
  UpdateTerminationDatePayload,
  RelationshipTypeResponse,
  EmailValidationResponse,
  BaseResponse,
  CreatePrimaryMemberResponse,
  UpdateDependentPayload,
} from '../types';
import { handleAxiosError } from '../utils/error-handler';
import { LyricValidationError } from '../errors/lyric-api.error';
import { objectToFormData } from '../utils';

export interface DependentMember {
  primaryExternalId: string;
  dependentExternalId: string;
  groupCode: string;
  planId: string;
  firstname: string;
  lastname: string;
  dob: string;
  gender: 'm' | 'f' | 'u';
  primaryPhone?: string;
  email?: string;
  address?: string;
  address2?: string;
  city?: string;
  stateId: number;
  timezoneId?: number;
  zipCode?: string;
  relationShipId: number;
  effectiveDate?: string;
  language?: 'en' | 'es';
  sendRegistrationNotification?: boolean;
}

export class MemberService {
  constructor(private readonly client: AxiosInstance) {}

  async getAccountInfo(): Promise<any> {
    try {
      const response = await this.client.get<any>(
        '/memberAccount/getFullAccountInfo',
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get account info',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async createDependent(payload: CreateDependentPayload): Promise<any> {
    try {
      const formData = objectToFormData(payload);

      const response = await this.client.post<any>(
        '/memberAccount/createDependent',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to create dependent',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async updateDependent(payload: UpdateDependentPayload): Promise<any> {
    try {
      const formData = objectToFormData(payload);

      const response = await this.client.post<any>(
        '/memberAccount/updateDependentInfo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get update dependent info',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }
}
