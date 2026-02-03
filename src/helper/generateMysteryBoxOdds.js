export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP = 80) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No items provided');
  }
  if (spinPrice <= 0) throw new Error('spinPrice must be positive');

  const targetEV = spinPrice * (boxTargetRTP / 100);

  // 1️⃣ Compute inverse-value weights
  const weights = items.map((i) => {
    if (!i.value || i.value <= 0) throw new Error(`Invalid value for item ${i.name}`);
    return 1 / i.value;
  });
  const weightSum = weights.reduce((a, b) => a + b, 0);

  // 2️⃣ Base probabilities
  let baseProbs = weights.map((w) => w / weightSum);

  // 3️⃣ Base EV
  const baseEV = items.reduce((sum, item, idx) => sum + baseProbs[idx] * item.value, 0);
  if (baseEV <= 0) throw new Error('Base EV invalid');

  // 4️⃣ Scale probabilities to hit target EV
  let scaledProbs = baseProbs.map((p) => p * (targetEV / baseEV));

  // 5️⃣ Cap probability to 1 and redistribute excess
  const cappedProbs = scaledProbs.map((p) => Math.min(p, 1));
  let excess = scaledProbs.reduce((sum, p) => sum + Math.max(0, p - 1), 0);

  // Redistribute excess proportionally among items under 1 probability
  const underCapIndices = cappedProbs.map((p, i) => (p < 1 ? i : -1)).filter((i) => i >= 0);
  if (underCapIndices.length > 0 && excess > 0) {
    const totalUnder = underCapIndices.reduce((sum, i) => sum + cappedProbs[i], 0);
    underCapIndices.forEach((i) => {
      cappedProbs[i] += (cappedProbs[i] / totalUnder) * excess;
    });
  }

  // 6️⃣ Normalize total probability = 1
  const totalProb = cappedProbs.reduce((a, b) => a + b, 0);
  let minIndex = 0;
  for (let i = 1; i < items.length; i++) {
    if (items[i].value < items[minIndex].value) minIndex = i;
  }
  cappedProbs[minIndex] += 1 - totalProb;

  // 7️⃣ Final odds
  const finalOdds = items.map((item, idx) => ({
    ...item,
    odd: Number(cappedProbs[idx].toFixed(6))
  }));

  // ✅ Optional: debug check
  const totalOddCheck = finalOdds.reduce((s, i) => s + i.odd, 0);
  const totalEVCheck = finalOdds.reduce((s, i) => s + i.odd * i.value, 0);
  console.log('Total odd sum:', totalOddCheck);
  console.log('Total EV:', totalEVCheck, 'Target EV:', targetEV);

  return finalOdds;
}
