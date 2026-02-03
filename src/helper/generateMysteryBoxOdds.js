export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP) {
  console.group('[MysteryBoxOdds] generateMysteryBoxOdds');

  if (!Array.isArray(items) || items.length === 0) {
    console.error('No items provided');
    console.groupEnd();
    throw new Error('Mystery box must contain at least one item.');
  }

  if (typeof spinPrice !== 'number' || spinPrice <= 0) {
    console.error('Invalid spin price:', spinPrice);
    console.groupEnd();
    throw new Error('spinPrice must be a positive number.');
  }

  const targetRTP = boxTargetRTP != null ? boxTargetRTP / 100 : 0.8;
  const targetEV = spinPrice * targetRTP;

  console.log('Target RTP:', targetRTP, 'Target EV:', targetEV);

  // -----------------------------
  // Split manual vs auto items
  // -----------------------------
  const manual = items.filter((i) => typeof i.manualProb === 'number' && i.manualProb > 0);
  const auto = items.filter((i) => !manual.includes(i));

  // -----------------------------
  // Manual EV
  // -----------------------------
  let manualEV = 0;
  let manualProbSum = 0;

  manual.forEach((i) => {
    manualEV += i.value * i.manualProb;
    manualProbSum += i.manualProb;
  });

  if (manualProbSum >= 1) {
    console.error('Manual probabilities sum >= 1', manualProbSum);
    console.groupEnd();
    throw new Error('Manual probabilities must sum to less than 1.');
  }

  if (manualEV > targetEV) {
    console.error('Manual EV exceeds target EV', { manualEV, targetEV });
    console.groupEnd();
    throw new Error(
      `Manual items exceed target EV.\nManual EV: $${manualEV.toFixed(2)}\nTarget EV: $${targetEV.toFixed(2)}`
    );
  }

  const remainingEV = targetEV - manualEV;
  const remainingProb = 1 - manualProbSum;

  console.log('Manual EV:', manualEV, 'Remaining EV:', remainingEV, 'Remaining Prob:', remainingProb);

  // -----------------------------
  // Auto items: inverse-value rarity weights
  // -----------------------------
  const weights = auto.map((i) => {
    if (i.value <= 0) {
      throw new Error(`Invalid value for item ${i.name}`);
    }
    return 1 / i.value;
  });

  const weightSum = weights.reduce((a, b) => a + b, 0);

  // Base probabilities (shape only)
  auto.forEach((i, idx) => {
    i._baseProb = weights[idx] / weightSum;
  });

  // EV at base distribution
  const baseAutoEV = auto.reduce((sum, i) => sum + i._baseProb * i.value, 0);

  if (baseAutoEV <= 0) {
    console.error('Base auto EV invalid');
    console.groupEnd();
    throw new Error('Invalid auto EV');
  }

  // -----------------------------
  // Scale auto probs to match remaining EV
  // -----------------------------
  const evScale = remainingEV / baseAutoEV;

  auto.forEach((i) => {
    i._scaledProb = i._baseProb * evScale;
  });

  // -----------------------------
  // Normalize auto probs to remaining probability mass
  // -----------------------------
  const scaledProbSum = auto.reduce((sum, i) => sum + i._scaledProb, 0);

  if (scaledProbSum <= 0) {
    console.error('Scaled probability sum invalid');
    console.groupEnd();
    throw new Error('Invalid probability scaling');
  }

  auto.forEach((i) => {
    i._calcProb = (i._scaledProb / scaledProbSum) * remainingProb;
  });

  // -----------------------------
  // Merge manual + auto
  // -----------------------------
  const allItems = [...manual, ...auto];

  const returnData = allItems.map((i) => {
    const odd = i.manualProb ?? i._calcProb ?? 0;
    const evContrib = odd * i.value;

    console.log('Final item', i.name, 'odd:', odd, 'evContrib:', evContrib);

    return { ...i, odd, evContrib };
  });

  // -----------------------------
  // Final checks
  // -----------------------------
  const totalOddCheck = returnData.reduce((s, i) => s + i.odd, 0);
  const totalEVCheck = returnData.reduce((s, i) => s + i.evContrib, 0);

  console.log('Total odd sum:', totalOddCheck);
  console.log('Total EV:', totalEVCheck, 'Target EV:', targetEV);

  console.groupEnd();

  return returnData;
}
