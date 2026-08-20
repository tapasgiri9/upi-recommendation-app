const assets: any[] = [];

export function registerAsset(asset: any): number {
  return assets.push(asset);
}

export function getAssetByID(assetId: number): any {
  return assets[assetId - 1];
}

export const AssetRegistry = {
  registerAsset,
  getAssetByID,
};

export default {
  registerAsset,
  getAssetByID,
};
