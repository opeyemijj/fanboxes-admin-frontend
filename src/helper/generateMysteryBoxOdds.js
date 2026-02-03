export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP = 80) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No items provided');
  }
  if (spinPrice <= 0) throw new Error('spinPrice must be positive');

  const targetEV = spinPrice * (boxTargetRTP / 100);

  // Sort items by value (descending)
  const sortedItems = [...items].sort((a, b) => b.value - a.value);
  const n = sortedItems.length;

  // Step 1: Create base probabilities that are inversely proportional to value
  const baseProbs = sortedItems.map((item) => {
    // Higher value items get exponentially lower probability
    const maxValue = sortedItems[0].value;
    const minValue = sortedItems[n - 1].value;
    const normalizedValue = (item.value - minValue) / (maxValue - minValue || 1);

    // Probability = 1 / (value^exponent)
    // Adjust exponent to control how steep the decrease is
    const exponent = 1.5;
    return 1 / Math.pow(item.value + 1, exponent);
  });

  // Normalize base probabilities
  const totalBaseProb = baseProbs.reduce((sum, p) => sum + p, 0);
  let probabilities = baseProbs.map((p) => p / totalBaseProb);

  // Step 2: Adjust to meet target EV
  // We'll use the principle that adjusting probabilities while maintaining
  // their relative proportions can help achieve the target EV

  const maxIterations = 100;
  let currentEV = probabilities.reduce((sum, p, idx) => sum + p * sortedItems[idx].value, 0);

  for (let iter = 0; iter < maxIterations; iter++) {
    if (Math.abs(currentEV - targetEV) < 0.001) break;

    // Calculate adjustment factor
    const adjustment = targetEV / currentEV;

    // Adjust probabilities while maintaining their relative ratios
    // Higher value items get larger adjustments when we need to reduce EV
    probabilities = probabilities.map((p, idx) => {
      const itemValue = sortedItems[idx].value;
      const maxValue = sortedItems[0].value;

      // Weight adjustment by value ratio
      const valueRatio = itemValue / maxValue;

      if (adjustment < 1) {
        // Need to reduce EV: reduce probability more for high-value items
        return p * (1 - (1 - adjustment) * valueRatio * 0.5);
      } else {
        // Need to increase EV: increase probability more for low-value items
        return p * (1 + (adjustment - 1) * (1 - valueRatio) * 0.5);
      }
    });

    // Ensure positive probabilities and renormalize
    probabilities = probabilities.map((p) => Math.max(0.000001, p));
    const totalProb = probabilities.reduce((sum, p) => sum + p, 0);
    probabilities = probabilities.map((p) => p / totalProb);

    // Recalculate EV
    currentEV = probabilities.reduce((sum, p, idx) => sum + p * sortedItems[idx].value, 0);
  }

  // Step 3: Final normalization and rounding
  const finalTotal = probabilities.reduce((sum, p) => sum + p, 0);
  probabilities = probabilities.map((p) => Number((p / finalTotal).toFixed(8)));

  // Create result in original order
  const resultMap = new Map();
  sortedItems.forEach((item, idx) => {
    resultMap.set(item._id, {
      ...item,
      odd: probabilities[idx]
    });
  });

  const result = items.map((item) => resultMap.get(item._id));

  return result;
}
