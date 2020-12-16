const ASSETMANTLE_API_URL = process.env.REACT_APP_ASSET_MANTLE_API;
export const getIdentitiesURL = (keyword) => `${ASSETMANTLE_API_URL}/xprt/identities/identities/${keyword}`;