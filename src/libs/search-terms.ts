const STOP_WORDS = new Set(["a", "an", "the"]);

/**
 * Split a string into lowercase search tokens.
 * Replaces commas with spaces, then splits on whitespace.
 */
function splitIntoTerms(value: string): string[] {
  return value
    .replace(/,/g, " ")
    .split(" ")
    .filter((s) => s !== "")
    .map((s) => s.toLowerCase());
}

/**
 * Extract all non-empty string values from a value, recursing into objects.
 */
function getAllStrings(value: unknown): string[] {
  if (typeof value === "string" && value.length > 0) return [value];
  if (value === null || value === undefined) return [];
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(getAllStrings);
  }
  return [String(value)];
}

/**
 * Generate deduplicated, lowercase search tokens from a data object.
 *
 * Always splits `data.id` into terms. Then for each key in `keys`,
 * recursively extracts all string values (handling nested objects like addresses)
 * and splits them into tokens. Filters out common stop words.
 *
 * @param data  - The source object (must have an `id` field).
 * @param keys  - Which keys on `data` to extract search tokens from.
 *
 * @example
 * generateSearchTerms(
 *   { id: "abc-123", email: "john@test.com", tileSize: "8x8" },
 *   ["email", "tileSize"],
 * );
 * => ["abc-123", "john@test.com", "8x8"]
 */
export function generateSearchTerms(
  data: Record<string, unknown> & { id?: string | null },
  keys: string[]
): string[] {
  const termSet = new Set<string>();

  const addFromString = (str: string) => {
    for (const term of splitIntoTerms(str)) {
      termSet.add(term);
    }
  };

  if (data.id) addFromString(data.id);

  for (const key of keys) {
    for (const str of getAllStrings(data[key])) {
      addFromString(str);
    }
  }

  for (const word of STOP_WORDS) {
    termSet.delete(word);
  }

  return [...termSet];
}
