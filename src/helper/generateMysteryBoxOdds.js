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

  const STRATEGIES = [
    'AUTO',
    'Exact EV Solver (Mass Transfer)',
    'Soft Inverse Weighting',
    'Log-Scaled Weighting (Extreme Variance)',
    'Rank-Based Distribution',
    'Pure Value-Based Distribution'
  ];

  let enforceEV = true;
  let chosenStrategy = null;
  let strategyReason = '';
  let attempt = 0;
  let finalOdds = null;

  // --------------------------------------------------
  // 🚨 EV FEASIBILITY CHECK
  // --------------------------------------------------
  if (targetEV < minValue || targetEV > maxValue) {
    const proceed =
      typeof window !== 'undefined'
        ? window.confirm(
            `⚠️ Target EV is mathematically impossible.\n\n` +
              `Target EV: ${targetEV.toFixed(2)}\n` +
              `Item range: ${minValue} – ${maxValue}\n\n` +
              `Continue with value-based odds instead?`
          )
        : false;

    if (!proceed) {
      throw new Error('Target EV is mathematically impossible');
    }

    enforceEV = false;
    chosenStrategy = 'Pure Value-Based Distribution';
    strategyReason = 'Target EV lies outside achievable item value range.';
  }

  // --------------------------------------------------
  // 🧠 USER STRATEGY CHOICE
  // --------------------------------------------------
  if (typeof window !== 'undefined') {
    const choice = window.prompt(
      `Choose odds strategy:\n\n` +
        STRATEGIES.map((s, i) => `${i}: ${s}`).join('\n') +
        `\n\nEnter number (default = 0 / AUTO):`,
      '0'
    );

    const index = Number(choice);
    if (!Number.isNaN(index) && STRATEGIES[index]) {
      chosenStrategy = STRATEGIES[index];
    }
  }

  // --------------------------------------------------
  // 🔁 STRATEGY ATTEMPT LOOP (ANTI-NEGATIVE)
  // --------------------------------------------------
  while (attempt < 3 && !finalOdds) {
    attempt++;

    let strategy = chosenStrategy;
    let reason = '';

    if (strategy === 'AUTO' || !strategy) {
      if (!enforceEV) {
        strategy = 'Pure Value-Based Distribution';
        reason = 'EV enforcement disabled.';
      } else if (varianceRatio > 100) {
        strategy = 'Log-Scaled Weighting (Extreme Variance)';
        reason = 'Extreme value variance detected.';
      } else if (varianceRatio > 20) {
        strategy = 'Soft Inverse Weighting';
        reason = 'High variance, softening inverse bias.';
      } else if (isClustered(values)) {
        strategy = 'Rank-Based Distribution';
        reason = 'Values clustered tightly.';
      } else {
        strategy = 'Exact EV Solver (Mass Transfer)';
        reason = 'EV is achievable with stable values.';
      }
    }

    const proceed =
      typeof window !== 'undefined'
        ? window.confirm(
            `🎰 Odds Generation (Attempt ${attempt})\n\n` +
              `Strategy: ${strategy}\n` +
              `Reason: ${reason}\n\n` +
              `Spin Price: ${spinPrice}\n` +
              `Target RTP: ${boxTargetRTP}%\n` +
              `Target EV: ${targetEV.toFixed(2)}\n\n` +
              `Continue?`
          )
        : true;

    if (!proceed) throw new Error('Odds generation cancelled by user');

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
      default:
        probs = valueBased(items);
    }

    probs = normalize(probs);

    if (probs.some((p) => p < 0)) {
      chosenStrategy = 'AUTO';
      continue;
    }

    finalOdds = items.map((item, i) => ({
      ...item,
      odd: Number(probs[i].toFixed(6))
    }));

    strategyReason = reason;
    chosenStrategy = strategy;
  }

  // --------------------------------------------------
  // 🛑 FINAL FALLBACK
  // --------------------------------------------------
  if (!finalOdds) {
    const proceed =
      typeof window !== 'undefined'
        ? window.confirm(`⚠️ All strategies failed.\n\nFallback to equal distribution?`)
        : true;

    if (!proceed) throw new Error('Odds generation cancelled');

    finalOdds = items.map((item) => ({
      ...item,
      odd: Number((1 / items.length).toFixed(6))
    }));

    chosenStrategy = 'Fallback Equal Distribution';
    strategyReason = 'All adaptive strategies failed.';
  }

  const totalEV = finalOdds.reduce((s, i) => s + i.odd * i.value, 0);

  console.log('Strategy used:', chosenStrategy);
  console.log('Reason:', strategyReason);
  console.log('Final EV:', totalEV.toFixed(4), 'Target EV:', targetEV.toFixed(4));

  return finalOdds;

  // ===================================================
  // ================= STRATEGIES ======================
  // ===================================================
  function exactEV(items, targetEV) {
    let odds = softInverse(items);
    let ev = calcEV(odds);
    let guard = 0;

    while (Math.abs(ev - targetEV) > 1e-6 && guard < 10000) {
      guard++;
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

      odds = normalize(odds);
      ev = calcEV(odds);
    }

    return odds;
  }

  function softInverse(items) {
    const EXP = 0.75;
    return normalize(items.map((i) => Math.pow(1 / i.value, EXP)));
  }

  function logScaled(items) {
    return normalize(items.map((i) => 1 / Math.log(i.value + 2)));
  }

  function rankBased(items) {
    const sorted = [...items].sort((a, b) => a.value - b.value);
    const w = new Array(items.length);
    sorted.forEach((item, rank) => {
      w[items.indexOf(item)] = items.length - rank;
    });
    return normalize(w);
  }

  function valueBased(items) {
    return normalize(items.map((i) => 1 / i.value));
  }

  // ===================================================
  // ================= HELPERS =========================
  // ===================================================
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
