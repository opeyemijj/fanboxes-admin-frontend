export function generateMysteryBoxOdds(
  items,
  spinPrice,
  targetRTP // percent (e.g. 80)
) {
  // -----------------------------
  // Basic validation
  // -----------------------------
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items list must be a non-empty array.');
  }

  if (spinPrice <= 0) {
    throw new Error('Spin price must be greater than 0.');
  }

  if (targetRTP <= 0 || targetRTP > 100) {
    throw new Error('Target RTP must be between 0 and 100.');
  }

  const targetEV = spinPrice * (targetRTP / 100);

  // -----------------------------
  // Validate item values
  // -----------------------------
  items.forEach((it) => {
    if (it.value <= 0) {
      throw new Error(`Item "${it.name}" has invalid value (${it.value}).`);
    }
  });

  // -----------------------------
  // RULE 1: No EV-dominating items
  // -----------------------------
  const dominatingItems = items.filter((it) => it.value >= targetEV);

  if (dominatingItems.length > 0) {
    throw new Error(
      `Invalid Mystery Box configuration:\n\n` +
        `Some items are worth more than or equal to the maximum payout per spin.\n\n` +
        `Spin price: $${spinPrice}\n` +
        `RTP: ${targetRTP}% → max payout: $${targetEV}\n\n` +
        `Problematic items:\n` +
        dominatingItems.map((it) => `- ${it.name} ($${it.value})`).join('\n') +
        `\n\nFix:\n` +
        `- Increase spin price\n` +
        `- Change RTP\n` +
        `- Replace or remove expensive items`
    );
  }

  // -----------------------------
  // Manual probability validation
  // -----------------------------
  let manualProbSum = 0;
  let manualEV = 0;

  items.forEach((it) => {
    if (it.manualProb != null) {
      if (it.manualProb <= 0 || it.manualProb >= 1) {
        throw new Error(`Item "${it.name}" has invalid manual probability (${it.manualProb}).`);
      }
      manualProbSum += it.manualProb;
      manualEV += it.manualProb * it.value;
    }
  });

  if (manualProbSum >= 1) {
    throw new Error(`Total manual probability (${manualProbSum}) must be less than 1.`);
  }

  if (manualEV > targetEV) {
    throw new Error(
      `Manual probabilities already exceed target RTP.\n\n` +
        `Manual EV: $${manualEV.toFixed(2)}\n` +
        `Target EV: $${targetEV.toFixed(2)}`
    );
  }

  // -----------------------------
  // Auto items feasibility check
  // -----------------------------
  const autoItems = items.filter((it) => it.manualProb == null);
  const remainingProb = 1 - manualProbSum;
  const remainingEV = targetEV - manualEV;

  if (autoItems.length > 0) {
    const minAutoValue = Math.min(...autoItems.map((it) => it.value));

    // If this fails, at least one auto item MUST have 0 probability
    if (remainingEV <= remainingProb * minAutoValue) {
      throw new Error(
        `Invalid Mystery Box configuration:\n\n` +
          `This setup would force some items to have 0% chance.\n\n` +
          `Remaining EV: $${remainingEV.toFixed(2)}\n` +
          `Remaining probability: ${remainingProb}\n` +
          `Cheapest item: $${minAutoValue}\n\n` +
          `Fix:\n` +
          `- Increase spin price\n` +
          `- Reduce RTP\n` +
          `- Add cheaper items`
      );
    }
  }

  // -----------------------------
  // Probability calculation
  // Strategy: value-weighted inverse (fair + stable)
  // -----------------------------
  const weighted = autoItems.map((it) => ({
    ...it,
    weight: 1 / it.value
  }));

  const weightSum = weighted.reduce((s, it) => s + it.weight, 0);

  const results = items.map((it) => {
    let finalProb;

    if (it.manualProb != null) {
      finalProb = it.manualProb;
    } else {
      const w = weighted.find((wi) => wi._id === it._id);
      finalProb = (w.weight / weightSum) * remainingProb;
    }

    if (finalProb <= 0) {
      throw new Error(`Internal error: item "${it.name}" resulted in 0 probability.`);
    }

    return {
      ...it,
      finalProb,
      odd: finalProb,
      evContrib: finalProb * it.value
    };
  });

  // -----------------------------
  // Final integrity checks
  // -----------------------------
  const totalProb = results.reduce((s, it) => s + it.finalProb, 0);
  const totalEV = results.reduce((s, it) => s + it.evContrib, 0);

  const EPS = 1e-9;

  if (Math.abs(totalProb - 1) > EPS) {
    throw new Error('Probability normalization failed.');
  }

  if (Math.abs(totalEV - targetEV) > 0.01) {
    throw new Error('EV mismatch after calculation.');
  }

  // -----------------------------
  // Return result
  // -----------------------------
  return {
    items: results,
    summary: {
      spinPrice,
      targetRTP,
      totalProbability: totalProb,
      totalEV
    }
  };
}
