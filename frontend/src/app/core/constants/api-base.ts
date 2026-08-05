export const API_BASE: string =
  (window as unknown as { __API_BASE__?: string }).__API_BASE__ || '/api/v1';
