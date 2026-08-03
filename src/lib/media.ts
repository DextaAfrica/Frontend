export function isRemoteAsset(source: string) {
  return source.startsWith("https://") || source.startsWith("http://");
}
