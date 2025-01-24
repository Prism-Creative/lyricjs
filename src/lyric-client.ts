import axios, { AxiosInstance } from 'axios';
import { LyricConfig } from './types';
import { AuthService } from './services/auth.service';
import { ConsultationService } from './services/consultation.service';
import { PharmacyService } from './services/pharmacy.service';
import { MedicationService } from './services/medication.service';
import { CensusService } from './services/census.service';
import { StateService } from './services/state.service';
import { TimezoneService } from './services/timezone.service';
import { handleAxiosError } from './utils/error-handler';
import { LyricAuthenticationError } from './errors/lyric-api.error';

export class LyricClient {
  private readonly client: AxiosInstance;
  private token: string | null = null;

  public readonly auth: AuthService;
  public readonly consultation: ConsultationService;
  public readonly pharmacy: PharmacyService;
  public readonly medication: MedicationService;
  public readonly census: CensusService;
  public readonly state: StateService;
  public readonly timezone: TimezoneService;

  constructor(private readonly config: LyricConfig) {
    this.client = axios.create({
      baseURL: `${this.config.baseUrl}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    this.setupInterceptors();
    this.initializeServices();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const handled = handleAxiosError(error);
        if (
          handled instanceof LyricAuthenticationError &&
          handled.message === 'Token expired'
        ) {
          this.token = null;
        }
        return Promise.reject(handled);
      },
    );
  }
  private initializeServices(): void {
    Object.assign(this, {
      auth: new AuthService(this.client),
      consultation: new ConsultationService(this.client),
      pharmacy: new PharmacyService(this.client),
      medication: new MedicationService(this.client),
      census: new CensusService(this.client),
      state: new StateService(this.client),
      timezone: new TimezoneService(this.client),
    });
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }
}
