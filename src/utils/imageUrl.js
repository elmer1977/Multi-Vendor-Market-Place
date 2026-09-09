import { backend_url } from "../server";

export const imageUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${backend_url}/${String(value).replace(/^\/+/, "")}`;
};
