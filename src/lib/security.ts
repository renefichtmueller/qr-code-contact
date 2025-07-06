import DOMPurify from 'dompurify';
import { z } from 'zod';

// Zod schema for ContactData validation
export const ContactDataSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  title: z.string().max(100).trim(),
  company: z.string().max(100).trim(),
  email: z.string().email().max(254).trim(),
  phone: z.string().max(20).trim(),
  website: z.string().refine((url) => {
    if (!url) return true; // Allow empty string
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }, { message: "Website must use HTTPS protocol" }),
  address: z.string().max(200).trim(),
  profileImage: z.string().optional(),
  companyLogo: z.string().optional(),
  template: z.string(),
  customColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format").optional()
});

export type ValidatedContactData = z.infer<typeof ContactDataSchema>;

// Safe JSON parsing with validation
export const safeJSONParse = <T>(jsonString: string, fallback: T, schema?: z.ZodSchema<T>): T => {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (schema) {
      const result = schema.safeParse(parsed);
      return result.success ? result.data : fallback;
    }
    
    return parsed;
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
};

// Input sanitization
export const sanitizeString = (input: string, maxLength = 1000): string => {
  if (typeof input !== 'string') return '';
  
  // Sanitize HTML and trim
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
  
  // Limit length
  return sanitized.substring(0, maxLength);
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// URL validation - only allow HTTPS
export const validateURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && url.length <= 2000;
  } catch {
    return false;
  }
};

// Hex color validation
export const validateHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

// Image file validation
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'File size must be under 5MB' };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG and PNG files are allowed' };
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = ['.exe', '.js', '.html', '.php', '.asp'];
  const fileName = file.name.toLowerCase();
  for (const pattern of suspiciousPatterns) {
    if (fileName.includes(pattern)) {
      return { isValid: false, error: 'Invalid file type detected' };
    }
  }
  
  return { isValid: true };
};

// Phone number sanitization
export const sanitizePhoneNumber = (phone: string): string => {
  // Remove all non-digits and common phone symbols, keep + for international
  return phone.replace(/[^\\d+\\-\\s()]/g, '').trim().substring(0, 20);
};

// Text length validation
export const validateTextLength = (text: string, maxLength: number): boolean => {
  return typeof text === 'string' && text.length <= maxLength;
};

// Form data sanitization helper
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};
