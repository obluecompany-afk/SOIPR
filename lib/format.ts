/**
 * Format số tiền VND, 25.000 → "25.000₫".
 * Dùng `vi-VN` locale cho dấu chấm phân cách hàng nghìn.
 */
export function formatVND(n: number): string {
  return Math.round(n).toLocaleString('vi-VN') + '₫';
}

export const FREE_SHIPPING_THRESHOLD = 1250000;
