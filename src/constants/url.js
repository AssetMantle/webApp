const ASSETMANTLE_API_URL = process.env.REACT_APP_ASSET_MANTLE_API;
export const getFaucet = (height) => `${ASSETMANTLE_API_URL}/auth/accounts/${height}`;
