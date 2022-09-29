const ASSETMANTLE_API_URL = process.env.REACT_APP_ASSET_MANTLE_API;
export const getFaucet = (address) => `${ASSETMANTLE_API_URL}/auth/accounts/${address}`;
export const issueIdentityUrl = () => `${ASSETMANTLE_API_URL}/identities/issue`;