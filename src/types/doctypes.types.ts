export interface FormField {
  fieldname: string;
  label: string;
  fieldtype: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
  read_only?: boolean;
  hidden?: boolean;
  layout?: 'half' | 'full';
  apiEndpoint?: string;
  apiParams?: Record<string, any>;
  mapOptions?: (data: any) => Array<{ value: string; label: string }>;
  multiSelect?: boolean;
  inputClassName?: string;
  maxLength?: number;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  accept?: string;
  minLetters?: number;
  allowCustom?: boolean;
  customPlaceholder?: string;
  onCreateCustomValue?: (value: string) => Promise<any>;
}

export interface FormConfig {
  doctype: string;
  fields: FormField[];
  buttonLabel?: string;
}