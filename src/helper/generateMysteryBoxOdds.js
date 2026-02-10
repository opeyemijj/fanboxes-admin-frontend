export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP = 80) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No items provided');
  }
  if (spinPrice <= 0) {
    throw new Error('spinPrice must be positive');
  }

  items.forEach((i) => {
    if (!i.value || i.value <= 0) {
      throw new Error(`Invalid value for item ${i.name}`);
    }
  });

  const targetEV = spinPrice * (boxTargetRTP / 100);
  const values = items.map((i) => i.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const varianceRatio = maxValue / minValue;

  let enforceEV = true;
  let strategy;
  let strategyReason;

  // -----------------------------------
  // 🚨 EV FEASIBILITY CHECK
  // -----------------------------------
  if (targetEV < minValue || targetEV > maxValue) {
    const proceed =
      typeof window !== 'undefined'
        ? window.confirm(
            `⚠️ Target EV is mathematically impossible.\n\n` +
              `Target EV: ${targetEV.toFixed(2)}\n` +
              `Item range: ${minValue} – ${maxValue}\n\n` +
              `Would you like to continue using value-based odds instead?`
          )
        : false;

    if (!proceed) {
      throw new Error('Target EV is mathematically impossible');
    }

    enforceEV = false;
    strategy = 'Pure Value-Based Distribution';
    strategyReason =
      'Target EV falls outside the minimum and maximum item values, making exact RTP enforcement impossible.';
  }

  // -----------------------------------
  // 🧠 STRATEGY SELECTION
  // -----------------------------------
  if (enforceEV) {
    if (varianceRatio > 100) {
      strategy = 'Log-Scaled Weighting (Extreme Variance)';
      strategyReason = 'Item values have extreme variance, which would destabilize inverse or exact EV methods.';
    } else if (varianceRatio > 20) {
      strategy = 'Soft Inverse Weighting';
      strategyReason = 'Item values vary significantly, but not enough to require logarithmic scaling.';
    } else if (isClustered(values)) {
      strategy = 'Rank-Based Distribution';
      strategyReason =
        'Item values are tightly clustered, making rank-based weighting more stable than value-based math.';
    } else {
      strategy = 'Exact EV Solver (Mass Transfer)';
      strategyReason = 'Target EV is achievable and item values are well-distributed for precise RTP enforcement.';
    }
  }

  // -----------------------------------
  // 📣 USER CONFIRMATION
  // -----------------------------------
  const proceed =
    typeof window !== 'undefined'
      ? window.confirm(
          `🎰 Mystery Box Odds Generation\n\n` +
            `Spin Price: ${spinPrice}\n` +
            `Target RTP: ${boxTargetRTP}%\n` +
            `Target EV: ${targetEV.toFixed(2)}\n\n` +
            `Chosen Strategy:\n${strategy}\n\n` +
            `Reason:\n${strategyReason}\n\n` +
            `Do you want to continue?`
        )
      : true;

  if (!proceed) {
    throw new Error('Odds generation cancelled by user');
  }

  // -----------------------------------
  // ⚙️ EXECUTE STRATEGY
  // -----------------------------------
  let probs;

  switch (strategy) {
    case 'Exact EV Solver (Mass Transfer)':
      probs = exactEV(items, targetEV);
      break;
    case 'Soft Inverse Weighting':
      probs = softInverse(items);
      break;
    case 'Log-Scaled Weighting (Extreme Variance)':
      probs = logScaled(items);
      break;
    case 'Rank-Based Distribution':
      probs = rankBased(items);
      break;
    case 'Pure Value-Based Distribution':
    default:
      probs = valueBased(items);
  }

  normalize(probs);

  // -----------------------------------
  // 📦 FINAL OUTPUT
  // -----------------------------------
  const finalOdds = probs.map((p, i) => ({
    ...items[i],
    odd: Number(p.toFixed(6))
  }));

  const totalEV = finalOdds.reduce((s, i) => s + i.odd * i.value, 0);
  console.log('Final EV:', totalEV.toFixed(4), 'Target EV:', targetEV.toFixed(4));
  console.log('Strategy used:', strategy);

  return finalOdds;

  // =====================================================
  // ================= STRATEGIES ========================
  // =====================================================

  function exactEV(items, targetEV) {
    let odds = softInverse(items);
    let ev = calcEV(odds);
    let guard = 0;

    while (Math.abs(ev - targetEV) > 1e-6) {
      guard++;
      if (guard > 10000) break;

      const low = indexOfMin(items);
      const high = indexOfMax(items);
      const delta = Math.min(0.0001, odds[low]);

      if (ev < targetEV) {
        odds[low] -= delta;
        odds[high] += delta;
      } else {
        odds[high] -= delta;
        odds[low] += delta;
      }

      normalize(odds);
      ev = calcEV(odds);
    }

    return odds;
  }

  function softInverse(items) {
    const EXP = 0.75;
    const w = items.map((i) => Math.pow(1 / i.value, EXP));
    return normalize(w);
  }

  function logScaled(items) {
    const w = items.map((i) => 1 / Math.log(i.value + 2));
    return normalize(w);
  }

  function rankBased(items) {
    const sorted = [...items].sort((a, b) => a.value - b.value);
    const w = new Array(items.length);

    sorted.forEach((item, rank) => {
      const idx = items.indexOf(item);
      w[idx] = items.length - rank;
    });

    return normalize(w);
  }

  function valueBased(items) {
    const w = items.map((i) => 1 / i.value);
    return normalize(w);
  }

  // =====================================================
  // ================= HELPERS ===========================
  // =====================================================

  function normalize(arr) {
    const sum = arr.reduce((s, x) => s + x, 0);
    return arr.map((x) => x / sum);
  }

  function calcEV(arr) {
    return arr.reduce((s, p, i) => s + p * items[i].value, 0);
  }

  function indexOfMin(items) {
    return items.reduce((m, x, i, a) => (x.value < a[m].value ? i : m), 0);
  }

  function indexOfMax(items) {
    return items.reduce((m, x, i, a) => (x.value > a[m].value ? i : m), 0);
  }

  function isClustered(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean < 0.3;
  }
}
