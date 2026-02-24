export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FieldValidation {
  email?: string;
  password?: string;
  confirmPassword?: string;
  required?: Record<string, string>;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string, minLength: number = 8): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }
  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

// Multiple fields validation
export const validateFields = (fields: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach((field) => {
    if (fields[field] !== undefined) {
      const result = rules[field](fields[field]);
      if (!result.isValid) {
        errors[field] = result.error || `${field} is invalid`;
      }
    }
  });
  
  return errors;
};

// Signup specific validation
export const validateSignupForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  institution?: string;
  selectedRole?: string | null;
  acceptTerms?: boolean;
}) => {
  const errors: Record<string, string> = {};

  // Validate required fields
  if (!data.firstName) errors.firstName = "First name is required";
  if (!data.lastName) errors.lastName = "Last name is required";

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error || "Invalid email";

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.error || "Invalid password";

  // Validate confirm password
  const confirmValidation = validateConfirmPassword(data.password, data.confirmPassword);
  if (!confirmValidation.isValid) errors.confirmPassword = confirmValidation.error || "Passwords do not match";

  // Validate institution for students
  if (data.selectedRole === "student" && !data.institution) {
    errors.institution = "Institution name is required";
  }

  // Validate terms
  if (!data.acceptTerms) {
    errors.terms = "You must accept the Terms of Service and Privacy Policy";
  }

  return errors;
};

// Login specific validation
export const validateLoginForm = (data: { username: string; password: string }) => {
  const errors: Record<string, string> = {};

  if (!data.username) errors.username = "Username or email is required";
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.error || "Password is required";

  return errors;
};