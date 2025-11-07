export function SortArrayAlphabetically(arr, key) {
  if (!Array.isArray(arr)) {
    console.error('❌ Error: First argument must be an array');
    return arr;
  }

  try {
    if (key) {
      const keyExists = arr.every((item) => item && typeof item === 'object' && key in item);
      if (!keyExists) {
        console.error(`❌ Error: Key "${key}" does not exist in all objects`);
        return arr;
      }
    }

    return arr.slice().sort((a, b) => {
      const valA = key
        ? String(a[key] ?? '')
            .trim()
            .toLowerCase()
        : String(a).trim().toLowerCase();
      const valB = key
        ? String(b[key] ?? '')
            .trim()
            .toLowerCase()
        : String(b).trim().toLowerCase();

      const startsWithNumberA = /^\d/.test(valA);
      const startsWithNumberB = /^\d/.test(valB);

      // ✅ Alphabetic values come first
      if (startsWithNumberA && !startsWithNumberB) return 1;
      if (!startsWithNumberA && startsWithNumberB) return -1;

      // ✅ Otherwise, normal alphabetical sort
      return valA.localeCompare(valB);
    });
  } catch (err) {
    console.error('❌ Sorting failed:', err.message);
    return arr;
  }
}
