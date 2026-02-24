"use client";

import { useState } from "react";
import { ValidationResult } from "@/lib/validators";

interface UseFormValidationProps<T> {
  initialErrors?: Partial<Record<keyof T, string>>;
}

export function useFormValidation<T extends Record<string, any>>(initialErrors = {}) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>(initialErrors);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearFieldError = (field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (
    field: keyof T,
    value: any,
    validator: (value: any) => ValidationResult
  ) => {
    const result = validator(value);
    if (!result.isValid) {
      setFieldError(field, result.error || `${String(field)} is invalid`);
    } else {
      clearFieldError(field);
    }
    return result.isValid;
  };

  const validateAll = (data: T, validators: Partial<Record<keyof T, (value: any) => ValidationResult>>) => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(validators).forEach((key) => {
      const field = key as keyof T;
      const validator = validators[field];
      if (validator) {
        const result = validator(data[field]);
        if (!result.isValid) {
          newErrors[field] = result.error || `${String(field)} is invalid`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const hasError = (field: keyof T) => !!errors[field];
  const getError = (field: keyof T) => errors[field];
  const isTouched = (field: keyof T) => !!touched[field];
  const shouldShowError = (field: keyof T) => isTouched(field) && hasError(field);

  return {
    errors,
    touched,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    validateField,
    validateAll,
    hasError,
    getError,
    isTouched,
    shouldShowError,
  };
}