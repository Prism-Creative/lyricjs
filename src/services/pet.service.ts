import { apiClient } from '../utils';

export interface Pet {
  name: string;
  species: string;
  breed: string;
  years: number;
  months: number;
  gender: 'm' | 'f';
  sterilization: boolean;
}

export class PetService {
  static async createPet(pet: Pet) {
    const formData = new FormData();
    Object.entries(pet).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    return apiClient.post('/pet', formData);
  }

  static async updatePet(petId: string, pet: Pet) {
    const formData = new FormData();
    Object.entries(pet).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    return apiClient.post(`/pet/${petId}`, formData);
  }

  static async uploadProfileImage(petId: string, image: File) {
    const formData = new FormData();
    formData.append('petBioImage', image);

    return apiClient.post(`/pet/${petId}/addProfileImage`, formData);
  }
}
