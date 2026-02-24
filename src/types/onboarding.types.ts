export interface OnboardingField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'date' | 'checkbox' | 'radio' | 'skills' | 'password' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  width?: 'full' | 'half' | 'third' | 'quarter';
  defaultValue?: any;
  disabled?: boolean;
}

export interface OnboardingStep {
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
}

export interface OnboardingData {
  [key: string]: any;
}

// New: Add configuration type for different user types
export interface UserTypeConfig {
  userType: 'student' | 'college' | 'mentor' | 'institution';
  title: string;
  description: string;
  fields: OnboardingField[];
  apiEndpoint?: string;
  redirectPath?: string;
}