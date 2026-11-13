type ContactPhoneInfo = {
  phone?: string | null;
  primaryPhone?: string | null;
  secondaryPhones?: string[] | null;
};

export function splitPhoneInput(value: string): string[] {
  return value.split(",").map((phone) => phone.trim());
}

export function getContactPhoneNumbers(contactInfo?: ContactPhoneInfo | null) {
  const legacyPhone = typeof contactInfo?.phone === "string" ? contactInfo.phone : "";
  const legacyPhones = splitPhoneInput(legacyPhone).filter(Boolean);
  const primaryPhone =
    (typeof contactInfo?.primaryPhone === "string" && contactInfo.primaryPhone.trim()) ||
    legacyPhones[0] ||
    "";
  const secondaryPhones = Array.isArray(contactInfo?.secondaryPhones)
    ? contactInfo.secondaryPhones
        .filter((phone): phone is string => typeof phone === "string")
        .map((phone) => phone.trim())
        .filter(Boolean)
    : legacyPhones.slice(1);

  return { primaryPhone, secondaryPhones };
}
