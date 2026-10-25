/** Pixels per metre for a resolution in dots per inch, as the BMP header stores it. */
export declare function pixelsPerMetre(dpi: number): number;
/**
 * Encodes RGBA pixels as an uncompressed 24-bit BMP. Rows are stored bottom-up and padded to four
 * bytes, as the format requires. The alpha channel is dropped, because a scan is opaque.
 */
export declare function encodeBmp(width: number, height: number, rgba: Uint8ClampedArray | Uint8Array, dpi: number): Uint8Array;
//# sourceMappingURL=bmp-encoder.d.ts.map