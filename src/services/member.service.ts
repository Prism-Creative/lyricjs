import { AxiosInstance } from 'axios';
import {
  CreatePrimaryMemberPayload,
  CreateDependentPayload,
  UpdateTerminationDatePayload,
  RelationshipTypeResponse,
  EmailValidationResponse,
  BaseResponse,
  CreatePrimaryMemberResponse,
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
}
