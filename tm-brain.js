// TM_BRAIN — единое аналитическое ядро для Terraforming Mars.
// Isomorphic: работает в Node.js (require) и Browser (window.TM_BRAIN).
// Объединяет логику из smartbot.js и advisor-core.js.

/* eslint-disable */
;(function(root) {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // CARD DATA INJECTION (set from outside)
  // In Node: TM_BRAIN.setCardData(require('./card_tags'), require('./card_vp'))
  // In Browser: mapped from TM_CARD_EFFECTS at init
  // ══════════════════════════════════════════════════════════════

  var _cardTags = {};
  var _cardVP = {};

  function setCardData(cardTags, cardVP) {
    if (cardTags) _cardTags = cardTags;
    if (cardVP) _cardVP = cardVP;
  }

  // ══════════════════════════════════════════════════════════════
  // CARD CATEGORY SETS
  // ══════════════════════════════════════════════════════════════

  var VP_CARDS = new Set([
    'Birds', 'Fish', 'Predators', 'Ants', 'Tardigrades', 'Animals', 'Livestock',
    'Bees', 'Moose', 'Space Whales', 'Pets', 'Small Animals', 'Penguins',
    'Jovian Lanterns', 'Venusian Animals', 'GHG Factories', 'Viral Enhancers',
    'Regolith Eaters', 'Extreme-Cold Fungus', 'Nitrophilic Moss', 'Symbiotic Fungus',
    'Decomposers', 'Wetlands', 'Kelp Farming', 'Cartel', 'Dirigibles',
    'Stratospheric Birds', 'Caretaker Contract', 'Polyphemos',
  ]);

  var ENGINE_CARDS = new Set([
    'Earth Catapult', 'Warp Drive', 'Anti-Gravity Technology', 'AI Central',
    'Research Outpost', 'Martian Rails', 'Interplanetary Trade', 'Business Network',
    'Mars University', 'Olympus Conference', 'Optimal Aerobraking', 'Media Archives',
    'Standard Technology', 'Space Station', 'Toll Station',
  ]);

  var CITY_CARDS = new Set([
    'Capital', 'Noctis City', 'Domed Crater', 'Underground City', 'Open City',
    'Immigrant City', 'Phobos Space Haven', 'Ganymede Colony', 'Luna Metropolis',
    'Urbanized Area', 'Magnetic Field Generators', 'Early Settlement',
    'Self-Sufficient Settlement', 'Stratopolis', 'Martian Zoo', 'Refugee Camps',
    'Cultural Metropolis', 'City',
  ]);

  var PROD_CARDS = new Set([
    'Immigrant City', 'Mining Guild', 'Fuel Synthesis', 'Noctis City',
    'Domed Crater', 'Phobos Space Haven', 'Space Elevator', 'Ironworks',
    'Steelworks', 'Ore Processor', 'Geothermal Power', 'Tropical Resort',
    'Electro Catapult', 'Mohole Area', 'Arctic Algae', 'Windmills',
    'Tundra Farming', 'Open City', 'Underground City', 'Rotator Impacts',
    'Caretaker Contract', 'Hired Raiders', 'Mining Area', 'Mining Rights',
    'Power Supply Consortium', 'Wave Power', 'Mangrove', 'Plantation',
    'Cartel', 'Media Group', 'Sponsors', 'Earth Office', 'Heavy Taxation',
    'Rover Construction', 'Great Dam', 'Magnetic Field Generators',
    'Strip Mine', 'Kelp Farming', 'Livestock', 'Satellites', 'Quantum Extractor',
    'Standard Technology', 'Toll Station', 'Space Station', 'Titan Shuttles',
    'Luna Governor', 'Energy Market', 'Potatoes', 'Moss', 'Snow Algae',
    'Sulphur-Eating Bacteria', 'Venus Soils', 'Thermophiles', 'Corroder Suits',
    'Spin-Inducing Asteroid', 'Water to Venus', 'GHG Import from Venus',
    'Sulfur Exports', 'Venus Governor',
    'Asteroid Mining Consortium', 'Building Industries', 'Insulation',
    'Power Grid', 'Solar Power', 'Energy Tapping', 'Acquired Space Agency',
    'Power Infrastructure', 'Gyropolis', 'Titan Floating Launch-Pad',
    'Productive Outpost', 'Mining Colony',
  ]);

  var DYNAMIC_VP_CARDS = new Set([
    'Birds', 'Fish', 'Predators', 'Livestock', 'Penguins', 'Venusian Animals',
    'Stratospheric Birds',
    'Pets', 'Small Animals', 'Herbivores', 'Ecological Zone', 'Floating Habs',
    'Sub-zero Salt Fish', 'Refugee Camps',
    'Ants', 'Decomposers', 'Tardigrades', 'Extremophiles',
    'Jovian Lanterns', 'Dirigibles',
    'Physics Complex',
    'Ganymede Colony', 'Io Mining Industries', 'Water Import From Europa',
    'Immigration Shuttles', 'Immigrant City',
    'Capital', 'Commercial District', 'Search For Life', 'Security Fleet',
  ]);

  var ANIMAL_VP_CARDS = new Set([
    'Birds', 'Fish', 'Predators', 'Animals', 'Livestock', 'Bees', 'Moose',
    'Penguins', 'Small Animals', 'Space Whales', 'Pets',
  ]);

  var MICROBE_VP_CARDS = new Set([
    'Ants', 'Tardigrades', 'Decomposers', 'Viral Enhancers',
    'Regolith Eaters', 'Extreme-Cold Fungus', 'Nitrophilic Moss', 'Symbiotic Fungus',
    'GHG Factories',
  ]);

  var FLOATER_VP_CARDS = new Set([
    'Jovian Lanterns', 'Dirigibles', 'Stratospheric Birds', 'Venusian Animals',
  ]);

  // ══════════════════════════════════════════════════════════════
  // STATIC DATA
  // ══════════════════════════════════════════════════════════════

  var COLONY_TRADE = {
    Luna:      { res: 'mc',        qty: [1, 2, 4, 7, 10, 13, 17] },
    Callisto:  { res: 'energy',    qty: [0, 2, 3, 5, 7, 10, 13] },
    Ceres:     { res: 'steel',     qty: [1, 2, 3, 4, 6, 8, 10] },
    Enceladus: { res: 'microbes',  qty: [0, 1, 2, 3, 4, 4, 5] },
    Ganymede:  { res: 'plants',    qty: [0, 1, 2, 3, 4, 5, 6] },
    Io:        { res: 'heat',      qty: [2, 3, 4, 6, 8, 10, 13] },
    Miranda:   { res: 'animals',   qty: [0, 1, 1, 2, 2, 3, 3] },
    Pluto:     { res: 'cards',     qty: [0, 1, 2, 2, 3, 3, 4] },
    Titan:     { res: 'floaters',  qty: [0, 1, 1, 2, 3, 3, 4] },
    Triton:    { res: 'titanium',  qty: [0, 1, 1, 2, 3, 4, 5] },
    Leavitt:   { res: 'cards',     qty: [0, 1, 1, 2, 2, 3, 3] },
    Europa:    { res: 'production',qty: [1, 1, 1, 1, 1, 1, 1] },
  };

  var COLONY_BUILD_PRIORITY = [
    'Luna', 'Europa', 'Ganymede', 'Miranda', 'Pluto', 'Leavitt',
    'Titan', 'Enceladus', 'Ceres', 'Triton', 'Callisto', 'Io',
  ];

  var PREF_CORPS = [
    'Interplanetary Cinematics', 'CrediCor', 'Tharsis Republic', 'Vitor',
    'Point Luna', 'Saturn Systems', 'Ecoline', 'Teractor', 'Helion',
    'Inventrix', 'Poseidon', 'Manutech', 'Stormcraft Incorporated',
    'Septum Tribus', 'Pristar', 'Lakefront Resorts', 'Utopia Invest',
    'Terralabs Research',
  ];

  var PREF_PRELUDES = [
    'Great Aquifer', 'Supply Drop', 'Metal-Rich Asteroid', 'UNMI Contractor',
    'Experimental Forest', 'Eccentric Sponsor', 'Metals Company',
    'Aquifer Turbines', 'Allied Banks', 'Research Network',
  ];

  var STATIC_VP = {
    'Interstellar Colony Ship': 4, 'Earth Elevator': 4, 'Declaration of Independence': 4,
    'Advanced Ecosystems': 3, 'Anti-Gravity Technology': 3, 'Phobos Space Haven': 3,
    'Dawn City': 3, 'Maxwell Base': 3, 'Class-action Lawsuit': 3,
    'Asteroid Mining': 2, 'Callisto Penal Mines': 2, 'Earth Catapult': 2,
    'Farming': 2, 'Gene Repair': 2, 'Lake Marineris': 2, 'Large Convoy': 2,
    'Methane From Titan': 2, 'Space Elevator': 2, 'Terraforming Ganymede': 2,
    'Tropical Resort': 2, 'Tundra Farming': 2, 'Pioneer Settlement': 2,
    'Red Spot Observatory': 2, 'Sky Docks': 2, 'Titan Air-scrapping': 2,
    'Warp Drive': 2, 'Public Celebrations': 2, 'Atalanta Planitia Lab': 2,
    'Freyja Biodomes': 2, 'Io Sulphur Research': 2, 'Luna Metropolis': 2,
    'Luxury Foods': 2, 'City Parks': 2, 'Orbital Cleanup': 2, 'Stanford Torus': 2,
    'Sub-Crust Measurements': 2, 'Anti-trust Crackdown': 2, 'Nanofoundry': 2,
    'Neutrinograph': 2, 'Geological Expedition': 2, 'Lunar Embassy': 2,
    'Martian Nature Wonders': 2, 'Nobel Prize': 2, 'L1 Trade Terminal': 2,
    'Venus Allies': 2, 'Breathing Filters': 2, 'Colonizer Training Camp': 2,
    'Adaptation Technology': 1, 'AI Central': 1, 'Artificial Lake': 1,
    'Asteroid Mining Consortium': 1, 'Beam From A Thorium Asteroid': 1,
    'Domed Crater': 1, 'Dust Seals': 1, 'Electro Catapult': 1,
    'Eos Chasma National Park': 1, 'Food Factory': 1, 'Great Dam': 1,
    'Kelp Farming': 1, 'Lagrange Observatory': 1, 'Lightning Harvest': 1,
    'Mangrove': 1, 'Mars University': 1, 'Medical Lab': 1, 'Miranda Resort': 1,
    'Natural Preserve': 1, 'Noctis Farming': 1, 'Olympus Conference': 1,
    'Open City': 1, 'Rad-Suits': 1, 'Research': 1, 'Rover Construction': 1,
    'Shuttles': 1, 'Soil Factory': 1, 'Solar Power': 1, 'Space Station': 1,
    'Tectonic Stress Power': 1, 'Trans-Neptune Probe': 1, 'Trees': 1,
    'Vesta Shipyard': 1, 'Wave Power': 1, 'Windmills': 1, 'Zeppelins': 1,
    'House Printing': 1, 'Martian Survey': 1, 'SF Memorial': 1,
    'Airliners': 1, 'Community Services': 1, 'Cryo-Sleep': 1,
    'Ecology Research': 1, 'Galilean Waystation': 1,
    'Jupiter Floating Station': 1, 'Martian Zoo': 1, 'Molecular Printing': 1,
    'Nitrogen from Titan': 1, 'Quantum Communications': 1, 'Solar Probe': 1,
    'Titan Floating Launch-pad': 1, 'Titan Shuttles': 1,
    'Diaspora Movement': 1, 'Parliament Hall': 1,
    'Aqueduct Systems': 1, 'Carbon Nanosystems': 1, 'Crash Site Cleanup': 1,
    'Cutting Edge Technology': 1, 'Hi-Tech Lab': 1, 'Hospitals': 1,
    'Interplanetary Trade': 1, 'Jovian Embassy': 1, 'Outdoor Sports': 1,
    'Public Baths': 1, 'Public Plans': 1, 'Rego Plastics': 1,
    'Saturn Surfing': 1, 'Solar Logistics': 1, 'Supermarkets': 1,
    'Aerial Mappers': 1, 'Aerosport Tournament': 1, 'Atmoscoop': 1,
    'Solarnet': 1, 'Sponsored Academies': 1, 'Venusian Plants': 1,
    'Venus Waystation': 1, 'Moon Tether': 1, 'Orbital Power Grid': 1,
    'Asteroid Resources': 1, 'Ceres Spaceport': 1, 'Charity Donation': 1,
    'Controlled Bloom': 1, 'Dyson Screens': 1, 'Huygens Observatory': 1,
    'Interplanetary Transport': 1, 'Secret Labs': 1, 'Wetlands': 1,
    'Nuclear Zone': -2, 'Bribed Committee': -2, 'Corporate Stronghold': -2,
    'Biomass Combustors': -1, 'Energy Tapping': -1, 'Flooding': -1,
    'Hackers': -1, 'Heat Trappers': -1, 'Indentured Workers': -1,
    'Aerial Lenses': -1, 'Conscription': -1, 'Heavy Taxation': -1,
  };

  // ══════════════════════════════════════════════════════════════
  // PAYMENT
  // ══════════════════════════════════════════════════════════════

  var PAY_ZERO = {
    heat: 0, megaCredits: 0, steel: 0, titanium: 0, plants: 0,
    microbes: 0, floaters: 0, lunaArchivesScience: 0, spireScience: 0,
    seeds: 0, auroraiData: 0, graphene: 0, kuiperAsteroids: 0
  };

  function smartPay(amount, state, wfOrOpts, tags) {
    var tp = (state && state.thisPlayer) || {};
    var pay = {};
    var k;
    for (k in PAY_ZERO) pay[k] = PAY_ZERO[k];
    var remaining = amount;

    var payOpts = (wfOrOpts && wfOrOpts.paymentOptions) || wfOrOpts || {};
    var wfRes = wfOrOpts || {};

    // Use steel/titanium for cards with matching tags
    if (tags) {
      if (tags.indexOf('building') >= 0 && (tp.steel || 0) > 0) {
        var steelVal = tp.steelValue || 2;
        var steelUse = Math.min(tp.steel, Math.ceil(remaining / steelVal));
        pay.steel = steelUse;
        remaining = Math.max(0, remaining - steelUse * steelVal);
      }
      if (tags.indexOf('space') >= 0 && (tp.titanium || 0) > 0) {
        var tiVal = tp.titaniumValue || 3;
        var tiUse = Math.min(tp.titanium, Math.ceil(remaining / tiVal));
        pay.titanium = tiUse;
        remaining = Math.max(0, remaining - tiUse * tiVal);
      }
    }

    // Use alt resources (highest value first)
    var altRes = [
      { key: 'seeds', val: 5 },
      { key: 'graphene', val: 4 },
      { key: 'auroraiData', val: 3 },
      { key: 'floaters', val: 3 },
      { key: 'titanium', val: 3 },
      { key: 'microbes', val: 2 },
      { key: 'spireScience', val: 2 },
      { key: 'steel', val: 2 },
      { key: 'heat', val: 1 },
      { key: 'lunaArchivesScience', val: 1 },
      { key: 'kuiperAsteroids', val: 1 },
    ];

    for (var ai = 0; ai < altRes.length; ai++) {
      if (remaining <= 0) break;
      var alt = altRes[ai];
      var resourceAllowed = false;
      switch (alt.key) {
        case 'heat':               resourceAllowed = !!payOpts.heat; break;
        case 'titanium':           resourceAllowed = !!(payOpts.lunaTradeFederationTitanium || payOpts.titanium); break;
        case 'microbes':           resourceAllowed = !!(payOpts.microbes || (tags && tags.indexOf('plant') >= 0)); break;
        case 'seeds':              resourceAllowed = !!(payOpts.seeds || (tags && tags.indexOf('plant') >= 0)); break;
        case 'floaters':           resourceAllowed = !!(payOpts.floaters || (tags && tags.indexOf('venus') >= 0)); break;
        case 'graphene':           resourceAllowed = !!(payOpts.graphene || (tags && (tags.indexOf('city') >= 0 || tags.indexOf('space') >= 0))); break;
        case 'lunaArchivesScience':resourceAllowed = !!(payOpts.lunaArchivesScience || (tags && tags.indexOf('moon') >= 0)); break;
        default:                   resourceAllowed = !!payOpts[alt.key]; break;
      }
      if (!resourceAllowed) continue;
      if (pay[alt.key] > 0) continue;
      var available = wfRes[alt.key] || tp[alt.key] || 0;
      if (available <= 0) continue;
      var use = Math.min(available, Math.ceil(remaining / alt.val));
      pay[alt.key] = use;
      remaining = Math.max(0, remaining - use * alt.val);
    }

    pay.megaCredits = Math.max(0, Math.min(remaining, tp.megaCredits || 0));
    return pay;
  }

  // ══════════════════════════════════════════════════════════════
  // CORE ANALYTICS
  // ══════════════════════════════════════════════════════════════

  function remainingSteps(state) {
    var g = (state && state.game) || {};
    var temp   = typeof g.temperature  === 'number' ? g.temperature  : -30;
    var o2     = typeof g.oxygenLevel  === 'number' ? g.oxygenLevel  : 0;
    var oceans = typeof g.oceans       === 'number' ? g.oceans       : 0;
    var tempSteps  = Math.max(0, Math.round((8 - temp) / 2));
    var oxySteps   = Math.max(0, 14 - o2);
    var oceanSteps = Math.max(0, 9 - oceans);
    return tempSteps + oxySteps + oceanSteps;
  }

  function vpLead(state) {
    // Use victoryPointsBreakdown.total if available (smartbot context — more accurate)
    var tp = (state && state.thisPlayer) || {};
    var myVP = tp.victoryPointsBreakdown && tp.victoryPointsBreakdown.total;
    if (myVP !== undefined && myVP !== null) {
      var myColor = tp.color;
      var players = (state && state.players) || [];
      var maxOppVP = 0;
      for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (p.color === myColor) continue;
        var oppVP = (p.victoryPointsBreakdown && p.victoryPointsBreakdown.total) || 0;
        if (oppVP > maxOppVP) maxOppVP = oppVP;
      }
      return myVP - maxOppVP;
    }
    // Fallback: TR-based (advisor/browser context)
    if (!state || !tp || !state.players) return 0;
    var myTR = tp.terraformRating || 0;
    var bestOpp = 0;
    for (var j = 0; j < state.players.length; j++) {
      var pl = state.players[j];
      if (pl.color === tp.color) continue;
      var oppTR = pl.terraformRating || 0;
      if (oppTR > bestOpp) bestOpp = oppTR;
    }
    return myTR - bestOpp;
  }

  function shouldPushGlobe(state) {
    var gen = (state && state.game && state.game.generation) || 5;
    if (gen >= 20) return true;

    var steps = remainingSteps(state);
    if (steps > 8) return true;

    var lead = vpLead(state);
    if (steps > 4) return lead >= -5;
    return lead >= 0;
  }

  function isRedsRuling(state) {
    return state && state.game && state.game.turmoil && state.game.turmoil.ruling === 'Reds';
  }

  function scoreColonyTrade(colony, state) {
    var name = colony.name || colony;
    var pos = colony.trackPosition != null ? colony.trackPosition : 3;
    var tp = (state && state.thisPlayer) || {};
    var tableau = tp.tableau || [];
    var tableauNames = new Set(tableau.map(function(c) { return c.name || c; }));

    var data = COLONY_TRADE[name];
    if (!data) return pos;

    var qty = data.qty[Math.min(pos, data.qty.length - 1)];

    var mcPerUnit;
    switch (data.res) {
      case 'mc':         mcPerUnit = 1; break;
      case 'steel':      mcPerUnit = tp.steelValue || 2; break;
      case 'titanium':   mcPerUnit = tp.titaniumValue || 3; break;
      case 'cards':      mcPerUnit = tp.cardCost || 3; break;
      case 'plants':     mcPerUnit = 1.5; break;
      case 'energy':     mcPerUnit = 0.6; break;
      case 'heat':       mcPerUnit = 0.4; break;
      case 'production': mcPerUnit = 8; break;
      case 'animals':
        mcPerUnit = hasVPCard(tableauNames, ANIMAL_VP_CARDS) ? 5 : 1; break;
      case 'microbes':
        mcPerUnit = hasVPCard(tableauNames, MICROBE_VP_CARDS) ? 2.5 : 0.5; break;
      case 'floaters':
        mcPerUnit = hasVPCard(tableauNames, FLOATER_VP_CARDS) ? 3 : 0.5; break;
      default: mcPerUnit = 1;
    }

    return qty * mcPerUnit;
  }

  function hasVPCard(tableauNames, vpSet) {
    var arr = [];
    vpSet.forEach(function(c) { arr.push(c); });
    for (var i = 0; i < arr.length; i++) {
      if (tableauNames.has(arr[i])) return true;
    }
    return false;
  }

  // ══════════════════════════════════════════════════════════════
  // CARD SCORING (full version from smartbot)
  // ══════════════════════════════════════════════════════════════

  function scoreCard(card, state) {
    var cost = card.calculatedCost != null ? card.calculatedCost : (card.cost || 0);
    var name = card.name || '';
    var gen = (state && state.game && state.game.generation) || 5;
    var steps = remainingSteps(state);
    var gensLeft = Math.max(1, Math.ceil(steps / 4));
    var tags = _cardTags[name] || card.tags || [];
    var tp = (state && state.thisPlayer) || {};
    var myTags = tp.tags || {};
    var score = 0;

    var early = gen <= 4;
    var mid = gen >= 5 && gen <= 8;
    var late = gen >= 9;

    // === VP SCORING ===
    var staticVP = STATIC_VP[name] || 0;
    if (staticVP > 0) {
      var vpMult = early ? 4 : (mid ? 5 : 7);
      score += staticVP * vpMult;
    }
    if (staticVP < 0) score += staticVP * 3;

    if (DYNAMIC_VP_CARDS.has(name)) {
      score += early ? 25 : (mid ? 12 : (gensLeft >= 2 ? 5 : 0));
    } else if (VP_CARDS.has(name)) {
      score += early ? 18 : (mid ? 10 : (gensLeft >= 2 ? 4 : 0));
    }

    // CARD_VP fallback
    var vpData = _cardVP[name];
    if (vpData && staticVP === 0 && !DYNAMIC_VP_CARDS.has(name) && !VP_CARDS.has(name)) {
      if (vpData.type === 'static' && vpData.vp > 0) {
        score += vpData.vp * (early ? 4 : (mid ? 5 : 7));
      } else if (vpData.type === 'static' && vpData.vp < 0) {
        score += vpData.vp * 3;
      } else if (vpData.type === 'per_resource' && vpData.per === 1) {
        score += early ? 18 : (mid ? 8 : 3);
      } else if (vpData.type === 'per_resource') {
        score += early ? 5 : 2;
      } else if (vpData.type === 'special') {
        score += early ? 8 : (mid ? 5 : 3);
      }
    }

    // === PRODUCTION ===
    if (PROD_CARDS.has(name)) {
      score += early ? 15 : (mid ? 7 : 2);
    }

    // === ENGINE ===
    if (ENGINE_CARDS.has(name)) {
      score += early ? 18 : (mid ? 8 : 2);
    }

    // === CITIES ===
    if (CITY_CARDS.has(name)) {
      score += early ? 12 : (mid ? 9 : 6);
    }

    // === TAG-BASED SCORING ===
    var hasBuilding = tags.indexOf('building') >= 0;
    var hasSpace = tags.indexOf('space') >= 0;
    if (hasBuilding && (tp.steel || 0) > 0) {
      var steelSaving = Math.min(tp.steel, Math.ceil(cost / (tp.steelValue || 2))) * (tp.steelValue || 2);
      score += Math.min(steelSaving, cost) * 0.5;
    }
    if (hasSpace && (tp.titanium || 0) > 0) {
      var titSaving = Math.min(tp.titanium, Math.ceil(cost / (tp.titaniumValue || 3))) * (tp.titaniumValue || 3);
      score += Math.min(titSaving, cost) * 0.5;
    }

    var isEvent = tags.indexOf('event') >= 0;

    if (!isEvent) {
      for (var ti = 0; ti < tags.length; ti++) {
        var tag = tags[ti];
        var count = myTags[tag] || 0;
        if (count >= 3) score += 3;
        else if (count >= 1) score += 1;
      }
      if (tags.indexOf('science') >= 0) score += early ? 3 : 1;
      if (tags.indexOf('jovian') >= 0) score += 2;
      if (tags.indexOf('venus') >= 0) score += 1;
      if (tags.indexOf('plant') >= 0) score += early ? 4 : (mid ? 2 : 1);
    }

    // === CORPORATION SYNERGY ===
    var corp = (tp.tableau && tp.tableau[0] && (tp.tableau[0].name || tp.tableau[0])) || '';
    if (corp) {
      if (corp === 'Saturn Systems' && tags.indexOf('jovian') >= 0) score += early ? 10 : 5;
      if (corp === 'Arklight') {
        if (tags.indexOf('animal') >= 0) score += 5;
        if (tags.indexOf('plant') >= 0) score += 3;
      }
      if (corp === 'Teractor' && tags.indexOf('earth') >= 0) score += 4;
      if (corp === 'Interplanetary Cinematics' && isEvent) score += 5;
      if (corp === 'Point Luna' && tags.indexOf('earth') >= 0) score += early ? 6 : 3;
      if (corp === 'Manutech' && PROD_CARDS.has(name)) score += early ? 5 : 2;
      if (corp === 'Stormcraft Incorporated') {
        if (tags.indexOf('jovian') >= 0) score += 3;
        if (FLOATER_VP_CARDS.has(name)) score += 5;
      }
      if (corp === 'Polyphemos' && (DYNAMIC_VP_CARDS.has(name) || VP_CARDS.has(name))) score += 4;
      if (corp === 'Mining Guild' && hasBuilding) score += 2;
      if (corp === 'Ecoline' && (name.toLowerCase().indexOf('plant') >= 0 || tags.indexOf('plant') >= 0)) score += 3;
      if (corp === 'CrediCor' && cost >= 20) score += 4;
      if (corp === 'Thorgate' && tags.indexOf('power') >= 0) score += 4;
      if (corp === 'Poseidon' && name.toLowerCase().indexOf('colon') >= 0) score += 5;
    }

    // === COST EFFICIENCY ===
    if (cost <= 5) score += 5;
    else if (cost <= 10) score += 3;
    else if (cost <= 18) score += 0;
    else if (cost <= 25) score -= 2;
    else score -= 5;

    // Unknown cards fallback
    var isKnown = !!vpData || staticVP !== 0 || DYNAMIC_VP_CARDS.has(name) || VP_CARDS.has(name)
      || PROD_CARDS.has(name) || ENGINE_CARDS.has(name) || CITY_CARDS.has(name);
    if (!isKnown) {
      if (tags.length === 0) {
        score += cost <= 8 ? 2 : (cost <= 15 ? 0 : -3);
      } else {
        score += cost <= 10 ? 3 : (cost <= 18 ? 1 : -2);
      }
    }

    return score;
  }

  // ══════════════════════════════════════════════════════════════
  // ENDGAME TIMING DASHBOARD
  // ══════════════════════════════════════════════════════════════

  function endgameTiming(state) {
    var steps = remainingSteps(state);
    var gen = (state && state.game && state.game.generation) || 1;

    var ratePerGen = 4;
    if (state && state.players) {
      var totalPlayers = state.players.length || 3;
      ratePerGen = Math.max(3, Math.min(6, totalPlayers + 1));
    }

    var estimatedGens = steps > 0 ? Math.ceil(steps / ratePerGen) : 0;

    var dangerZone;
    if (estimatedGens <= 1) dangerZone = 'red';
    else if (estimatedGens <= 2) dangerZone = 'yellow';
    else dangerZone = 'green';

    var g = (state && state.game) || {};
    var breakdown = {
      temp: typeof g.temperature === 'number' ? g.temperature : -30,
      tempSteps: Math.max(0, Math.round((8 - (g.temperature || -30)) / 2)),
      oxy: typeof g.oxygenLevel === 'number' ? g.oxygenLevel : 0,
      oxySteps: Math.max(0, 14 - (g.oxygenLevel || 0)),
      oceans: typeof g.oceans === 'number' ? g.oceans : 0,
      oceanSteps: Math.max(0, 9 - (g.oceans || 0)),
    };

    return {
      steps: steps,
      estimatedGens: estimatedGens,
      dangerZone: dangerZone,
      shouldPush: shouldPushGlobe(state),
      vpLead: vpLead(state),
      breakdown: breakdown,
      generation: gen,
    };
  }

  // ══════════════════════════════════════════════════════════════
  // HAND CARD RANKING (uses full scoreCard)
  // ══════════════════════════════════════════════════════════════

  function rankHandCards(cards, state) {
    if (!cards || cards.length === 0) return [];
    var tp = (state && state.thisPlayer) || {};
    var mc = tp.megaCredits || 0;
    var steel = tp.steel || 0;
    var titanium = tp.titanium || 0;
    var steps = remainingSteps(state);

    var results = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var name = card.name || '';
      var cost = card.calculatedCost != null ? card.calculatedCost : (card.cost || 0);
      var tags = _cardTags[name] || card.tags || [];

      var score = scoreCard(card, state);

      // Affordability penalty
      var buyingPower = mc;
      if (tags.indexOf('building') >= 0) buyingPower += steel * (tp.steelValue || 2);
      if (tags.indexOf('space') >= 0) buyingPower += titanium * (tp.titaniumValue || 3);
      if (buyingPower < cost) {
        score -= 10;
      }

      // Blend with overlay rating if available (browser only)
      if (typeof TM_RATINGS !== 'undefined' && TM_RATINGS[name]) {
        var baseScore = TM_RATINGS[name].s || 50;
        score = Math.round((score + baseScore) / 2);
      }

      var reason = '';
      if (DYNAMIC_VP_CARDS.has(name) || VP_CARDS.has(name)) reason = 'VP';
      if (ENGINE_CARDS.has(name)) reason = reason ? reason + '+Engine' : 'Engine';
      if (PROD_CARDS.has(name)) reason = reason ? reason + '+Prod' : 'Prod';
      if (CITY_CARDS.has(name)) reason = reason ? reason + '+City' : 'City';
      if (buyingPower < cost) reason += ' [\u043d\u0435\u0442 MC]';
      if (!reason) reason = 'base';

      var stars = score >= 30 ? 3 : (score >= 15 ? 2 : 1);

      results.push({ name: name, score: score, stars: stars, reason: reason, cost: cost });
    }

    results.sort(function(a, b) { return b.score - a.score; });
    return results;
  }

  // ══════════════════════════════════════════════════════════════
  // PASS ANALYSIS
  // ══════════════════════════════════════════════════════════════

  function analyzePass(state) {
    var tp = (state && state.thisPlayer) || {};
    var mc = tp.megaCredits || 0;
    var heat = tp.heat || 0;
    var plants = tp.plants || 0;
    var steps = remainingSteps(state);
    var gen = (state && state.game && state.game.generation) || 5;

    var canGreenery = plants >= 8;
    var canHeatTR = heat >= 8 && steps > 0;
    var canAffordAction = mc >= 10;
    var cardsInHand = tp.cardsInHandNbr || (tp.cardsInHand ? tp.cardsInHand.length : 0);

    if (steps <= 4 && !canGreenery && !canHeatTR && mc < 15) {
      return { shouldPass: true, confidence: 'high', reason: '\u042d\u043d\u0434\u0433\u0435\u0439\u043c, \u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432 \u043c\u0430\u043b\u043e' };
    }

    if (gen <= 4 && (canAffordAction || cardsInHand > 0)) {
      return { shouldPass: false, confidence: 'high', reason: '\u0420\u0430\u043d\u043d\u044f\u044f \u0438\u0433\u0440\u0430, \u0435\u0441\u0442\u044c \u0447\u0442\u043e \u0434\u0435\u043b\u0430\u0442\u044c' };
    }

    if (mc < 5 && !canGreenery && !canHeatTR && cardsInHand <= 1) {
      return { shouldPass: true, confidence: 'medium', reason: '\u041c\u0430\u043b\u043e MC, \u043d\u0435\u0442 \u043a\u043e\u043d\u0432\u0435\u0440\u0441\u0438\u0439' };
    }

    return { shouldPass: false, confidence: 'low', reason: '\u0415\u0441\u0442\u044c \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f' };
  }

  // ══════════════════════════════════════════════════════════════
  // ACTION ANALYSIS
  // ══════════════════════════════════════════════════════════════

  function analyzeActions(waitingFor, state) {
    if (!waitingFor) return [];

    var tp = (state && state.thisPlayer) || {};
    var mc = tp.megaCredits || 0;
    var heat = tp.heat || 0;
    var plants = tp.plants || 0;
    var steps = remainingSteps(state);
    var endgame = steps <= 8;
    var redsTax = isRedsRuling(state) ? 3 : 0;
    var results = [];

    var options = [];
    if (waitingFor.type === 'or' && waitingFor.options) {
      options = waitingFor.options;
    }

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var title = (opt.title || opt.buttonLabel || '');
      var titleLow = title.toLowerCase();
      var score = 50;
      var reason = '';
      var emoji = '\ud83d\udcca';

      if (titleLow.indexOf('greenery') >= 0 || (titleLow.indexOf('convert') >= 0 && titleLow.indexOf('plant') >= 0)) {
        if (plants >= 8 && steps > 0) {
          score = endgame ? 95 : 80;
          emoji = '\ud83c\udf3f';
          reason = '\u041e\u0437\u0435\u043b\u0435\u043d\u0435\u043d\u0438\u0435 = TR + VP';
        } else {
          score = 30;
          emoji = '\ud83c\udf3f';
          reason = '\u041c\u0430\u043b\u043e \u0440\u0430\u0441\u0442\u0435\u043d\u0438\u0439';
        }
      }
      else if (titleLow.indexOf('heat') >= 0 || (titleLow.indexOf('temperature') >= 0 && titleLow.indexOf('convert') >= 0)) {
        if (heat >= 8 && steps > 0) {
          score = endgame ? 90 : 75;
          emoji = '\ud83d\udd25';
          reason = '\u0422\u0435\u043f\u043b\u043e \u2192 TR';
        } else {
          score = 25;
          emoji = '\ud83d\udd25';
          reason = '\u041c\u0430\u043b\u043e \u0442\u0435\u043f\u043b\u0430';
        }
      }
      else if (titleLow.indexOf('standard project') >= 0 || (titleLow.indexOf('sell') >= 0 && titleLow.indexOf('patent') >= 0)) {
        score = endgame ? 60 : 45;
        emoji = '\ud83c\udfd7\ufe0f';
        reason = '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442';
      }
      else if ((titleLow.indexOf('play') >= 0 && titleLow.indexOf('card') >= 0) || titleLow.indexOf('project card') >= 0) {
        score = endgame ? 55 : 70;
        emoji = '\ud83c\udccf';
        reason = endgame ? '\u041a\u0430\u0440\u0442\u0430 (\u043f\u043e\u0437\u0434\u043d\u043e)' : '\u041a\u0430\u0440\u0442\u0430';
      }
      else if (titleLow.indexOf('action') >= 0 || titleLow.indexOf('use') >= 0) {
        score = endgame ? 70 : 65;
        emoji = '\u26a1';
        reason = '\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043a\u0430\u0440\u0442\u044b';
      }
      else if (titleLow.indexOf('trade') >= 0) {
        score = endgame ? 40 : 65;
        emoji = '\ud83d\udea2';
        reason = endgame ? '\u0422\u043e\u0440\u0433\u043e\u0432\u043b\u044f (\u043f\u043e\u0437\u0434\u043d\u043e)' : '\u0422\u043e\u0440\u0433\u043e\u0432\u043b\u044f';
      }
      else if (titleLow.indexOf('pass') >= 0 || titleLow.indexOf('end turn') >= 0 || titleLow.indexOf('skip') >= 0 || titleLow.indexOf('do nothing') >= 0) {
        var passAnalysis = analyzePass(state);
        score = passAnalysis.shouldPass ? 70 : 20;
        emoji = '\u23f8\ufe0f';
        reason = passAnalysis.reason;
      }
      else if (titleLow.indexOf('delegate') >= 0) {
        score = endgame ? 65 : 55;
        emoji = '\ud83c\udfe6';
        reason = '\u0414\u0435\u043b\u0435\u0433\u0430\u0442';
      }
      else if (titleLow.indexOf('milestone') >= 0 || titleLow.indexOf('claim') >= 0) {
        score = 85;
        emoji = '\ud83c\udfc6';
        reason = '\u0412\u0435\u0445\u0430!';
      }
      else if (titleLow.indexOf('award') >= 0 || titleLow.indexOf('fund') >= 0) {
        score = 60;
        emoji = '\ud83c\udfc5';
        reason = '\u041d\u0430\u0433\u0440\u0430\u0434\u0430';
      }
      else if (titleLow.indexOf('colony') >= 0 || titleLow.indexOf('build') >= 0) {
        score = endgame ? 35 : 60;
        emoji = '\ud83c\udf0d';
        reason = '\u041a\u043e\u043b\u043e\u043d\u0438\u044f';
      }
      else if (titleLow.indexOf('sell') >= 0) {
        score = endgame ? 50 : 30;
        emoji = '\ud83d\udcb0';
        reason = '\u041f\u0440\u043e\u0434\u0430\u0436\u0430 \u043a\u0430\u0440\u0442';
      }

      if (redsTax > 0 && (titleLow.indexOf('greenery') >= 0 || titleLow.indexOf('temperature') >= 0 || titleLow.indexOf('ocean') >= 0)) {
        score -= 10;
        reason += ' [Reds \u22123MC]';
      }

      results.push({
        action: opt.title || opt.buttonLabel || 'Option ' + (i + 1),
        score: score,
        reason: reason || '\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435',
        emoji: emoji,
        index: i,
      });
    }

    results.sort(function(a, b) { return b.score - a.score; });
    return results;
  }

  // ══════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════

  var TM_BRAIN = {
    // Data injection
    setCardData: setCardData,

    // Card category sets
    VP_CARDS: VP_CARDS,
    ENGINE_CARDS: ENGINE_CARDS,
    CITY_CARDS: CITY_CARDS,
    PROD_CARDS: PROD_CARDS,
    DYNAMIC_VP_CARDS: DYNAMIC_VP_CARDS,
    ANIMAL_VP_CARDS: ANIMAL_VP_CARDS,
    MICROBE_VP_CARDS: MICROBE_VP_CARDS,
    FLOATER_VP_CARDS: FLOATER_VP_CARDS,

    // Static data
    COLONY_TRADE: COLONY_TRADE,
    COLONY_BUILD_PRIORITY: COLONY_BUILD_PRIORITY,
    PREF_CORPS: PREF_CORPS,
    PREF_PRELUDES: PREF_PRELUDES,
    STATIC_VP: STATIC_VP,
    PAY_ZERO: PAY_ZERO,

    // Core analytics
    remainingSteps: remainingSteps,
    vpLead: vpLead,
    shouldPushGlobe: shouldPushGlobe,
    isRedsRuling: isRedsRuling,
    scoreColonyTrade: scoreColonyTrade,
    scoreCard: scoreCard,
    smartPay: smartPay,

    // Dashboard & advisor
    endgameTiming: endgameTiming,
    rankHandCards: rankHandCards,
    analyzePass: analyzePass,
    analyzeActions: analyzeActions,
  };

  // Auto-init from TM_CARD_EFFECTS in browser context
  if (typeof module === 'undefined' && typeof root.TM_CARD_EFFECTS !== 'undefined') {
    var effects = root.TM_CARD_EFFECTS;
    var autoVP = {};
    for (var cardName in effects) {
      var e = effects[cardName];
      if (e.vpAcc || e.vpPer) {
        autoVP[cardName] = { type: 'per_resource', per: e.vpPer || 2 };
      } else if (typeof e.vp === 'number' && e.vp !== 0) {
        autoVP[cardName] = { type: 'static', vp: e.vp };
      }
    }
    setCardData(null, autoVP);
  }

  // UMD export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TM_BRAIN;
  } else {
    root.TM_BRAIN = TM_BRAIN;
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
