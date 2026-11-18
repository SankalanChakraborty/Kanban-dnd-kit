export const normalizeEmail = (value: string) => {
  return typeof value === "string" ? value.toLowerCase().trim() : "";
};
