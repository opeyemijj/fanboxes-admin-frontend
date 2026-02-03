export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP = 80) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('No items provided');
  if (spinPrice <= 0) throw new Error('spinPrice must be positive');

  const targetEV = spinPrice * (boxTargetRTP / 100);

  // Validate item values
  items.forEach((i) => {
    if (!i.value || i.value <= 0) throw new Error(`Invalid value for item ${i.name}`);
  });

  // 1️⃣ Initial inverse-value weights
  let weights = items.map((i) => 1 / i.value);
  let weightSum = weights.reduce((a, b) => a + b, 0);
  let probs = weights.map((w) => w / weightSum);

  // 2️⃣ Iteratively scale and normalize until EV matches target
  let iteration = 0;
  let maxIterations = 1000;
  let tolerance = 0.01; // Allow small EV deviation

  while (iteration < maxIterations) {
    iteration++;

    // Scale probabilities to match target EV
    let currentEV = items.reduce((sum, item, idx) => sum + probs[idx] * item.value, 0);
    let scale = targetEV / currentEV;
    probs = probs.map((p) => p * scale);

    // Cap probabilities at 1
    let excess = 0;
    probs = probs.map((p) => {
      if (p > 1) {
        excess += p - 1;
        return 1;
      }
      return p;
    });

    // Redistribute excess proportionally among items under 1
    let underCapIndices = probs.map((p, i) => (p < 1 ? i : -1)).filter((i) => i >= 0);
    if (underCapIndices.length > 0 && excess > 0) {
      let totalUnder = underCapIndices.reduce((sum, i) => sum + probs[i], 0);
      underCapIndices.forEach((i) => {
        probs[i] += (probs[i] / totalUnder) * excess;
      });
    }

    // Normalize total probability = 1
    let totalProb = probs.reduce((a, b) => a + b, 0);
    if (Math.abs(totalProb - 1) > 0.000001) {
      // Adjust smallest-value item to fix sum = 1
      let minIndex = items.reduce((minI, item, idx) => (items[idx].value < items[minI].value ? idx : minI), 0);
      probs[minIndex] += 1 - totalProb;
    }

    // Check if EV is within tolerance
    currentEV = items.reduce((sum, item, idx) => sum + probs[idx] * item.value, 0);
    if (Math.abs(currentEV - targetEV) <= tolerance) break;
  }

  // Final odds
  const finalOdds = items.map((item, idx) => ({
    ...item,
    odd: Number(probs[idx].toFixed(6))
  }));

  // ✅ Verification
  const totalOddCheck = finalOdds.reduce((s, i) => s + i.odd, 0);
  const totalEVCheck = finalOdds.reduce((s, i) => s + i.odd * i.value, 0);
  console.log('Total odd sum:', totalOddCheck.toFixed(6));
  console.log('Total EV:', totalEVCheck.toFixed(2), 'Target EV:', targetEV);

  return finalOdds;
}
