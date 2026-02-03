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

  let manualEV = 0;
  manual.forEach((i) => (manualEV += i.value * i.manualProb));
  const remainingEV = targetEV - manualEV;

  console.log('Manual EV:', manualEV, 'Remaining EV for auto items:', remainingEV);

  if (manualEV > targetEV) {
    console.error('Manual EV exceeds target EV', { manualEV, targetEV });
    console.groupEnd();
    throw new Error(
      `Manual items exceed target EV.\nManual EV: $${manualEV.toFixed(2)}\nTarget EV: $${targetEV.toFixed(2)}`
    );
  }

  // -----------------------------
  // Assign auto probabilities (inverse value weighting)
  // -----------------------------
  const autoValues = auto.map((i) => i.value);
  const invSum = autoValues.reduce((sum, v) => sum + 1 / v, 0);

  auto.forEach((i) => {
    i._calcProb = (1 / i.value / invSum) * remainingEV;
    console.log('Auto pre-normalized prob for', i.name, i._calcProb);
  });

  // -----------------------------
  // Merge manual + auto, ensure total EV <= targetEV
  // -----------------------------
  const allItems = [...manual, ...auto];
  let totalEV = allItems.reduce((sum, i) => sum + (i.manualProb ?? i._calcProb ?? 0) * i.value, 0);

  // If EV > targetEV, scale all odds proportionally
  if (totalEV > targetEV) {
    const scale = targetEV / totalEV;
    allItems.forEach((i) => {
      if (i.manualProb != null) i.manualProb *= scale;
      if (i._calcProb != null) i._calcProb *= scale;
    });
    totalEV = targetEV;
  }

  // -----------------------------
  // Final normalization to ensure sum of odds = 1
  // -----------------------------
  const totalRawProb = allItems.reduce((sum, i) => sum + (i.manualProb ?? i._calcProb ?? 0), 0);
  const normalizationFactor = totalRawProb > 0 ? 1 / totalRawProb : 1;

  console.log('Normalization factor applied to ensure total odds = 1:', normalizationFactor);

  const returnData = allItems.map((i) => {
    const odd = (i.manualProb ?? i._calcProb ?? 0) * normalizationFactor;
    const evContrib = i.value * odd;
    console.log('Final item', i.name, 'odd:', odd, 'evContrib:', evContrib);
    return { ...i, odd, evContrib };
  });

  // -----------------------------
  // Final checks
  // -----------------------------
  const totalOddCheck = returnData.reduce((s, i) => s + i.odd, 0);
  const totalEVCheck = returnData.reduce((s, i) => s + i.evContrib, 0);

  console.log('Total odd sum after normalization:', totalOddCheck);
  console.log('Total EV after normalization:', totalEVCheck, 'Target EV:', targetEV);

  console.groupEnd();

  console.log('returnData', returnData);
  return returnData;
}
