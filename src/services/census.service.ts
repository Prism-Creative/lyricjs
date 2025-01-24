import { AxiosInstance } from 'axios';
import {
  CreatePrimaryMemberPayload,
  CreateDependentPayload,
  UpdateTerminationDatePayload,
  RelationshipTypeResponse,
  EmailValidationResponse,
  BaseResponse,
} from '../types';
import { handleAxiosError } from '../utils/error-handler';
import { LyricValidationError } from '../errors/lyric-api.error';
import { objectToFormData } from '../utils';

export class CensusService {
  constructor(private readonly client: AxiosInstance) {}

  async createPrimaryMember(
    payload: CreatePrimaryMemberPayload,
  ): Promise<BaseResponse> {
    try {
      // Validate required fields
      if (!payload.externalId || !payload.groupCode || !payload.planId) {
        throw new LyricValidationError(
          'External ID, group code, and plan ID are required',
        );
      }

      if (
        !payload.firstname ||
        !payload.lastname ||
        !payload.dob ||
        !payload.gender
      ) {
        throw new LyricValidationError(
          'First name, last name, DOB, and gender are required',
        );
      }

      const formData = objectToFormData(payload);
      const response = await this.client.postForm<BaseResponse>(
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

  async createDependentMember(
    payload: CreateDependentPayload,
  ): Promise<BaseResponse> {
    try {
      // Validate required fields
      if (!payload.primaryExternalId) {
        throw new LyricValidationError('Primary external ID is required');
      }

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
}
