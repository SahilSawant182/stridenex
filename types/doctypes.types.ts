export interface DocField {
  fieldname: string;
  label: string;
  fieldtype: string;
  reqd?: number;
}

export interface DocTypeMeta {
  name: string;
  doctype: string;
  fields: DocField[];
}