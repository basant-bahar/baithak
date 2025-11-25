export function parseToLocalDate(dateStr: string): Date {
  const date = new Date(dateStr);
  const tzOffsetMinutes = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + tzOffsetMinutes);
  return date;
}

export function computeExpiry(paymentDateStr: string, currentExpiryStr?: string, membershipType?: string): Date {
  const currentExpiry = currentExpiryStr ? parseToLocalDate(currentExpiryStr) : undefined;
  const paymentDate = parseToLocalDate(paymentDateStr);

  if (membershipType && membershipType === "Life") {
    // Life membership never expires but an external system needs a valid date so set to a far future date
    return new Date(9999, 11, 31);
  }
  if (currentExpiry && currentExpiry > paymentDate) {
    // Payment made before expiry or first time payment
    // Add year to the current expiry
    return new Date(currentExpiry.getFullYear() + 1, currentExpiry.getMonth() + 1, 0);
  }
  // Payment after expiry or a new membership
  // Set expiry to the last day of earlier month + one year
  return new Date(paymentDate.getFullYear() + 1, paymentDate.getMonth(), 0);
}
