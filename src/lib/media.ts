export function isRemoteAsset(source: string) {
  return source.startsWith("https://") || source.startsWith("http://");
}

/**
 * A tiny neutral placeholder for decorative, below-the-fold images.
 *
 * Passed as `next/image`'s `placeholder` it does two things: gives a soft
 * blur-up instead of a blank box while the photo streams in, and — because
 * `next/image` only warns about a lazy image measuring as the LCP element
 * when its `placeholder` is still the default `"empty"` — it silences that
 * dev warning for images that legitimately shouldn't be prioritised (they're
 * below the fold; they only ever brush past LCP mid-scroll before the visitor
 * interacts). A 12×8 flat mid-grey, scaled and blurred by `next/image` itself.
 */
export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI4Ij48cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iOCIgZmlsbD0iI2M5YzZiZiIvPjwvc3ZnPg==";
