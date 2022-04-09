export const capitalize = (content: string) => {
  if (typeof content !== "string") return "";
  return content.charAt(0).toUpperCase() + content.slice(1);
};
