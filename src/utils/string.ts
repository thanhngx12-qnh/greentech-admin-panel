// File: src/utils/string.ts
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD") // Chuẩn hóa unicode (tách dấu ra khỏi chữ)
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // Xóa các ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Xóa các dấu gạch ngang liên tiếp
    .trim();
};
