export function isDataUrl(str) {
  return typeof str === "string" && str.startsWith("data:image");
}
