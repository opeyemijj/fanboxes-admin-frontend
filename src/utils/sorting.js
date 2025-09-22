export function SortArrayAlphabetically(arr, key) {
  if (!Array.isArray(arr)) {
    console.error('❌ Error: First argument must be an array');
    return arr;
  }

  try {
    if (key) {
      // check if key exists in objects
      const keyExists = arr.every((item) => item && typeof item === 'object' && key in item);
      if (!keyExists) {
        console.error(`❌ Error: Key "${key}" does not exist in all objects`);
        return arr;
      }
    }

    return arr.slice().sort((a, b) => {
      const valA = key ? String(a[key] ?? '').toLowerCase() : String(a).toLowerCase();
      const valB = key ? String(b[key] ?? '').toLowerCase() : String(b).toLowerCase();
      return valA.localeCompare(valB);
    });
  } catch (err) {
    console.error('❌ Sorting failed:', err.message);
    return arr;
  }
}
