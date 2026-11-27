export const validateString = (value: any, fieldName: string, minLength: number = 1, maxLength: number = 255, required: boolean = true) => {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    if (required) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    return { isValid: true, value: '' };
  }

  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters.` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters.` };
  }

  return { isValid: true, value: trimmed };
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
};
