const http = require('http');
const CARD_TAGS = require('./card_tags');
const CARD_VP = require('./card_vp');
const CARD_DATA = require('./card_data');
const TM_BRAIN = require('./tm-brain');
TM_BRAIN.setCardData(CARD_TAGS, CARD_VP, CARD_DATA);

const {
  VP_CARDS, ENGINE_CARDS, CITY_CARDS, PROD_CARDS, DYNAMIC_VP_CARDS,
  ANIMAL_VP_CARDS, MICROBE_VP_CARDS, FLOATER_VP_CARDS,
  COLONY_TRADE, COLONY_BUILD_PRIORITY, PREF_CORPS, PREF_PRELUDES,
  STATIC_VP, PAY_ZERO,
  remainingSteps, vpLead, shouldPushGlobe, isRedsRuling,
  scoreColonyTrade, scoreCard, smartPay,
} = TM_BRAIN;

const BASE = 'http://localhost:8080';
let GAME_ID = 'ged2417324426';
let PLAYERS = [
  { name: 'Alpha', id: 'pc5cc707ee10d' },
  { name: 'Beta',  id: 'pc14f0826371b' },
  { name: 'Gamma', id: 'p1f0b9a3711c0' },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(new Error('Parse: ' + data.slice(0,100))); } });
    }).on('error', reject);
  });
}

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname, port: u.port, path: u.pathname + u.search,
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let b = '';
      res.on('data', (c) => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}


// All card sets, analytics, scoreCard, smartPay — from TM_BRAIN (tm-brain.js)

function getTitle(wf) {
  if (!wf) return '';
  if (typeof wf.title === 'string') return wf.title;
  if (wf.title?.message) return wf.title.message;
  if (wf.title && typeof wf.title === 'object') return JSON.stringify(wf.title);
  return wf.buttonLabel || '';
}

