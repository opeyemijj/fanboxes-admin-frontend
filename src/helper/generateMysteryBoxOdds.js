export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP) {
  const targetEV = spinPrice * (boxTargetRTP / 100);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No items provided');
  }

  if (spinPrice <= 0) {
    throw new Error('spinPrice must be positive');
  }

  // 1. Inverse-value weights
  const weights = items.map((i) => 1 / i.value);
  const weightSum = weights.reduce((a, b) => a + b, 0);

  // 2. Base probabilities
  let baseProbs = weights.map((w) => w / weightSum);

  // 3. Base EV
  const baseEV = items.reduce((sum, item, idx) => sum + baseProbs[idx] * item.value, 0);

  // 4. Scale to match target EV
  const scale = targetEV / baseEV;
  let scaledProbs = baseProbs.map((p) => p * scale);

  // 5. Normalize to sum = 1
  const probSum = scaledProbs.reduce((a, b) => a + b, 0);
  scaledProbs = scaledProbs.map((p) => p / probSum);

  // 6. Final output
  return items.map((item, idx) => ({
    ...item,
    odd: Number(scaledProbs[idx].toFixed(6))
  }));
}
