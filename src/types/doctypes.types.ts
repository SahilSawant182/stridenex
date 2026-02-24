export interface FormField {
  fieldname: string;
  label: string;
  fieldtype: string;
  placeholder?: string;
  required?: boolean;
  options?: any[];
  default?: string;
  description?: string;
  read_only?: boolean;
  hidden?: boolean;
  layout?: 'full' | 'half';
}

export interface FormConfig {
  doctype: string;
  fields: FormField[];
  buttonLabel?: string;
}