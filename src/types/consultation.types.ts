export interface ConsultationEligibilityResponse {
  success: boolean;
  message?: string;
  eligible_members: Array<{
    user_id: number;
    name: string;
    relationship: string;
  }>;
  ineligible_members: Array<{
    user_id: number;
    name: string;
    relationship: string;
    reason: string;
  }>;
}

export interface MedicalRecord {
  userMedication_id?: number;
  name: string;
  frequency?: string;
  comment?: string;
  isCurrentlyUsing: boolean;
  foreignId: string;
  ndc: string;
}

export interface MedicationAllergy {
  userMedicationAllergy_id?: number;
  description: string;
  foreign_id: number;
  damConceptId: number;
  damConceptIdType: number;
  whenCreated: string;
  active: number;
}

export interface MedicalCondition {
  userMedicalCondition_id?: number;
  name: string;
  description: string;
  status: number;
}

export interface SurgicalHistory {
  userSurgicalHistory_id?: number;
  name: string;
  procedureDate: string;
  description: string;
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
      medications: MedicalRecord[];
      allergies: MedicationAllergy[];
      medical_conditions: MedicalCondition[];
      surgical_history: SurgicalHistory[];
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
    when_scheduled?: string;
    provider_id?: number;
    start_time?: string;
    time_slot_id?: number;
    consult_time_zone: string;
    preferred_language?: 'en' | 'es';
  };
  state: number;
  reason_for_visit: string;
  prescription_refill: {
    is_needed: boolean;
    prescription_details: string;
  };
  patientPhone: string;
  problems?: {
    chief_complaint_id: number;
    other_problems: number[];
  };
  roi?: 'PCP' | 'Urgent Care' | 'Emergency Room' | 'Nothing';
}
