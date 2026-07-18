const blockedNames = new Set([
  "abc",
  "abcd",
  "anonymous",
  "asdf",
  "demo",
  "dummy",
  "fake",
  "guest",
  "hello",
  "name",
  "na",
  "none",
  "random",
  "sample",
  "test",
  "unknown",
  "user",
  "xyz",
]);

const keyboardPatterns = [
  "asdf",
  "lkjh",
  "mnbv",
  "poiuy",
  "qaz",
  "qwerty",
  "rfv",
  "tgb",
  "ujm",
  "wsx",
  "yhn",
  "zxcv",
];

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

  const words = name.split(/\s+/u);

  if (words.length < 2) {
    return "Please enter your full name (first and last name).";
  }

  if (words.length > 5) {
    return "Please enter a valid full name.";
  }

  const normalizedWords = words.map((word) =>
    word.toLocaleLowerCase("en-IN").replace(/['-]/g, "")
  );

  if (
    normalizedWords.some((word) => word.length < 2 || word.length > 24) ||
    new Set(normalizedWords).size !== normalizedWords.length
  ) {
    return "Please enter a valid full name.";
  }

  const hasSuspiciousWord = normalizedWords.some((word) => {
    if (blockedNames.has(word)) return true;

    // Apply keyboard and pronunciation checks only to Latin-script names.
    if (!/^[a-z]+$/i.test(word)) return false;

    return (
      keyboardPatterns.some((pattern) => word.includes(pattern)) ||
      !/[aeiouy]/i.test(word) ||
      /[^aeiouy]{5,}/i.test(word) ||
      /(.)\1{2,}/i.test(word) ||
      /^(.{2,4})\1+$/i.test(word) ||
      new Set(word).size < 2
    );
  });

  if (
    hasSuspiciousWord ||
    blockedNames.has(compactName) ||
    /^(.)\1{2,}$/u.test(compactName) ||
    compactName.length < 4
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
