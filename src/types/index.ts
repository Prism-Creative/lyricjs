export interface LyricConfig {
  baseUrl: string;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
  type?: string;
}

export interface AuthResponse extends BaseResponse {
  accessToken?: string;
  userId?: number;
}

export interface Member {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  dob: string;
  gender: 'm' | 'f' | 'u';
  primaryPhone: string;
  address?: string;
  address2?: string;
  city?: string;
  state_id?: number;
  zipCode?: string;
  timezone_id?: number;
}

export interface ConsultationEligibilityResponse extends BaseResponse {
  eligible_members: Member[];
  ineligible_members: Member[];
}

export interface ConsultationStartResponse extends BaseResponse {
  consultation: {
    fee_details: {
      fee: number;
      currency: string;
    };
    available_states: Array<{
      state_id: number;
      name: string;
      abbreviation: string;
    }>;
    available_problems: {
      chief_complaints: Array<{
        problem_id: number;
        name: string;
        isWarning: boolean;
      }>;
      common_problems: Array<{
        problem_id: number;
        name: string;
        isWarning: boolean;
      }>;
      uncommon_problems: Array<{
        problem_id: number;
        name: string;
        isWarning: boolean;
      }>;
    };
    patient: {
      profile: Member;
      ehr: {
        medications: Array<{
          userMedication_id: number;
          name: string;
          frequency: string;
          comment: string;
          isCurrentlyUsing: boolean;
          ndc: string;
        }>;
        allergies: Array<{
          userMedicationAllergy_id: number;
          description: string;
          foreign_id: number;
          damConceptId: number;
          damConceptIdType: number;
          whenCreated: string;
          active: boolean;
        }>;
        medical_conditions: Array<{
          userMedicalCondition_id: number;
          name: string;
          description: string;
          status: boolean;
        }>;
      };
    };
  };
}

export interface ConsultationPayload {
  patient: {
    user_id: number;
    ehr: {
      personal: {
        heightFeet: number;
        heightInches: number;
        weight: number;
        breastfeeding?: boolean;
        pregnant?: boolean;
        last_menstruation_date?: string;
      };
      medications: Array<{
        userMedication_id?: number;
        comment: string;
        foreignId: string;
        frequency: string;
        isCurrentlyUsing: boolean;
        name: string;
        ndc: string;
      }>;
      allergies: Array<{
        userMedicationAllergy_id?: number;
        description: string;
        foreign_id: number;
        damConceptId: number;
        damConceptIdType: number;
        whenCreated: string;
        active: number;
      }>;
      medical_conditions: Array<{
        userMedicalCondition_id?: number;
        name: string;
        description: string;
        status: number;
      }>;
      attachments: number[];
    };
  };
  payment: {
    fee: number;
    nonce: string;
  };
  modality: 'phone' | 'video';
  sureScriptPharmacy_id: number;
  appointment_details: {
    when_scheduled: string | 'now';
    consult_time_zone: string;
    preferred_language: 'en' | 'es';
  };
  state: number;
  reason_for_visit: string;
  prescription_refill: {
    is_needed: boolean;
    prescription_details: string;
  };
  patientPhone: string;
  problems: {
    chief_complaint_id: number;
    other_problems: number[];
  };
  roi: 'PCP' | 'Urgent Care' | 'Emergency Room' | 'Nothing';
}

export interface PharmacySearchResponse extends BaseResponse {
  pharmacies: Array<{
    sureScriptPharmacy_id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    fax: string;
    distance?: number;
  }>;
}

export interface MedicationSearchResponse extends BaseResponse {
  medications: Array<{
    MedicationID: number;
    NDC: string;
    value: string;
    lexiGenDrugID: string;
    lexiDrugSynId: string;
  }>;
}

export interface CreatePrimaryMemberPayload {
  primaryExternalId: string;
  groupCode: string;
  planId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'm' | 'f' | 'u';
  primaryPhone?: string;
  email?: string;
  address?: string;
  address2?: string;
  city?: string;
  stateId?: number;
  timezoneId?: number;
  zipCode?: string;
  effectiveDate?: string;
  language?: 'en' | 'es';
  sendRegistrationNotification?: boolean;
  planDetailsId: string;
  heightFeet?: string;
  heightInches?: string;
  weight?: string;
  numAllowedDependents?: number;
}

export interface UpdatePrimaryMemberPayload {
  primaryExternalId: string;
  groupCode: string;
  planId: string;
  firstName: string;
  lastName: string;
  dob: string; //MM/dd/yyyy
  gender: 'm' | 'f' | 'u';
  primaryPhone?: string;
  email?: string;
  address?: string;
  address2?: string;
  city?: string;
  stateId?: number;
  timezoneId?: number;
  zipCode?: string;
  planDetailsId: string;
}

export interface CreateDependentPayload {
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'm' | 'f' | 'u';
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  address2?: string;
  city?: string;
  stateId?: number;
  timezoneId?: number;
  zipCode?: string;
  relationShipId: number;
}

export interface UpdateDependentPayload {
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'm' | 'f' | 'u';
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  address2?: string;
  city?: string;
  stateId?: number;
  timezoneId?: number;
  zipCode?: string;
  relationShipId: number;
  statusId: number;
  dependentUserId: number;
}

export interface UpdateTerminationDatePayload {
  primaryExternalId: string;
  groupCode: string;
  terminationDate: string;
}

export interface UpdateEffectiveDatePayload {
  primaryExternalId: string;
  groupCode: string;
  effectiveDate: string;
}

export interface RelationshipTypeResponse extends BaseResponse {
  dependentRelationships: Array<{
    name: string;
    dependentRelationship_id: number;
  }>;
}

export interface State {
  state_id: number;
  name: string;
  abbreviation: string;
}

export interface StateRulesResponse extends BaseResponse {
  modalities: Array<'telephone' | 'video'>;
  stateAbbreviation: string;
}

export interface Timezone {
  timezone_id: number;
  name: string;
  offset: number;
}

export interface TimezoneResponse extends BaseResponse {
  timezones: Timezone[];
}

export interface ProviderAvailabilityParams {
  consultation_type: 'primarycare' | 'urgentcare';
  userId: number;
  state: number;
  date: string;
  gender?: 'm' | 'f';
  pageNumber?: number;
}

export interface TimeSlot {
  providerschedule_id: number;
  start_time: string;
  end_time: string;
}

export interface Provider {
  user_id: number;
  name: string;
  specialty: string;
  available_time_slots: TimeSlot[];
}

export interface ProviderAvailabilityResponse extends BaseResponse {
  available_providers: Provider[];
}

export interface EmailValidationResponse extends BaseResponse {
  availableForUse: boolean;
}

export interface CreatePrimaryMemberResponse extends BaseResponse {
  userid: number;
}

export interface StatesResponse extends BaseResponse {
  states: State[];
}

export interface MedicationResponse extends BaseResponse {
  medications: Array<{
    userMedication_id: number;
    name: string;
    frequency: string;
    comment: string;
    isCurrentlyUsing: number;
    eazyScriptsForeignId: string;
    doseSpotForeignId: string;
    medication_id: string;
    ndc: number;
    whenCreated: string;
  }>;
}
