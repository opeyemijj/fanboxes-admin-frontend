export function generateMysteryBoxOdds(items, spinPrice, boxTargetRTP = 80) {
  // --------------------------------------------------
  // 1. VALIDATION
  // --------------------------------------------------
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
  const itemCount = items.length;

  // --------------------------------------------------
  // 2. PREPARE ITEMS WITH METADATA
  // --------------------------------------------------
  const enriched = items.map((item, idx) => ({
    ...item,
    originalIndex: idx,
    multiplier: item.value / spinPrice
  }));

  const sortedDesc = [...enriched].sort((a, b) => b.value - a.value);
  const sortedAsc = [...enriched].sort((a, b) => a.value - b.value);

  // --------------------------------------------------
  // 3. IDENTIFY JACKPOT ITEMS (top 2 values)
  // --------------------------------------------------
  const jackpotItems = sortedDesc.slice(0, 2);
  const jackpotProbsPercent = [0.001, 0.025];
  const sortedJackpot = [...jackpotItems].sort((a, b) => b.value - a.value);
  const jackpotAssignments = sortedJackpot.map((item, idx) => ({
    item,
    probPercent: jackpotProbsPercent[idx] || 0.001
  }));

  // --------------------------------------------------
  // 4. COLLECT FIXED PROBABILITIES (jackpot + manual overrides)
  // --------------------------------------------------
  const fixedMap = new Map(); // originalIndex -> decimal probability

  // Jackpot items (always fixed, ignore manualProb)
  jackpotAssignments.forEach(({ item, probPercent }) => {
    fixedMap.set(item.originalIndex, probPercent / 100);
  });

  // Manual overrides for non‑jackpot items
  for (const item of enriched) {
    const isJackpot = jackpotItems.some((j) => j.originalIndex === item.originalIndex);
    if (!isJackpot && typeof item.manualProb === 'number' && !isNaN(item.manualProb)) {
      let manualPercent = item.manualProb;
      manualPercent = Math.min(100, Math.max(0, manualPercent));
      fixedMap.set(item.originalIndex, manualPercent / 100);
    }
  }

  // Compute total fixed probability and fixed EV contribution
  let totalFixedProb = 0;
  let totalFixedEV = 0;
  for (const [idx, probDec] of fixedMap.entries()) {
    const item = enriched.find((i) => i.originalIndex === idx);
    totalFixedProb += probDec;
    totalFixedEV += probDec * item.value;
  }

  // Validate fixed probabilities
  if (totalFixedProb > 1 + 1e-9) {
    throw new Error(`Total manual + jackpot probabilities exceed 100% (${(totalFixedProb * 100).toFixed(2)}%)`);
  }
  if (totalFixedEV > targetEV + 1e-9) {
    throw new Error(`Fixed items already exceed target EV (${totalFixedEV.toFixed(2)} > ${targetEV.toFixed(2)})`);
  }

  // Remaining probability and EV target
  const remainingProb = Math.max(0, 1 - totalFixedProb);
  const remainingEV = Math.max(0, targetEV - totalFixedEV);

  // --------------------------------------------------
  // 5. PREPARE REMAINING ITEMS (non‑fixed)
  // --------------------------------------------------
  const remainingItems = enriched.filter((item) => !fixedMap.has(item.originalIndex));
  const remainingCount = remainingItems.length;

  let finalProbs = new Array(itemCount).fill(0);

  // If no remaining items, just use fixed probabilities (must sum to 1)
  if (remainingCount === 0) {
    if (Math.abs(totalFixedProb - 1) > 1e-6) {
      throw new Error('Fixed probabilities do not sum to 100% and no items left to adjust');
    }
    for (const [idx, prob] of fixedMap.entries()) {
      finalProbs[idx] = prob;
    }
  } else {
    // --------------------------------------------------
    // 6. TWO‑GROUP SOLVER ON REMAINING ITEMS
    // --------------------------------------------------
    const remainingSortedDesc = [...remainingItems].sort((a, b) => b.value - a.value);
    const remainingSortedAsc = [...remainingItems].sort((a, b) => a.value - b.value);

    // Bottom cluster: up to 4 lowest‑value remaining items
    const bottomRemaining = remainingSortedAsc.slice(0, Math.min(4, remainingCount));
    const otherRemaining = remainingItems.filter(
      (item) => !bottomRemaining.some((b) => b.originalIndex === item.originalIndex)
    );

    const bottomCount = bottomRemaining.length;
    const avgBottomValue = bottomRemaining.reduce((sum, i) => sum + i.value, 0) / bottomCount;

    // Raw weights for "other" items (inverse value)
    const otherWithWeight = otherRemaining.map((item) => ({
      item,
      rawWeight: 1 / item.value
    }));

    const A = otherWithWeight.reduce((sum, w) => sum + w.rawWeight, 0);
    const B = otherWithWeight.reduce((sum, w) => sum + w.rawWeight * w.item.value, 0);

    const C = remainingProb;
    const D = remainingEV;
    const denom = B - A * avgBottomValue;

    let s, totalBottomProbDecimal;

    if (Math.abs(denom) < 1e-9 || bottomCount === 0) {
      // Degenerate case – use pure inverse weighting (no bottom cluster)
      const totalRawWeight = otherWithWeight.reduce((s, w) => s + w.rawWeight, 0);
      s = remainingProb / totalRawWeight;
      totalBottomProbDecimal = 0;
      otherWithWeight.forEach((w) => {
        w.finalProbDecimal = s * w.rawWeight;
      });
      bottomRemaining.forEach((b) => {
        b.finalProbDecimal = 0;
      });
      // Note: EV may not be exact; log warning to console
      console.warn('Manual override solver degenerated – EV may deviate from target');
    } else {
      s = (D - C * avgBottomValue) / denom;
      s = Math.max(0, Math.min(s, C / A));
      totalBottomProbDecimal = C - s * A;
      if (totalBottomProbDecimal < 0) {
        s = C / A;
        totalBottomProbDecimal = 0;
        console.warn('Manual override: bottom probability negative, set to zero');
      }
      otherWithWeight.forEach((w) => {
        w.finalProbDecimal = s * w.rawWeight;
      });
      const bottomEach = totalBottomProbDecimal / bottomCount;
      bottomRemaining.forEach((b) => {
        b.finalProbDecimal = bottomEach;
      });
    }

    // Clamp to zero
    otherWithWeight.forEach((w) => {
      w.finalProbDecimal = Math.max(0, w.finalProbDecimal);
    });
    bottomRemaining.forEach((b) => {
      b.finalProbDecimal = Math.max(0, b.finalProbDecimal);
    });

    // Build final probability array
    // Fixed
    for (const [idx, prob] of fixedMap.entries()) {
      finalProbs[idx] = prob;
    }
    // Other remaining
    otherWithWeight.forEach(({ item, finalProbDecimal }) => {
      finalProbs[item.originalIndex] = finalProbDecimal;
    });
    // Bottom remaining
    bottomRemaining.forEach((item) => {
      finalProbs[item.originalIndex] = item.finalProbDecimal;
    });
  }

  // --------------------------------------------------
  // 7. NORMALIZE (safety)
  // --------------------------------------------------
  let totalProb = finalProbs.reduce((s, p) => s + p, 0);
  if (Math.abs(totalProb - 1) > 1e-7) {
    for (let i = 0; i < finalProbs.length; i++) {
      finalProbs[i] /= totalProb;
    }
  }
  totalProb = finalProbs.reduce((s, p) => s + p, 0);

  // --------------------------------------------------
  // 8. BUILD OUTPUT ARRAY
  // --------------------------------------------------
  const finalOdds = items.map((item, idx) => ({
    ...item,
    odd: Number(finalProbs[idx].toFixed(6))
  }));

  // --------------------------------------------------
  // 9. COMPUTE METRICS (unchanged from base version)
  // --------------------------------------------------
  const actualEV = finalOdds.reduce((sum, item) => sum + item.odd * item.value, 0);
  const statedRTP = (actualEV / spinPrice) * 100;

  const sortedByValueDesc = [...finalOdds].sort((a, b) => b.value - a.value);
  let cumProb = 0;
  let medianItem = sortedByValueDesc[sortedByValueDesc.length - 1];
  for (const item of sortedByValueDesc) {
    cumProb += item.odd;
    if (cumProb >= 0.5) {
      medianItem = item;
      break;
    }
  }
  const practicalRTP = (medianItem.value / spinPrice) * 100;
  const profitPerSpin = spinPrice - actualEV;

  const winsGeSpinPrice = finalOdds.filter((item) => item.value >= spinPrice);
  const winsGeSpinPricePercent = winsGeSpinPrice.reduce((sum, item) => sum + item.odd, 0) * 100;

  // Bottom cluster (original lowest 4 values overall)
  const bottomOriginal = sortedAsc.slice(0, Math.min(4, itemCount));
  const bottomOriginalValues = bottomOriginal.map((b) => b.value);
  const bottomClusterProb =
    finalOdds.filter((item) => bottomOriginalValues.includes(item.value)).reduce((sum, item) => sum + item.odd, 0) *
    100;

  const statusLine = `Stated RTP: ${statedRTP.toFixed(1)}% | Practical RTP: ${practicalRTP.toFixed(1)}% | Profit: $${profitPerSpin.toFixed(2)}/spin (spin $${spinPrice} − weighted avg $${actualEV.toFixed(2)}) | Wins ≥ spin price: ${winsGeSpinPricePercent.toFixed(1)}% | Bottom cluster: ${bottomClusterProb.toFixed(1)}% | Prob: ${(totalProb * 100).toFixed(3)}%`;

  const medianDescription = `Median outcome: $${medianItem.value.toFixed(2)} (${getTier(medianItem.value, spinPrice)}) on a $${spinPrice.toFixed(2)} spin. True margin per spin: $${profitPerSpin.toFixed(2)}. At ${boxTargetRTP}% stated RTP the platform keeps ${(100 - boxTargetRTP).toFixed(1)}% of revenue on average. Rare high-value wins reduce long-run average to $${profitPerSpin.toFixed(2)}/spin (stated RTP margin).`;

  const volumes = [100, 500, 1000, 5000, 10000, 50000];
  const projections = volumes.map((vol) => {
    const dailyProfit = profitPerSpin * vol;
    const monthlyProfit = dailyProfit * 30;
    return {
      spinsPerDay: vol,
      dailyProfit: Number(dailyProfit.toFixed(2)),
      monthlyProfit: Number(monthlyProfit.toFixed(2))
    };
  });

  const additionalData = {
    statedRTP,
    practicalRTP,
    profitPerSpin,
    medianItem: {
      name: medianItem.name,
      value: medianItem.value,
      tier: getTier(medianItem.value, spinPrice)
    },
    totalProbability: totalProb,
    targetRTP: boxTargetRTP,
    spinPrice,
    jackpotCount: jackpotItems.length,
    bottomCount: bottomOriginal.length,
    otherCount: itemCount - jackpotItems.length - bottomOriginal.length,
    winsGeSpinPricePercent,
    bottomClusterPercent: bottomClusterProb,
    statusLine,
    medianDescription,
    projections
  };

  Object.defineProperty(finalOdds, 'additionalData', {
    value: additionalData,
    enumerable: false,
    writable: false
  });

  console.log('Strategy used: HypeDrop Model with manual overrides');
  console.log(`Final EV: ${actualEV.toFixed(4)} | Target EV: ${targetEV.toFixed(4)}`);

  // --------------------------------------------------
  // 10. DISPLAY MODAL SUMMARY (only in browser)
  // --------------------------------------------------
  if (typeof window !== 'undefined') {
    showSummaryModal(additionalData);
  }

  return finalOdds;

  // --------------------------------------------------
  // Helper functions
  // --------------------------------------------------
  function getTier(value, spinPrice) {
    const mult = value / spinPrice;
    if (mult >= 70) return 'JACKPOT';
    if (mult >= 3) return 'HIGH';
    if (mult >= 0.95) return 'MID';
    if (mult >= 0.45) return 'LOW';
    return 'BOTTOM';
  }

  function showSummaryModal(data) {
    // (same modal as in the base version – omitted for brevity)
    // Include the exact modal code from the user's provided function.
    // It is identical to the one already shown.
    // For completeness, I will paste it again here, but you can keep it as is.
    const existingModal = document.getElementById('mystery-box-summary-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'mystery-box-summary-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: #0a0a0f;
      border: 1px solid #2a2a3a;
      border-radius: 16px;
      max-width: 700px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      color: #e8e8f0;
      box-shadow: 0 20px 35px rgba(0,0,0,0.5);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      float: right;
      background: none;
      border: none;
      color: #6b6b80;
      font-size: 20px;
      cursor: pointer;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
    `;
    closeBtn.onmouseover = () => (closeBtn.style.color = '#ff4560');
    closeBtn.onmouseout = () => (closeBtn.style.color = '#6b6b80');
    closeBtn.onclick = () => modal.remove();

    const title = document.createElement('h2');
    title.textContent = '🎁 Mystery Box Odds Summary';
    title.style.cssText = `
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #00e5a0;
    `;
    title.appendChild(closeBtn);

    const statusBox = document.createElement('div');
    statusBox.style.cssText = `
      background: rgba(0,229,160,0.06);
      border: 1px solid rgba(0,229,160,0.2);
      border-radius: 8px;
      padding: 12px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 20px;
      color: #00e5a0;
    `;
    statusBox.textContent = data.statusLine;

    const metricsGrid = document.createElement('div');
    metricsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    `;

    const metrics = [
      {
        label: 'Stated RTP',
        value: `${data.statedRTP.toFixed(1)}%`,
        hint: 'Theoretical (long-tailed)',
        color: '#00e5a0'
      },
      {
        label: 'Practical RTP',
        value: `${data.practicalRTP.toFixed(1)}%`,
        hint: 'Median outcome ÷ spin price',
        color: '#ffb800'
      },
      {
        label: 'Total probability',
        value: `${(data.totalProbability * 100).toFixed(3)}%`,
        hint: 'Always exactly 100%',
        color: '#e8e8f0'
      },
      {
        label: 'Profit / spin',
        value: `$${data.profitPerSpin.toFixed(2)}`,
        hint: `Spin $${data.spinPrice} − weighted avg`,
        color: '#00e5a0'
      }
    ];

    metrics.forEach((m) => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: #111118;
        border: 1px solid #2a2a3a;
        border-radius: 8px;
        padding: 12px 14px;
      `;
      card.innerHTML = `
        <div style="font-family: monospace; font-size: 9px; color: #6b6b80; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">${m.label}</div>
        <div style="font-family: monospace; font-size: 20px; font-weight: 700; color: ${m.color}">${m.value}</div>
        <div style="font-family: monospace; font-size: 10px; color: #6b6b80; margin-top: 4px;">${m.hint}</div>
      `;
      metricsGrid.appendChild(card);
    });

    const medianDesc = document.createElement('div');
    medianDesc.style.cssText = `
      background: #111118;
      border: 1px solid #2a2a3a;
      border-radius: 8px;
      padding: 14px 16px;
      font-family: monospace;
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 20px;
      color: #ffb800;
    `;
    medianDesc.textContent = data.medianDescription;

    const projTitle = document.createElement('div');
    projTitle.style.cssText = `
      font-family: monospace;
      font-size: 10px;
      color: #6b6b80;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
    `;
    projTitle.textContent = 'PROFIT PER 1,000 SPINS — spin price minus weighted average item cost';

    const projGrid = document.createElement('div');
    projGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    `;

    data.projections.forEach((p) => {
      const card = document.createElement('div');
      card.style.cssText = `
        text-align: center;
        background: #111118;
        border-radius: 6px;
        padding: 10px 4px;
      `;
      card.innerHTML = `
        <div style="font-family: monospace; font-size: 10px; color: #6b6b80; margin-bottom: 4px;">${p.spinsPerDay.toLocaleString()}/day</div>
        <div style="font-family: monospace; font-size: 16px; font-weight: 700; color: #00e5a0;">$${p.dailyProfit.toLocaleString()}</div>
        <div style="font-family: monospace; font-size: 10px; color: #6b6b80; margin-top: 2px;">$${p.monthlyProfit.toLocaleString()}/mo</div>
      `;
      projGrid.appendChild(card);
    });

    const note = document.createElement('div');
    note.style.cssText = `
      font-family: monospace;
      font-size: 10px;
      color: #6b6b80;
      line-height: 1.7;
      border-top: 1px solid #2a2a3a;
      padding-top: 14px;
      margin-top: 8px;
    `;
    note.innerHTML = `<span style="color:#ffb800;">★ Highlighted row</span> = median outcome (practical RTP) — what most customers statistically receive.<br>
    <span style="color:#00e5a0;">Green probabilities</span> = bottom cluster (${data.bottomCount} items, equal weight).<br>
    Jackpot odds fixed at 0.001% and 0.025% — exact HypeDrop values.<br>
    Profit projections use practical RTP (median item) not stated RTP. Stated RTP accounts for rare expensive wins which reduce long-run average.`;

    modalContent.appendChild(title);
    modalContent.appendChild(statusBox);
    modalContent.appendChild(metricsGrid);
    modalContent.appendChild(medianDesc);
    modalContent.appendChild(projTitle);
    modalContent.appendChild(projGrid);
    modalContent.appendChild(note);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
}

export function generateMysteryBoxOddsOLD(items, spinPrice, boxTargetRTP = 80) {
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
