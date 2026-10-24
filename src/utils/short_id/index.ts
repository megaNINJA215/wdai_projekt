const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const BASE = ALPHABET.length;

export function shortID(length = 8): string {
  if (!Number.isInteger(length) || length < 1 || length > 128) {
    throw new RangeError("length musi być liczbą całkowitą z zakresu 1–128");
  }

  const bytes = new Uint8Array(length);
  let result = "";

  while (result.length < length) {
    crypto.getRandomValues(bytes);

    for (const byte of bytes) {
      if (byte >= 256 - (256 % BASE)) continue;

      result += ALPHABET[byte % BASE];

      if (result.length === length) break;
    }
  }

  return result;
}
