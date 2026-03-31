// Legacy app parameters previously used for Base44 integration have been removed.
// This module is kept only to satisfy existing imports.

export const appParams = {
  appId: null,
  token: null,
  fromUrl: typeof window !== 'undefined' ? window.location.href : null,
  functionsVersion: null,
  appBaseUrl: null,
};
