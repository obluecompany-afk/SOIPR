/**
 * Supabase client stub — sẽ kích hoạt khi tạo project Supabase ở Phase 3.
 * Hiện tại chỉ export type guard để tránh lỗi import.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);
