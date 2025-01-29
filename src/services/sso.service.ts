import { AxiosInstance } from 'axios';
import { handleAxiosError } from '../utils/error-handler';
import { LyricValidationError } from '../errors/lyric-api.error';
import { BaseResponse } from '../types';

export interface SSOTokenResponse extends BaseResponse {
  token: string;
}

export class SSOService {
  constructor(private readonly client: AxiosInstance) {}

  async createAccessTokenWithGroupId(
    groupId: string,
    externalId: string,
  ): Promise<SSOTokenResponse> {
    return this.createToken('/sso/createAccessTokenWithGroupId', {
      groupId,
      externalId,
    });
  }

  async createAccessTokenWithGroupCode(
    groupCode: string,
    externalId: string,
  ): Promise<SSOTokenResponse> {
    return this.createToken('/sso/createAccessTokenWithGroupCode', {
      groupCode,
      externalId,
    });
  }

  async createAPIAccessToken(
    groupCode: string,
    externalId: string,
  ): Promise<SSOTokenResponse> {
    try {
      const response = await this.client.post<SSOTokenResponse>(
        '/sso/createAPIAccessToken',
        new URLSearchParams({
          groupCode,
          externalId,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to create access token',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }

  private async createToken(
    endpoint: string,
    params: Record<string, string>,
  ): Promise<SSOTokenResponse> {
    try {
      const formData = new FormData();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await this.client.post<SSOTokenResponse>(
        endpoint,
        formData,
      );

      if (!response.data.success) {
        throw new LyricValidationError(
          response.data.message || 'Failed to create access token',
        );
      }

      return response.data;
    } catch (error: unknown) {
      throw handleAxiosError(error);
    }
  }
}
