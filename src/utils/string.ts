// File: src/utils/string.ts
import { pinyin } from "pinyin-pro";

export const generateSlug = (str: string): string => {
  if (!str) return "";

  // Kiểm tra nếu chuỗi chứa ký tự tiếng Trung (Han characters)
  const hasChinese = /[\u4e00-\u9fa5]/.test(str);

  let processedStr = str;
  if (hasChinese) {
    // Chuyển tiếng Trung sang Pinyin không dấu, cách nhau bởi khoảng trắng
    processedStr = pinyin(str, { toneType: "none", nonPinyin: "removed" });
  }

  return processedStr
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};
