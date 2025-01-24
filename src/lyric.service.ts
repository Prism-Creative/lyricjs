import { Injectable } from '@nestjs/common';
import { LyricClient } from './lyric-client';

@Injectable()
export class LyricService {
  constructor(private readonly lyricClient: LyricClient) {}

  // Expose all the client services through getters
  get auth() {
    return this.lyricClient.auth;
  }

  get consultation() {
    return this.lyricClient.consultation;
  }

  get pharmacy() {
    return this.lyricClient.pharmacy;
  }

  get medication() {
    return this.lyricClient.medication;
  }

  get census() {
    return this.lyricClient.census;
  }

  get state() {
    return this.lyricClient.state;
  }

  get timezone() {
    return this.lyricClient.timezone;
  }

  // Expose token management methods
  setAuthToken(token: string) {
    this.lyricClient.setAuthToken(token);
  }

  clearAuthToken() {
    this.lyricClient.clearAuthToken();
  }
}
