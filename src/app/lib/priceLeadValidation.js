const blockedNames = new Set([
  "abc",
  "abcd",
  "asdf",
  "fake",
  "guest",
  "name",
  "none",
  "random",
  "test",
  "user",
  "xyz",
]);

const blockedNumbers = new Set([
  "6123456789",
  "6666666666",
  "7777777777",
  "8888888888",
  "9000000000",
  "9876543210",
  "9999999999",
]);

export function normalizeLeadName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function getNameError(value) {
  const name = normalizeLeadName(value);
  const compactName = name.toLocaleLowerCase("en-IN").replace(/[\s'-]/g, "");

  if (name.length < 2) {
    return "Please enter your real name.";
  }

  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'-]*$/u.test(name)) {
    return "Name can contain letters, spaces, apostrophes and hyphens only.";
  }

  if (
    blockedNames.has(compactName) ||
    /^(.)\1{2,}$/u.test(compactName) ||
    compactName.length < 2
  ) {
    return "Please enter your real name.";
  }

  return "";
}

export function normalizeIndianMobile(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

export function getIndianMobileError(value) {
  const digits = normalizeIndianMobile(value);

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return "Enter a valid 10-digit Indian WhatsApp number.";
  }

  if (
    blockedNumbers.has(digits) ||
    /^(\d)\1{9}$/.test(digits) ||
    /^(?:0123456789|1234567890)$/.test(digits)
  ) {
    return "Please enter your real WhatsApp number.";
  }

  return "";
}