function handleInput(wf, state, depth = 0) {
  if (!wf || !wf.type) return { type: 'option' };
  if (depth > 10) return { type: 'option' };
  const t = wf.type;

  if (t === 'option') return { type: 'option' };

  if (t === 'or') {
    const opts = wf.options || [];
    if (opts.length === 0) return { type: 'option' };

    const mc = state?.thisPlayer?.megaCredits ?? 0;
    const steel = state?.thisPlayer?.steel ?? 0;
    const titanium = state?.thisPlayer?.titanium ?? 0;
    const heat = state?.thisPlayer?.heat ?? 0;
    const plants = state?.thisPlayer?.plants ?? 0;
    const energy = state?.thisPlayer?.energy ?? 0;
    const cardsInHand = state?.cardsInHand || [];

    const titles = opts.map((o, i) => ({ i, t: getTitle(o).toLowerCase(), o }));
    const skip = state?._skipActions || new Set();
    const find = (kw) => titles.findIndex(x => x.t.includes(kw) && !skip.has(x.i));
    const pick = (idx) => {
      if (depth === 0) console.log(`    → ${titles[idx]?.t?.slice(0,40) || idx} (mc=${mc} pl=${plants} ht=${heat})`);
      return { type: 'or', index: idx, response: handleInput(opts[idx], state, depth+1) };
    };

    const passIdx = (() => {
      for (let i = opts.length - 1; i >= 0; i--) {
        const t = getTitle(opts[i]).toLowerCase();
        if (t.includes('pass') || t.includes('end turn') || t.includes('do nothing') || t.includes('skip')) return i;
      }
      return -1;
    })();

    const playCardIdx = find('play project card');
    const stdProjIdx = find('standard project');
    const greeneryIdx = find('plants into greenery');
    const heatIdx = find('convert 8 heat');
    const cardActionIdx = find('action from a played');
    const milestoneIdx = find('claim a milestone');
    const awardIdx = find('fund an award');
    const colonyIdx = find('build colony');
    const tradeIdx = find('trade');
    const delegateIdx = find('send a delegate');
    const sellIdx = find('sell');
    const worldGovIdx = find('world government');

    // World Government: pick first terraform option
    if (worldGovIdx >= 0 || titles.some(x => x.t.includes('increase temperature') || x.t.includes('increase venus') || x.t.includes('place an ocean'))) {
      return pick(0);
    }

    // Final greenery placement (post-game): always place if possible (free VP!)
    const orTitle = getTitle(wf).toLowerCase();
    if (orTitle.includes('final greenery') || orTitle.includes('place any final')) {
      // Option 0 = place greenery (SelectSpace), Option 1 = don't place
      // Always place — it's free VP (no TR, but adjacency + greenery VP)
      return pick(0);
    }

    // Award selection: pick the award where we lead the most (using calculated metrics)
    if (orTitle.includes('fund an award') || orTitle.includes('fund -')) {
      const tp = state?.thisPlayer || {};
      const players = state?.players || [];
      const myColor = tp.color;
      const metrics = players.map(p => ({
        color: p.color,
        banker: p.megaCreditProduction ?? 0,
        thermalist: (p.heat ?? 0) + (p.energy ?? 0) + (p.heatProduction ?? 0),
        miner: (p.steel ?? 0) + (p.titanium ?? 0) + (p.steelProduction ?? 0) + (p.titaniumProduction ?? 0),
        scientist: p.tags?.science ?? 0,
        venuphile: p.tags?.venus ?? 0,
        landlord: p.citiesCount ?? 0,
      }));
      const my = metrics.find(m => m.color === myColor) || {};
      const others = metrics.filter(m => m.color !== myColor);

      let bestIdx = 0, bestLead = -999;
      for (let i = 0; i < titles.length; i++) {
        const aw = titles[i].t.toLowerCase().trim();
        // Map award title to metric key
        const key = aw.includes('banker') ? 'banker'
          : aw.includes('thermalist') ? 'thermalist'
          : aw.includes('miner') ? 'miner'
          : aw.includes('scientist') ? 'scientist'
          : aw.includes('venuphile') ? 'venuphile'
          : aw.includes('landlord') ? 'landlord'
          : null;
        if (!key) continue;
        const myVal = my[key] ?? 0;
        const maxOther = Math.max(0, ...others.map(o => o[key] ?? 0));
        const lead = myVal - maxOther;
        if (lead > bestLead) { bestLead = lead; bestIdx = i; }
      }
      console.log(`    → award: ${titles[bestIdx]?.t} (lead=${bestLead})`);
      return pick(bestIdx);
    }

    // Turmoil: Choose ruling party (Chairman ability) → pick by priority, avoid Reds
    if (orTitle.includes('ruling party')) {
      const RULING_PRIO = ['Mars First', 'Greens', 'Scientists', 'Kelvinists', 'Unity', 'Reds'];
      for (const pName of RULING_PRIO) {
        const idx = titles.findIndex(x => x.t.toLowerCase().includes(pName.toLowerCase()));
        if (idx >= 0) return pick(idx);
      }
      return pick(0);
    }

    // === MAIN ACTION PRIORITY ===
    // EARLY (1-4): production/engine cards → build economy
    // MID (5-8): synergies, VP accumulators, cities, milestones gen 3-5, awards gen 5-7
    // LATE (9+): greeneries, SP terraforming, score points

    const gen = state?.game?.generation ?? 5;
    const redsTax = isRedsRuling(state) ? 3 : 0;
    const steps = remainingSteps(state);
    const endgameMode = steps > 0 && (steps <= 6 || gen >= 16);

    // Free conversions — always do (TR + VP for greenery, TR for heat)
    // Ecoline needs only 7 plants for greenery
    const corp = (state?.thisPlayer?.tableau || [])[0]?.name || '';
    const plantsNeeded = corp === 'EcoLine' ? 7 : 8;
    // Greenery: always convert — even under Reds (greenery VP is worth it)
    if (greeneryIdx >= 0 && plants >= plantsNeeded) return pick(greeneryIdx);
    if (heatIdx >= 0 && heat >= 8 && mc >= redsTax) return pick(heatIdx);

    // === ENDGAME ===
    if (endgameMode) {
      // SP for remaining globals + city
      if (stdProjIdx >= 0) {
        const spOpt = opts[stdProjIdx]; const spCards = spOpt?.cards || [];
        const gm = state?.game || {};
        const USEFUL = [];
        if ((gm.temperature ?? -30) < 8) USEFUL.push('asteroid');
        if ((gm.oceans ?? 0) < 9) USEFUL.push('aquifer');
        if ((gm.oxygenLevel ?? 0) < 14) USEFUL.push('greenery');
        USEFUL.push('air scrapping', 'city');
        if (spCards.some(c => !c.isDisabled && USEFUL.some(kw => c.name.toLowerCase().includes(kw))) || spCards.length === 0)
          return pick(stdProjIdx);
      }
      if (cardActionIdx >= 0) return pick(cardActionIdx);
      if (delegateIdx >= 0 && mc >= 5) return pick(delegateIdx);
      if (playCardIdx >= 0) {
        const subWf = opts[playCardIdx] || {};
        const hand = subWf.cards?.length > 0 ? subWf.cards : cardsInHand;
        const payOpts = subWf.paymentOptions || {};
        const extraMC = (payOpts.heat ? heat : 0) + (payOpts.lunaTradeFederationTitanium ? titanium * (state?.thisPlayer?.titaniumValue || 3) : 0);
        const totalBudget = mc + extraMC;
        // In endgame: prioritize VP cards, play anything affordable with VP
        const affordable = hand
          .filter(c => {
            if (c.isDisabled) return false;
            const cost = c.calculatedCost ?? c.cost ?? 999;
            const cTags = CARD_TAGS[c.name] || [];
            let budget = totalBudget;
            if (cTags.includes('building')) budget += (steel * (state?.thisPlayer?.steelValue || 2));
            if (cTags.includes('space')) budget += (titanium * (state?.thisPlayer?.titaniumValue || 3));
            return cost <= budget;
          })
          .sort((a, b) => scoreCard(b, state) - scoreCard(a, state));
        if (affordable.length > 0) {
          const card = affordable[0];
          return { type: 'or', index: playCardIdx, response: { type: 'projectCard', card: card.name, payment: smartPay(card.calculatedCost || 0, state, subWf, CARD_TAGS[card.name]) } };
        }
      }
      if (sellIdx >= 0 && cardsInHand.length > 0) return pick(sellIdx);
      if (passIdx >= 0) return pick(passIdx);
      return pick(0);
    }

    // === NORMAL MODE ===

    // Milestones: best ROI in game (8 MC = 5 VP), claim ASAP — even gen 1
    if (milestoneIdx >= 0 && mc >= 8) return pick(milestoneIdx);

    // Awards: fund early if we're competitive (before spending MC on cards)
    if (awardIdx >= 0 && mc >= 14 && gen >= 4) {
      const tp = state?.thisPlayer || {};
      const players = state?.players || [];
      const myColor = tp.color;
      const metrics = players.map(p => ({
        color: p.color,
        banker: p.megaCreditProduction ?? 0,
        thermalist: (p.heat ?? 0) + (p.energy ?? 0) + (p.heatProduction ?? 0),
        miner: (p.steel ?? 0) + (p.titanium ?? 0) + (p.steelProduction ?? 0) + (p.titaniumProduction ?? 0),
        scientist: p.tags?.science ?? 0,
        venuphile: p.tags?.venus ?? 0,
        landlord: p.citiesCount ?? 0,
      }));
      const my = metrics.find(m => m.color === myColor) || {};
      const others = metrics.filter(m => m.color !== myColor);
      const awardNames = ['banker', 'thermalist', 'miner', 'scientist', 'venuphile', 'landlord'];
      const competitive = awardNames.some(aw => {
        const myVal = my[aw] ?? 0;
        if (myVal === 0) return false;
        const maxOther = Math.max(0, ...others.map(o => o[aw] ?? 0));
        return myVal >= maxOther;
      });
      if (competitive) {
        console.log(`    → FUNDING award! MC=${mc} gen=${gen} banker=${my.banker} therm=${my.thermalist} miner=${my.miner} sci=${my.scientist}`);
        return pick(awardIdx);
      }
    }

    // === CARD vs SP COMPETITION ===
    // Cards and Standard Projects compete on EV. Best action wins.
    const bl = state?._blacklist || new Set();
    const gm = state?.game || {};
    // Rate includes WGT raises + player SPs. In 3P Venus: ~6-8 steps/gen total.
    const ratePerGen = Math.max(4, Math.min(8, (state?.players?.length || 3) * 2));
    const gensLeftNow = Math.max(1, Math.ceil(steps / ratePerGen));

    // Calculate best SP EV (if available)
    let bestSpEV = -999;
    const trMCNow = gensLeftNow + (gensLeftNow >= 6 ? 3 : gensLeftNow >= 3 ? 5 : 7) - redsTax;
    const tempoNow = gensLeftNow >= 5 ? 7 : (gensLeftNow >= 3 ? 5 : 3);
    const spAvailable = stdProjIdx >= 0 && mc >= 14 + redsTax;
    if (spAvailable) {
      const tempDone = (gm.temperature ?? -30) >= 8;
      const o2Done = (gm.oxygenLevel ?? 0) >= 14;
      const oceansDone = (gm.oceans ?? 0) >= 9;
      // SP EV = TR value + tempo - cost
      if (!tempDone) bestSpEV = Math.max(bestSpEV, trMCNow + tempoNow - 14); // asteroid
      if (!oceansDone && mc >= 18 + redsTax) bestSpEV = Math.max(bestSpEV, trMCNow + tempoNow + 2 - 18); // aquifer
      bestSpEV = Math.max(bestSpEV, trMCNow + tempoNow - 15); // air scrapping (Venus)
      if (!o2Done && mc >= 23 + redsTax) {
        const vpNow = gensLeftNow >= 6 ? 3 : gensLeftNow >= 3 ? 5 : 7;
        bestSpEV = Math.max(bestSpEV, trMCNow + tempoNow + vpNow - 23); // greenery SP
      }
    }

    // Calculate best card EV (if available)
    let bestCard = null;
    let bestCardEV = -999;
    if (playCardIdx >= 0) {
      const subWf = opts[playCardIdx] || {};
      const payOpts = subWf.paymentOptions || {};
      const hand = subWf.cards?.length > 0 ? subWf.cards : cardsInHand;
      if (hand.length > 0) {
        const extraMC = (payOpts.heat ? heat : 0) + (payOpts.lunaTradeFederationTitanium ? titanium * (state?.thisPlayer?.titaniumValue || 3) : 0);
        // No MC reserve — SP quota handles forced terraforming
        const totalBudget = mc + extraMC;
        const playable = hand
          .filter(c => {
            if (c.isDisabled || bl.has(c.name)) return false;
            const cost = c.calculatedCost ?? c.cost ?? 999;
            const cTags = CARD_TAGS[c.name] || [];
            let budget = totalBudget;
            if (cTags.includes('building')) budget += (steel * (state?.thisPlayer?.steelValue || 2));
            if (cTags.includes('space')) budget += (titanium * (state?.thisPlayer?.titaniumValue || 3));
            return cost <= budget;
          })
          .map(c => {
            let score = scoreCard(c, state);
            // VP and city cards get priority bonus — production values alone don't capture end-game VP
            if (VP_CARDS.has(c.name) || DYNAMIC_VP_CARDS.has(c.name)) score += 8;
            if (CITY_CARDS.has(c.name)) score += 5;
            return { ...c, _score: score };
          })
          .sort((a, b) => b._score - a._score);
        if (playable.length > 0 && playable[0]._score >= 0) {
          bestCard = playable[0];
          bestCardEV = playable[0]._score;
        }
      }
    }

    // Pure EV competition: pick whichever is better
    if (bestCard && bestCardEV >= bestSpEV) {
      const subWf2 = opts[playCardIdx] || {};
      return {
        type: 'or', index: playCardIdx,
        response: { type: 'projectCard', card: bestCard.name, payment: smartPay(bestCard.calculatedCost ?? bestCard.cost ?? 0, state, subWf2, CARD_TAGS[bestCard.name]) }
      };
    }
    if (spAvailable && bestSpEV > -5) {
      return pick(stdProjIdx);
    }
    // Card is only option (SP not available/affordable)
    if (bestCard && bestCardEV >= 0) {
      const subWf2 = opts[playCardIdx] || {};
      return {
        type: 'or', index: playCardIdx,
        response: { type: 'projectCard', card: bestCard.name, payment: smartPay(bestCard.calculatedCost ?? bestCard.cost ?? 0, state, subWf2, CARD_TAGS[bestCard.name]) }
      };
    }

    // Blue card actions (VP accumulators, free resources)
    if (cardActionIdx >= 0) return pick(cardActionIdx);

    // Trade colonies (high-value trades first)
    if (tradeIdx >= 0 && (mc >= 9 || energy >= 3 || titanium >= 3)) {
      const tradeOpt = opts[tradeIdx];
      const colonies = tradeOpt?.coloniesModel || tradeOpt?.colonies || [];
      if (colonies.length > 0) {
        const bestTradeVal = Math.max(...colonies.map(c => scoreColonyTrade(c, state)));
        if (bestTradeVal >= 8) return pick(tradeIdx);
      }
    }

    // SP fallback when globals still far
    if (spAvailable && steps > 12) return pick(stdProjIdx);

    // Trade colonies (lower threshold)
    if (tradeIdx >= 0 && (mc >= 9 || energy >= 3 || titanium >= 3)) return pick(tradeIdx);

    // Build colony (production bonus)
    if (colonyIdx >= 0 && mc >= 17) return pick(colonyIdx);

    // Delegate (chairman VP, party leader VP, anti-Reds)
    if (delegateIdx >= 0 && mc >= 8) return pick(delegateIdx);

    // Sell excess cards
    if (sellIdx >= 0 && cardsInHand.length > 8) return pick(sellIdx);

    // 13. Try first unhandled option (CEO actions, prelude-phase triggers, card effects, etc.)
    // Skip options already handled by dedicated steps above
    if (passIdx >= 0 && opts.length > 1) {
      const alreadyHandled = new Set([playCardIdx, stdProjIdx, greeneryIdx, heatIdx,
        cardActionIdx, milestoneIdx, awardIdx, colonyIdx, tradeIdx, delegateIdx, sellIdx,
        worldGovIdx, passIdx].filter(i => i >= 0));
      const idx = titles.findIndex(x => !alreadyHandled.has(x.i) && !skip.has(x.i));
      if (idx >= 0) return pick(idx);
    }

    // 14. Pass as absolute last resort
    if (passIdx >= 0) return pick(passIdx);

    return pick(0);
  }

  if (t === 'and') {
    const opts = wf.options || [];
    // Resource distribution: all children are 'amount' → distribute respecting per-option max
    // Options may have different exchange rates (e.g. "2 heat each" for Stormcraft floaters)
    if (opts.length > 0 && opts.every(o => o.type === 'amount')) {
      const titleData = wf.title?.data;
      const total = (titleData && titleData[0]?.value) ? parseInt(titleData[0].value) : (opts[0]?.max || 0);
      // Parse per-unit heat rate from option titles (e.g. "2 heat each" → rate=2)
      const rates = opts.map(o => {
        const m = getTitle(o).match(/(\d+)\s+heat\s+each/i);
        return m ? parseInt(m[1]) : 1;
      });
      let remaining = total; // in base heat units
      const amounts = new Array(opts.length).fill(0);
      // Pass 1: fill rate>1 options first using floor (no overspend)
      for (let i = 0; i < opts.length; i++) {
        if (rates[i] === 1 || remaining <= 0) continue;
        const r = rates[i];
        const use = Math.min(opts[i].max ?? 0, Math.floor(remaining / r));
        amounts[i] = use;
        remaining -= use * r;
      }
      // Pass 2: fill rate=1 options for exact remainder
      for (let i = 0; i < opts.length; i++) {
        if (rates[i] !== 1 || remaining <= 0) continue;
        const use = Math.min(opts[i].max ?? remaining, remaining);
        amounts[i] = use;
        remaining -= use;
      }
      // Pass 3: if still remaining (rate=1 options exhausted), overspend with rate>1
      for (let i = 0; i < opts.length; i++) {
        if (rates[i] === 1 || remaining <= 0) continue;
        const r = rates[i];
        const canAdd = (opts[i].max ?? 0) - amounts[i];
        if (canAdd <= 0) continue;
        const use = Math.min(canAdd, Math.ceil(remaining / r));
        amounts[i] += use;
        remaining -= use * r;
      }
      return { type: 'and', responses: opts.map((o, i) => ({ type: 'amount', amount: amounts[i] })) };
    }
    return { type: 'and', responses: opts.map(o => handleInput(o, state, depth+1)) };
  }

  if (t === 'card') {
    const cards = wf.cards || [];
    const min = Math.max(0, wf.min ?? 0);
    const max = Math.max(0, wf.max ?? cards.length);
    const title = getTitle(wf).toLowerCase();

    if (max <= 0 || cards.length === 0) {
      return { type: 'card', cards: [] };
    }

    // Buy cards phase: buy good cards, keep reserve for plays
    if (title.includes('buy') || title.includes('select card(s) to buy') || title.includes('select up to')) {
      const mc = state?.thisPlayer?.megaCredits ?? 40;
      const cardCost = state?.thisPlayer?.cardCost ?? 3;
      const gen = state?.game?.generation ?? 5;
      const steps = remainingSteps(state);
      const isEndgame = steps > 0 && (steps <= 8 || gen >= 20);
      // In endgame: stop buying — save MC for SPs and terraforming
      if (isEndgame) return { type: 'card', cards: [] };
      // Buy cards aggressively — cards are how you build economy AND score VP
      const reserve = gen <= 2 ? 0 : (gen <= 5 ? 5 : 8);
      const spendable = Math.max(0, mc - reserve);
      const canAfford = Math.min(Math.floor(spendable / cardCost), max, cards.length);
      const sorted = [...cards].sort((a, b) => {
        let sa = scoreCard(a, state), sb = scoreCard(b, state);
        if (VP_CARDS.has(a.name) || DYNAMIC_VP_CARDS.has(a.name)) sa += 8;
        if (VP_CARDS.has(b.name) || DYNAMIC_VP_CARDS.has(b.name)) sb += 8;
        if (CITY_CARDS.has(a.name)) sa += 8;
        if (CITY_CARDS.has(b.name)) sb += 8;
        if (gen <= 4 && ENGINE_CARDS.has(a.name)) sa += 6;
        if (gen <= 4 && ENGINE_CARDS.has(b.name)) sb += 6;
        return sb - sa;
      });
      const threshold = gen <= 4 ? 2 : (gen <= 8 ? 3 : 5);
      const worthBuying = sorted.filter(c => scoreCard(c, state) >= threshold);
      const maxBuy = gen <= 4 ? 4 : (gen <= 8 ? 4 : 3);
      const count = Math.max(min, Math.min(canAfford, worthBuying.length, maxBuy));
      return { type: 'card', cards: sorted.slice(0, count).map(c => c.name) };
    }

    if (title.includes('cannot afford')) {
      return { type: 'card', cards: [] };
    }

    // Standard projects selection: pick best terraform (check isDisabled!)
    if (title.includes('standard project')) {
      const mc = state?.thisPlayer?.megaCredits ?? 0;
      const reds = isRedsRuling(state) ? 3 : 0; // extra cost per TR step
      const available = cards.filter(c => !c.isDisabled);
      // Remaining steps per parameter — skip SPs for maxed-out globals
      const g = state?.game || {};
      const tempDone = (g.temperature ?? -30) >= 8;
      const o2Done = (g.oxygenLevel ?? 0) >= 14;
      const oceansDone = (g.oceans ?? 0) >= 9;
      // Priority: TR-raising first, then VP-generating (city), then economy
      // SP priority: cheapest TR first (cards handle VP/cities better)
      // SP priority: terraforming + air scrapping
      // Removed: buffer gas (solo only), power plant (bad ROI)
      const spPriority = [
        !tempDone && { kw: 'asteroid', cost: 14 + reds },
        !oceansDone && { kw: 'aquifer', cost: 18 + reds },
        { kw: 'air scrapping', cost: 15 + reds },
        !o2Done && { kw: 'greenery', cost: 23 + reds },
      ].filter(Boolean);
      for (const { kw, cost } of spPriority) {
        const sp = available.find(c => c.name.toLowerCase().includes(kw));
        if (sp && mc >= cost) return { type: 'card', cards: [sp.name] };
      }
      // City SP as fallback (1 VP + production)
      const city = available.find(c => c.name.toLowerCase().includes('city'));
      if (city && mc >= 25) return { type: 'card', cards: [city.name] };
      return { type: 'card', cards: [] };
    }

    // Blue card action: VP accumulators first, then economy, then by resources
    if (wf.selectBlueCardAction) {
      const active = cards.filter(c => !c.isDisabled);
      const pool = active.length > 0 ? active : cards;
      const sorted = [...pool].sort((a, b) => {
        // Priority 1: per_resource VP accumulators (each action = VP)
        const aPerRes = CARD_VP[a.name]?.type === 'per_resource' ? 1 : 0;
        const bPerRes = CARD_VP[b.name]?.type === 'per_resource' ? 1 : 0;
        if (aPerRes !== bPerRes) return bPerRes - aPerRes;
        // Priority 2: Dynamic VP cards (Ants, Birds, etc.)
        const aDyn = DYNAMIC_VP_CARDS.has(a.name) ? 1 : 0;
        const bDyn = DYNAMIC_VP_CARDS.has(b.name) ? 1 : 0;
        if (aDyn !== bDyn) return bDyn - aDyn;
        // Priority 3: VP cards
        const aVP = VP_CARDS.has(a.name) ? 1 : 0;
        const bVP = VP_CARDS.has(b.name) ? 1 : 0;
        if (aVP !== bVP) return bVP - aVP;
        // Priority 4: production/engine cards
        const aProd = (PROD_CARDS.has(a.name) || ENGINE_CARDS.has(a.name)) ? 1 : 0;
        const bProd = (PROD_CARDS.has(b.name) || ENGINE_CARDS.has(b.name)) ? 1 : 0;
        if (aProd !== bProd) return bProd - aProd;
        // Tiebreaker: resources on card
        return (b.resources || 0) - (a.resources || 0);
      });
      return { type: 'card', cards: [sorted[0].name] };
    }

    // Draft/keep: pick highest-scored card(s)
    if (title.includes('select a card') || title.includes('keep')) {
      const count = Math.max(1, min);
      const scored = [...cards].sort((a, b) => scoreCard(b, state) - scoreCard(a, state));
      return { type: 'card', cards: scored.slice(0, count).map(c => c.name) };
    }

    // Discard: discard most expensive
    if (title.includes('discard')) {
      const sorted = [...cards].sort((a, b) => (b.calculatedCost || b.cost || 0) - (a.calculatedCost || a.cost || 0));
      return { type: 'card', cards: sorted.slice(0, Math.max(min, 1)).map(c => c.name) };
    }

    // Sell: sell lowest-scored cards, but KEEP VP cards
    if (title.includes('sell')) {
      const scored = [...cards].sort((a, b) => scoreCard(a, state) - scoreCard(b, state)); // worst first
      const gen = state?.game?.generation ?? 5;
      const steps = remainingSteps(state);
      const isEndgame = steps > 0 && (steps <= 8 || gen >= 20);
      // Never sell cards with VP potential
      const sellable = scored.filter(c => {
        const vpd = CARD_VP[c.name];
        if (vpd && (vpd.type !== 'static' || vpd.vp > 0)) return false;
        const vp = STATIC_VP[c.name] ?? 0;
        if (vp > 0 || DYNAMIC_VP_CARDS.has(c.name)) return false;
        return true;
      });
      const count = isEndgame ? Math.max(min, sellable.length) : Math.max(min, Math.floor(sellable.length / 2));
      return { type: 'card', cards: sellable.slice(0, count).map(c => c.name) };
    }

    // Default: min required
    return { type: 'card', cards: cards.slice(0, min).map(c => c.name) };
  }

  if (t === 'space') {
    const spaces = wf.spaces || wf.availableSpaces || [];
    if (spaces.length === 0) return { type: 'space', spaceId: '21' };
    const title = getTitle(wf).toLowerCase();
    const isCity = title.includes('city');
    const isGreenery = title.includes('greenery') || title.includes('forest');
    // Board adjacency data for VP optimization
    const boardSpaces = state?.game?.spaces || [];
    const adjMap = {};
    for (const bs of boardSpaces) {
      if (bs.id) adjMap[bs.id] = bs;
    }
    const myColor = state?.thisPlayer?.color;
    const scored = spaces.map(s => {
      const id = s.id || s;
      const bonus = s.bonus || [];
      let score = 0;
      // Placement bonuses
      for (const b of bonus) {
        if (b === 'plant' || b === 'plants' || b === 1) score += 2;
        if (b === 'steel' || b === 2) score += 2;
        if (b === 'titanium' || b === 3) score += 3;
        if (b === 'card' || b === 'draw' || b === 4) score += 3;
        if (b === 'heat' || b === 5) score += 1;
        if (b === 'ocean' || b === 6) score += 2; // ocean adjacency bonus (2 MC)
      }
      // Adjacency VP scoring
      const spaceData = adjMap[id];
      if (spaceData && spaceData.adjacentSpaces) {
        for (const adjId of spaceData.adjacentSpaces) {
          const adj = adjMap[adjId];
          if (!adj) continue;
          // For city: each adjacent greenery = 1 VP
          if (isCity && adj.tileType === 'greenery') score += 3;
          // For city: adjacent to own city is bad (wasted adjacency)
          if (isCity && adj.tileType === 'city' && adj.color === myColor) score -= 2;
          // For greenery: adjacent to own city = 1 VP for that city
          if (isGreenery && adj.tileType === 'city' && adj.color === myColor) score += 4;
          // For greenery: adjacent to opponent city still gives THEM VP, prefer our cities
          if (isGreenery && adj.tileType === 'city' && adj.color !== myColor) score -= 1;
          // Adjacent ocean = 2 MC placement bonus
          if (adj.tileType === 'ocean') score += 1;
        }
      }
      return { id, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return { type: 'space', spaceId: scored[0].id };
  }

  if (t === 'amount') return { type: 'amount', amount: wf.max ?? wf.min ?? 0 };

  if (t === 'player') {
    const p = wf.players || [];
    return { type: 'player', player: p[0]?.color || p[0] || 'neutral' };
  }

  if (t === 'party') {
    const parties = wf.parties || wf.availableParties || [];
    // Priority: reinforce party where we already lead, else pick by value
    // Mars First > Greens > Scientists > Kelvinists > Unity > Reds
    // In endgame, anti-Reds is critical (Reds blocks WG terraform + taxes TR)
    const steps = remainingSteps(state);
    const gen = state?.game?.generation ?? 5;
    const isEndgame = steps > 0 && (steps <= 8 || gen >= 20);
    const PARTY_PRIO = isEndgame
      ? ['Greens', 'Mars First', 'Scientists', 'Kelvinists', 'Unity', 'Reds']
      : ['Mars First', 'Greens', 'Scientists', 'Kelvinists', 'Unity', 'Reds'];
    const turmoil = state?.game?.turmoil;
    const myColor = state?.thisPlayer?.color;
    if (turmoil && myColor) {
      // Find party where we are partyLeader → reinforce
      const myParty = turmoil.parties?.find(p =>
        p.partyLeader === myColor && parties.includes(p.name));
      if (myParty) return { type: 'party', partyName: myParty.name };
      // Find party where we have most delegates → grow
      let bestParty = null, bestCount = 0;
      for (const p of (turmoil.parties || [])) {
        if (!parties.includes(p.name)) continue;
        const myDel = (p.delegates || []).find(d => d.color === myColor);
        if (myDel && myDel.number > bestCount) { bestCount = myDel.number; bestParty = p.name; }
      }
      if (bestParty) return { type: 'party', partyName: bestParty };
    }
    // Fallback: priority list, skip Reds if possible
    const pick = PARTY_PRIO.find(p => parties.includes(p)) || parties[0] || 'Mars First';
    return { type: 'party', partyName: pick };
  }

  if (t === 'delegate') {
    const players = wf.players || [];
    // Always pick our own color to gain influence
    const myColor = state?.thisPlayer?.color;
    if (myColor && players.includes(myColor)) return { type: 'delegate', player: myColor };
    // Fall back: NEUTRAL, then first available
    if (players.includes('NEUTRAL')) return { type: 'delegate', player: 'NEUTRAL' };
    return { type: 'delegate', player: players[0] || 'NEUTRAL' };
  }

  if (t === 'colony') {
    const colonies = wf.coloniesModel || wf.colonies || [];
    if (colonies.length > 0) {
      const title = getTitle(wf).toLowerCase();
      const isTrade = title.includes('trade') || title.includes('income');
      let sorted;
      if (isTrade) {
        // Score by actual trade value at current track position
        sorted = [...colonies].sort((a, b) => scoreColonyTrade(b, state) - scoreColonyTrade(a, state));
      } else {
        // Build colony: priority by what the build gives
        sorted = [...colonies].sort((a, b) => {
          const an = a.name || a, bn = b.name || b;
          const ai = COLONY_BUILD_PRIORITY.indexOf(an), bi = COLONY_BUILD_PRIORITY.indexOf(bn);
          return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
        });
      }
      return { type: 'colony', colonyName: sorted[0].name || sorted[0] };
    }
    return { type: 'colony', colonyName: 'Luna' };
  }

  if (t === 'payment') {
    return { type: 'payment', payment: smartPay(wf.amount || 0, state, wf) };
  }

  if (t === 'projectCard') {
    const cards = wf.cards || [];
    if (cards.length > 0) {
      const mc = state?.thisPlayer?.megaCredits ?? 0;
      const tp = state?.thisPlayer || {};
      const payOpts = wf.paymentOptions || {};
      const heatAvail = payOpts.heat ? (tp.heat || 0) : 0;
      // Filter by affordability (heat as MC counts)
      const affordable = cards.filter(c => (c.calculatedCost ?? c.cost ?? 999) <= mc + heatAvail);
      const card = affordable.length > 0 ? affordable[0] : null;
      if (!card) return { type: 'option' };
      return { type: 'projectCard', card: card.name, payment: smartPay(card.calculatedCost || 0, state, wf, CARD_TAGS[card.name]) };
    }
    return { type: 'option' };
  }

  if (t === 'resource') {
    // "Gain X units of standard resource" — pick megacredits or steel
    const include = wf.include || ['megacredits'];
    const pref = include.includes('steel') ? 'steel' : include.includes('titanium') ? 'titanium' : include[0];
    return { type: 'resource', resource: pref };
  }

  if (t === 'resources') {
    // wf.count = total units to gain; prefer MC as most universally useful
    const count = wf.count ?? wf.max ?? wf.min ?? 1;
    return { type: 'resources', units: { megacredits: count, steel: 0, titanium: 0, plants: 0, energy: 0, heat: 0 } };
  }

  if (t === 'productionToLose') {
    return { type: 'productionToLose', units: { megacredits: 0, steel: 0, titanium: 0, plants: 0, energy: 0, heat: 0 } };
  }

  if (t === 'initialCards') {
    const opts = wf.options || [];

    // Gather all available project cards across all options for synergy scoring
    let allProjectCards = [];
    let allPreludes = [];
    for (const opt of opts) {
      const title = getTitle(opt).toLowerCase();
      if (title.includes('buy') || title.includes('initial cards')) {
        allProjectCards = opt.cards || [];
      }
      if (title.includes('prelude')) {
        allPreludes = (opt.cards || []).filter(c => c.name !== 'Merger');
      }
    }

    // Score corporation synergy with available cards
    function scoreCorp(corpName) {
      let base = PREF_CORPS.indexOf(corpName);
      base = base < 0 ? 20 : base; // unknown corps get lower priority
      let synergy = 0;
      const projectTags = allProjectCards.flatMap(c => CARD_TAGS[c.name] || []);

      // Corp-specific synergies with available cards
      if (corpName === 'Saturn Systems') synergy += projectTags.filter(t => t === 'jovian').length * 3;
      if (corpName === 'Arklight') synergy += projectTags.filter(t => t === 'animal' || t === 'plant').length * 2;
      if (corpName === 'Teractor') synergy += projectTags.filter(t => t === 'earth').length * 2;
      if (corpName === 'Point Luna') synergy += projectTags.filter(t => t === 'earth').length * 2;
      if (corpName === 'Interplanetary Cinematics') synergy += projectTags.filter(t => t === 'event').length * 2;
      if (corpName === 'Thorgate') synergy += projectTags.filter(t => t === 'power').length * 2;
      if (corpName === 'Mining Guild') synergy += projectTags.filter(t => t === 'building').length * 1;
      if (corpName === 'Stormcraft Incorporated') synergy += projectTags.filter(t => t === 'jovian').length * 2;
      if (corpName === 'CrediCor') synergy += allProjectCards.filter(c => (c.calculatedCost ?? c.cost ?? 0) >= 20).length * 2;
      if (corpName === 'Helion') synergy += 3; // heat as MC is always useful
      if (corpName === 'Ecoline') synergy += projectTags.filter(t => t === 'plant').length * 2;
      if (corpName === 'Poseidon') synergy += 4; // colonies always available in our config

      return { name: corpName, score: synergy - base }; // lower base = higher PREF_CORPS rank = better
    }

    const responses = opts.map(opt => {
      const cards = opt.cards || [];
      const min = Math.max(0, opt.min ?? 0);
      const max = Math.max(0, opt.max ?? cards.length);
      const title = getTitle(opt).toLowerCase();

      if (title.includes('corporation')) {
        // Score each corp by synergy with available project cards
        const scored = cards.map(c => scoreCorp(c.name)).sort((a, b) => b.score - a.score);
        const best = scored[0]?.name || cards[0].name;
        console.log(`    → Corp pick: ${best} (scores: ${scored.map(s => `${s.name}=${s.score}`).join(', ')})`);
        return { type: 'card', cards: [best] };
      }
      if (title.includes('prelude')) {
        const valid = cards.filter(c => c.name !== 'Merger');
        const pool = valid.length >= min ? valid : cards;
        // Score preludes: PREF_PRELUDES rank + scoreCard for tag synergy
        const sorted = [...pool].sort((a, b) => {
          const ai = PREF_PRELUDES.indexOf(a.name), bi = PREF_PRELUDES.indexOf(b.name);
          const rankA = ai < 0 ? 999 : ai;
          const rankB = bi < 0 ? 999 : bi;
          // Use scoreCard as tiebreaker for unknown preludes
          if (rankA === 999 && rankB === 999) {
            return scoreCard(b, state) - scoreCard(a, state);
          }
          return rankA - rankB;
        });
        const picks = sorted.slice(0, min).map(c => c.name);
        console.log(`    → Prelude pick: ${picks.join(', ')}`);
        return { type: 'card', cards: picks };
      }
      if (title.includes('ceo')) return { type: 'card', cards: [cards[0].name] };
      if (title.includes('buy') || title.includes('initial cards')) {
        const scored = [...cards].sort((a, b) => scoreCard(b, state) - scoreCard(a, state));
        const worthBuying = scored.filter(c => scoreCard(c, state) >= 5);
        const count = Math.min(max, Math.max(min, worthBuying.length));
        return { type: 'card', cards: scored.slice(0, count).map(c => c.name) };
      }
      return { type: 'card', cards: cards.slice(0, min).map(c => c.name) };
    });
    return { type: 'initialCards', responses };
  }

  return { type: 'option' };
}

// Track consecutive card plays to force SP interleaving
const cardPlayCounter = new Map(); // playerId -> count of consecutive card plays

// Track cards that fail to play (unmet requirements)
const cardBlacklist = new Map(); // playerId -> Set<cardName>

function getBlacklist(pid) {
  if (!cardBlacklist.has(pid)) cardBlacklist.set(pid, new Set());
  return cardBlacklist.get(pid);
}

// ===== GAME LOOP =====
let genCounter = 0;

async function playAllWaiting() {
  let acted = false;
  for (const p of PLAYERS) {
    const state = await fetch(`${BASE}/api/player?id=${p.id}`);
    const wf = state.waitingFor;
    if (!wf) continue;

    const title = getTitle(wf).slice(0, 50);
    const input = handleInput(wf, state);
    const resp = await post(`${BASE}/player/input?id=${p.id}`, input);

    if (resp.status === 200) {
      console.log(`  ${p.name}: ${wf.type} "${title}" -> OK`);
      acted = true;
    } else {
      const err = resp.body.slice(0, 150);
      // Extract card name from error to blacklist
      const unknownMatch = err.match(/Unknown card name (.+?)"/);
      if (unknownMatch) getBlacklist(p.id).add(unknownMatch[1]);

      // Retry loop: blacklist failing card and try next best card (up to 5 retries)
      let retryOk = false;
      if (wf.type === 'or') {
        // Try to extract card from our input for blacklisting
        if (input.response?.card) getBlacklist(p.id).add(input.response.card);
        state._blacklist = getBlacklist(p.id);
        // Track tried OR indices to skip on retry
        state._skipActions = state._skipActions || new Set();
        if (typeof input.index === 'number') state._skipActions.add(input.index);

        for (let retry = 0; retry < 5; retry++) {
          const input2 = handleInput(wf, state);
          const r2 = await post(`${BASE}/player/input?id=${p.id}`, input2);
          if (r2.status === 200) {
            console.log(`  ${p.name}: retry #${retry+1} -> OK`);
            acted = true; retryOk = true; break;
          }
          // Blacklist failed card and action index
          if (input2.response?.card) getBlacklist(p.id).add(input2.response.card);
          if (typeof input2.index === 'number') state._skipActions.add(input2.index);
          state._blacklist = getBlacklist(p.id);
        }

        // All retries failed — pass
        if (!retryOk) {
          const opts = wf.options || [];
          for (let i = opts.length - 1; i >= 0; i--) {
            const t = getTitle(opts[i]).toLowerCase();
            if (t.includes('pass') || t.includes('end turn') || t.includes('do nothing') || t.includes('skip')) {
              const fb = { type: 'or', index: i, response: handleInput(opts[i], state, 1) };
              const r3 = await post(`${BASE}/player/input?id=${p.id}`, fb);
              if (r3.status === 200) { console.log(`  ${p.name}: pass (fallback: ${err.slice(0,50)})`); acted = true; break; }
            }
          }
          if (!acted) console.log(`  ${p.name}: ERR ${err}`);
        }
      } else if (wf.type === 'card') {
        const fb = { type: 'card', cards: [] };
        const r2 = await post(`${BASE}/player/input?id=${p.id}`, fb);
        if (r2.status === 200) { console.log(`  ${p.name}: card [] (fallback)`); acted = true; }
        else console.log(`  ${p.name}: ERR ${err}`);
      } else {
        console.log(`  ${p.name}: ERR ${err}`);
      }
    }
  }
  return acted;
}

async function main() {
  let lastPhase = '';
  let stuckCount = 0;

  for (let turn = 0; turn < 15000; turn++) {
    const game = await fetch(`${BASE}/api/game?id=${GAME_ID}`);
    const phase = game.phase;

    if (phase !== lastPhase) {
      if (phase === 'action') {
        genCounter++;
        cardBlacklist.clear();
        cardPlayCounter.clear();

        // Print VP scoreboard + remaining steps at start of each action phase
        try {
          const s0 = await fetch(`${BASE}/api/player?id=${PLAYERS[0].id}`);
          const steps = remainingSteps(s0);
          const g = s0?.game || {};
          const tempS = Math.max(0, Math.round((8 - (g.temperature ?? -30)) / 2));
          const o2S = Math.max(0, 14 - (g.oxygenLevel ?? 0));
          const ocS = Math.max(0, 9 - (g.oceans ?? 0));
          const ruling = g.turmoil?.ruling || '?';
          const vpLine = (s0.players || []).map(p => {
            const vp = p.victoryPointsBreakdown?.total ?? '?';
            return `${p.name||p.color}:${vp}VP`;
          }).join(' ');
          console.log(`\n=== GEN ${genCounter} — ACTION | steps=${steps} (temp=${tempS} o2=${o2S} oc=${ocS}) ruling=${ruling} [${vpLine}] ===`);
        } catch(_) {
          console.log(`\n=== GEN ${genCounter} — ACTION ===`);
        }
      } else if (phase === 'end') {
        console.log(`\n=== GEN ${genCounter} — END ===`);
      }
      lastPhase = phase;
      stuckCount = 0;
    }

    // Check isTerraformed from player API (SimpleGameModel from /api/game doesn't have it)
    const p0state = phase !== 'end' ? await fetch(`${BASE}/api/player?id=${PLAYERS[0].id}`) : null;
    const isTerraformed = p0state?.game?.isTerraformed ?? false;
    if (phase === 'end' || isTerraformed || genCounter >= 40) {
      if (genCounter >= 40 && phase !== 'end') {
        console.log(`\n========== GAME ABORTED (gen ${genCounter} cap) ==========`);
      } else {
        console.log('\n========== GAME OVER ==========');
      }
      const scores = [];
      for (const p of PLAYERS) {
        const s = await fetch(`${BASE}/api/player?id=${p.id}`);
        const tp = s.thisPlayer;
        const vp = tp.victoryPointsBreakdown || {};
        const corp = (tp.tableau || [])[0]?.name ?? '?';
        console.log(`\n${p.name} (${corp}): TOTAL=${vp.total??'?'} VP`);
        console.log(`  TR=${vp.terraformRating} milestones=${vp.milestones} awards=${vp.awards} greenery=${vp.greenery} city=${vp.city} cards=${vp.victoryPoints}`);
        const tableau = (tp.tableau || []).map(c => c.name);
        console.log(`  Tableau (${tableau.length}): ${tableau.slice(0, 12).join(', ')}...`);
        scores.push({ name: p.name, corp, vp: vp.total ?? 0, gens: genCounter,
          tr: vp.terraformRating ?? 0, milestones: vp.milestones ?? 0, awards: vp.awards ?? 0,
          greenery: vp.greenery ?? 0, city: vp.city ?? 0, cards: vp.victoryPoints ?? 0,
          tableau: tableau.length });
      }
      return scores;
    }

    const acted = await playAllWaiting();
    if (!acted) {
      stuckCount++;
      if (stuckCount > 30) {
        // Maybe game ended — check via player API (has isTerraformed)
        const gCheck = await fetch(`${BASE}/api/game?id=${GAME_ID}`);
        const pCheck = await fetch(`${BASE}/api/player?id=${PLAYERS[0].id}`);
        const isGameOver = gCheck.phase === 'end' || pCheck?.game?.isTerraformed;
        if (isGameOver) {
          console.log('\n========== GAME OVER ==========');
          const scores = [];
          for (const p of PLAYERS) {
            const s = await fetch(`${BASE}/api/player?id=${p.id}`);
            const tp = s.thisPlayer;
            const vp = tp.victoryPointsBreakdown || {};
            const corp = (tp.tableau || [])[0]?.name ?? '?';
            console.log(`\n${p.name} (${corp}): TOTAL=${vp.total??'?'} VP`);
            console.log(`  TR=${vp.terraformRating} milestones=${vp.milestones} awards=${vp.awards} greenery=${vp.greenery} city=${vp.city} cards=${vp.victoryPoints}`);
            const tableau = (tp.tableau || []).map(c => c.name);
            console.log(`  Tableau (${tableau.length}): ${tableau.slice(0, 12).join(', ')}...`);
            scores.push({ name: p.name, corp, vp: vp.total ?? 0, gens: genCounter });
          }
          return scores;
        }
        const gm = pCheck?.game || {};
        console.log(`\nSTUCK! phase=${gCheck.phase} gen=${genCounter} isTerraformed=${gm.isTerraformed} temp=${gm.temperature} o2=${gm.oxygenLevel} oceans=${gm.oceans}`);
        for (const p of PLAYERS) {
          const s = await fetch(`${BASE}/api/player?id=${p.id}`);
          if (s.waitingFor) {
            console.log(`${p.name}: ${s.waitingFor.type} "${getTitle(s.waitingFor).slice(0,60)}"`);
            if (s.waitingFor.options) s.waitingFor.options.forEach((o,i) => console.log(`  [${i}] ${o.type} "${getTitle(o).slice(0,50)}"`));
            console.log(`  RAW: ${JSON.stringify(s.waitingFor).slice(0, 400)}`);
          } else console.log(`${p.name}: idle`);
        }
        return;
      }
    } else stuckCount = 0;

    await new Promise(r => setTimeout(r, 15));
  }
}

async function createGame(firstPlayerIdx = 0) {
  const playerDefs = [
    { name: 'Alpha', color: 'red' },
    { name: 'Beta',  color: 'green' },
    { name: 'Gamma', color: 'blue' },
  ];
  const payload = {
    players: playerDefs.map((p, i) => ({ ...p, beginner: false, handicap: 0, first: i === firstPlayerIdx })),
    board: 'tharsis',
    seed: Math.random(),
    solarPhaseOption: false,
    shuffleMapOption: false,
    randomMA: 'No randomization',
    draftVariant: true,
    initialDraft: true,
    startingCorporations: 2,
    startingPreludes: 4,
    showTimers: false,
    showOtherPlayersVP: true,
    fastModeOption: true,
    undoOption: false,
    soloTR: false,
    includedCards: [],
    bannedCards: [],
    customCorporationsList: [],
    customColoniesList: [],
    customPreludes: [],
    customCeos: [],
    startingCeos: 3,
    expansions: {
      corpera: true, prelude: true, turmoil: true, colonies: true,
      venus: true, ares: false, moon: false, pathfinders: false,
      ceo: false, community: false, promo: true, starwars: false,
      underworld: false, prelude2: false,
    },
  };
  const data = JSON.stringify(payload);
  const result = await new Promise((res, rej) => {
    const req = require('http').request({
      hostname: 'localhost', port: 8081, path: '/api/creategame',
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (r) => { let b=''; r.on('data', c=>b+=c); r.on('end', ()=>res({status:r.statusCode,body:b})); });
    req.on('error', rej); req.write(data); req.end();
  });
  if (result.status !== 200 && result.status !== 201) throw new Error(`Create game failed: ${result.body.slice(0,200)}`);
  const game = JSON.parse(result.body);
  console.log(`New game: ${game.id}`);
  console.log(`Players: ${game.players.map(p => `${p.name}=${p.id}`).join(', ')}`);
  return game;
}

async function runBatch(n) {
  const allResults = [];
  for (let i = 1; i <= n; i++) {
    console.log(`\n${'━'.repeat(60)}`);
    console.log(`BATCH ${i}/${n}`);
    console.log('━'.repeat(60));
    const game = await createGame((i - 1) % 3);
    GAME_ID = game.id;
    PLAYERS = game.players.map(p => ({ name: p.name, id: p.id }));
    genCounter = 0;
    cardBlacklist.clear();
    cardPlayCounter.clear();
    spThisGen = {};
    const scores = await main();
    if (scores) allResults.push({ gameNum: i, id: game.id, scores, gens: genCounter });
  }

  // ===== STATISTICS =====
  const names = ['Alpha', 'Beta', 'Gamma'];
  console.log('\n' + '═'.repeat(60));
  console.log(`BATCH COMPLETE — ${allResults.length} games`);
  console.log('═'.repeat(60));

  // Per-player stats
  const stats = {};
  for (const nm of names) {
    const vpList = allResults.map(r => r.scores.find(s => s.name === nm)?.vp ?? 0);
    const wins = allResults.filter(r => {
      const myVP = r.scores.find(s => s.name === nm)?.vp ?? 0;
      return r.scores.every(s => s.name === nm || s.vp <= myVP);
    }).length;
    stats[nm] = { vpList, wins, avg: (vpList.reduce((a,b)=>a+b,0)/vpList.length).toFixed(1), min: Math.min(...vpList), max: Math.max(...vpList) };
  }

  console.log('\nPlayer       Wins  Win%   Avg    Min  Max');
  console.log('─'.repeat(46));
  for (const nm of names) {
    const s = stats[nm];
    const pct = ((s.wins / allResults.length) * 100).toFixed(0);
    console.log(`${nm.padEnd(12)} ${String(s.wins).padStart(4)}  ${String(pct+'%').padStart(4)}  ${String(s.avg).padStart(5)}  ${String(s.min).padStart(3)}  ${s.max}`);
  }

  const avgGens = (allResults.reduce((a,r)=>a+r.gens,0)/allResults.length).toFixed(1);
  console.log(`\nAvg game length: ${avgGens} generations`);

  // VP Breakdown averages (across all players)
  const allScores = allResults.flatMap(r => r.scores);
  const avg = (key) => (allScores.reduce((a,s) => a + (s[key] ?? 0), 0) / allScores.length).toFixed(1);
  console.log(`\nVP Breakdown (avg all players):`);
  console.log(`  TR=${avg('tr')} milestones=${avg('milestones')} awards=${avg('awards')} greenery=${avg('greenery')} city=${avg('city')} cards=${avg('cards')} tableau=${avg('tableau')}`);

  // Per-game summary
  console.log('\n# | Alpha      | Beta       | Gamma      | Winner | Gens');
  console.log('─'.repeat(58));
  for (const r of allResults) {
    const row = names.map(nm => {
      const s = r.scores.find(x => x.name === nm);
      return `${s?.vp??'?'}VP(${s?.corp?.slice(0,8)??'?'})`.padEnd(10);
    });
    const winner = r.scores.reduce((a,b) => a.vp >= b.vp ? a : b).name;
    console.log(`${String(r.gameNum).padStart(1)} | ${row.join(' | ')} | ${winner.padEnd(5)} | ${r.gens}`);
  }
}

if (process.argv[2] === 'new') {
  createGame().then(g => {
    console.log(`\nTo run: update GAME_ID="${g.id}" and PLAYERS in smartbot.js`);
  }).catch(e => console.error('Fatal:', e));
} else if (process.argv[2] === 'batch') {
  const n = parseInt(process.argv[3]) || 5;
  runBatch(n).catch(e => console.error('Fatal:', e));
} else {
  console.log(`Smart Bot v4 | Game: ${GAME_ID}`);
  main().catch(e => console.error('Fatal:', e));
}
