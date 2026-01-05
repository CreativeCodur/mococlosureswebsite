/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "")

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"]/g, "")

  // Trim whitespace
  sanitized = sanitized.trim()

  // Limit length to prevent overflow attacks
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000)
  }

  return sanitized
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validates phone number format
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Check if it's between 10-15 digits (international support)
  return digits.length >= 10 && digits.length <= 15
}
