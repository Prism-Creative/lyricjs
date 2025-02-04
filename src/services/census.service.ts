import { AxiosInstance } from 'axios';
import {
  CreatePrimaryMemberPayload,
  CreateDependentPayload,
  UpdateTerminationDatePayload,
  RelationshipTypeResponse,
  EmailValidationResponse,
  BaseResponse,
  CreatePrimaryMemberResponse,
  UpdatePrimaryMemberPayload,
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

export class CensusService {
  constructor(private readonly client: AxiosInstance) {}

  async createPrimaryMember(
    payload: CreatePrimaryMemberPayload,
  ): Promise<CreatePrimaryMemberResponse> {
    try {
      // Validate required fields
      if (!payload.primaryExternalId || !payload.groupCode || !payload.planId) {
        throw new LyricValidationError(
          'External ID, group code, and plan ID are required',
        );
      }

      if (
        !payload.firstName ||
        !payload.lastName ||
        !payload.dob ||
        !payload.gender ||
        !payload.planDetailsId
      ) {
        throw new LyricValidationError(
          'First name, last name, DOB, gender, and plan details ID are required',
        );
      }

      const formData = objectToFormData(payload);
      const response = await this.client.postForm<CreatePrimaryMemberResponse>(
        '/census/createMember',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to create primary member',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async updatePrimaryMember(payload: UpdatePrimaryMemberPayload): Promise<any> {
    try {
      if (!payload.primaryExternalId || !payload.groupCode || !payload.planId) {
        throw new LyricValidationError(
          'External ID, group code, and plan ID are required',
        );
      }

      if (
        !payload.firstName ||
        !payload.lastName ||
        !payload.dob ||
        !payload.gender ||
        !payload.planDetailsId
      ) {
        throw new LyricValidationError(
          'First name, last name, DOB, gender, and plan details ID are required',
        );
      }

      const formData = objectToFormData(payload);
      const response = await this.client.postForm<CreatePrimaryMemberResponse>(
        '/census/updateMember',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to update primary member',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async createDependentMember(
    payload: CreateDependentPayload,
  ): Promise<BaseResponse> {
    try {
      // Validate required fields

      if (!payload.relationShipId) {
        throw new LyricValidationError('Relationship ID is required');
      }

      const formData = objectToFormData(payload);
      const response = await this.client.postForm<BaseResponse>(
        '/census/createMemberDependent',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to create dependent member',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async updateTerminationDate(
    payload: UpdateTerminationDatePayload,
  ): Promise<BaseResponse> {
    try {
      // Validate required fields
      if (
        !payload.primaryExternalId ||
        !payload.groupCode ||
        !payload.terminationDate
      ) {
        throw new LyricValidationError(
          'Primary external ID, group code, and termination date are required',
        );
      }

      const formData = objectToFormData(payload);
      const response = await this.client.postForm<BaseResponse>(
        '/census/updateTerminationDate',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to update termination date',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async getRelationshipTypes(
    groupCode: string,
    planId: string,
  ): Promise<RelationshipTypeResponse> {
    try {
      if (!groupCode || !planId) {
        throw new LyricValidationError('Group code and plan ID are required');
      }

      const formData = new FormData();
      formData.append('groupCode', groupCode);
      formData.append('planId', planId);

      const response = await this.client.postForm<RelationshipTypeResponse>(
        '/census/relationshipType',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to get relationship types',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async validateEmail(email: string): Promise<EmailValidationResponse> {
    try {
      if (!email) {
        throw new LyricValidationError('Email is required');
      }

      const formData = new FormData();
      formData.append('email', email);

      const response = await this.client.postForm<EmailValidationResponse>(
        '/census/validateEmail',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to validate email',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  async createDependent(dependent: DependentMember) {
    try {
      const formData = new FormData();
      Object.entries(dependent).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await this.client.post(
        '/census/createMemberDependent',
        formData,
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

  async updateDependent(dependent: DependentMember) {
    try {
      const formData = new FormData();
      Object.entries(dependent).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await this.client.post(
        '/census/updateMemberDependent',
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to update dependent',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }
}
