
import { ValidationState } from "@/components/ui/Input";

export const validateLogin = (value: string): ValidationState => {
  if (value.length < 3 || value.length > 20) {
    return "invalid";
  }

  return "valid";
};

export const validatePassword = (value: string): ValidationState => {
  if (value.length < 6 || value.length > 100) {
    return "invalid";
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);

  const score = [
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  if (score < 2) {
    return "invalid";
  }

  if (score < 3 && value.length < 10) {
    return "warning";
  }

  return "valid";
};

export const validateConfirmPassword = (
  value: string,
  password: string
): ValidationState => {
  if (value !== password) {
    return "invalid";
  }

  return "valid";
};

export const validateCommunityName = (value: string): ValidationState => {
  if (value.length < 3 || value.length > 20 || !/^[a-zA-Z0-9_]+$/.test(value)) {
    return "invalid";
  }
  return "valid";
};

export const validateCommunityDescription = (value: string): ValidationState => {
  if (value.length > 200) {
    return "invalid";
  }
  return "valid";
}