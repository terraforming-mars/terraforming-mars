import {MilestoneName} from '../../common/ma/MilestoneName';
import {AwardName} from '../../common/ma/AwardName';

/**
 * Context provided to milestone/award evaluation functions for MarsBot.
 */
export type MarsBotMAContext = {
  trackPos: (trackIndex: number) => number;
  allTrackPositions: () => ReadonlyArray<number>;
  tr: number;
  mc: number;
  cityCount: number;
  greeneryCount: number;
  oceanCount: number;
  tilesOwned: number;
  tilesAdjacentToOcean: number;
  tilesOnEdge: number;
  tilesNotAdjacentToOcean: number;
  playedCards: {
    total: number;
    green: number;
    blue: number;
    red: number;
    greenOrBlue: number;
    withoutTags: number;
    costing20Plus: number;
    costing10OrLess: number;
    withNonNegativeVP: number;
    withRequirements: number;
  };
  destroyedBonusCards: number;
  temperatureRaises: number;
  highestTrackPos: number;
  lowestTrackPos: number;
  tracksAtOrAbove: (pos: number) => number;
  largestConnectedTileGroup: number;
  specialTilesOwned: number;
  hasVenus: boolean;
  venusTrackPos: number;
  floaterCount: number;
}

function allTracksAtOrAbove(ctx: MarsBotMAContext, pos: number, includeVenus: boolean): boolean {
  for (let t = 0; t < 7; t++) {
    if (ctx.trackPos(t) < pos) {
      return false;
    }
  }
  if (includeVenus && ctx.hasVenus && ctx.venusTrackPos < pos) {
    return false;
  }
  return true;
}

function tracksAtOrAboveCount(ctx: MarsBotMAContext, pos: number): number {
  let count = 0;
  for (let t = 0; t < 7; t++) {
    if (ctx.trackPos(t) >= pos) {
      count++;
    }
  }
  if (ctx.hasVenus && ctx.venusTrackPos >= pos) {
    count++;
  }
  return count;
}

function anyTrackAtOrAbove(ctx: MarsBotMAContext, pos: number): boolean {
  for (let t = 0; t < 7; t++) {
    if (ctx.trackPos(t) >= pos) {
      return true;
    }
  }
  if (ctx.hasVenus && ctx.venusTrackPos >= pos) {
    return true;
  }
  return false;
}

function topThreeTracksSum(ctx: MarsBotMAContext): number {
  const positions: Array<number> = [];
  for (let t = 0; t < 7; t++) {
    positions.push(ctx.trackPos(t));
  }
  positions.sort((a, b) => b - a);
  return positions[0] + positions[1] + positions[2];
}

/**
 * Milestone evaluation functions for MarsBot.
 * Returns true if MarsBot qualifies, false if not, undefined for fallback to default game evaluation.
 */
type MilestoneEval = (ctx: MarsBotMAContext) => boolean | undefined;
export const MILESTONE_EVALS = new Map<MilestoneName, MilestoneEval>([
  // Tharsis
  ['Terraformer', (ctx: MarsBotMAContext) => ctx.tr >= 35],
  ['Mayor', (ctx: MarsBotMAContext) => ctx.cityCount >= 3],
  ['Gardener', (ctx: MarsBotMAContext) => ctx.greeneryCount >= 3],
  ['Builder', (ctx: MarsBotMAContext) => ctx.trackPos(0) >= 8],
  ['Planner', (ctx: MarsBotMAContext) => allTracksAtOrAbove(ctx, 4, false)],
  // Hellas
  ['Diversifier', (ctx: MarsBotMAContext) => {
    if (!ctx.hasVenus) {
      return allTracksAtOrAbove(ctx, 3, false);
    }
    // With Venus: 7 of 8 tracks at 3+ (Venus can substitute one other track)
    return tracksAtOrAboveCount(ctx, 3) >= 7;
  }],
  ['Tactician', (ctx: MarsBotMAContext) => ctx.mc >= 35],
  ['Polar Explorer', () => undefined],
  ['Energizer', (ctx: MarsBotMAContext) => ctx.trackPos(4) >= 6],
  ['Rim Settler', (ctx: MarsBotMAContext) => ctx.trackPos(1) >= 6 && ctx.trackPos(3) >= 6],
  // Elysium
  ['Generalist', (ctx: MarsBotMAContext) => allTracksAtOrAbove(ctx, 2, false)],
  ['Specialist', (ctx: MarsBotMAContext) => anyTrackAtOrAbove(ctx, 10)],
  ['Ecologist', (ctx: MarsBotMAContext) => ctx.trackPos(6) >= 4],
  ['Tycoon', (ctx: MarsBotMAContext) => ctx.playedCards.greenOrBlue >= 15],
  ['Legend', (ctx: MarsBotMAContext) => ctx.playedCards.red >= 5],
  // Terra Cimmeria Nova
  ['Architect', (ctx: MarsBotMAContext) => ctx.trackPos(3) >= 6],
  ['Coastguard', (ctx: MarsBotMAContext) => ctx.tilesAdjacentToOcean >= 4],
  ['C. Forester', (ctx: MarsBotMAContext) => ctx.trackPos(6) >= 10],
  // Vastitas Borealis Nova
  ['Agronomist', (ctx: MarsBotMAContext) => ctx.trackPos(6) >= 4 && ctx.trackPos(3) >= 4],
  ['Engineer', (ctx: MarsBotMAContext) => ctx.trackPos(4) + ctx.trackPos(3) >= 10],
  ['V. Spacefarer', (ctx: MarsBotMAContext) => ctx.trackPos(1) >= 5],
  ['Geologist', () => undefined],
  ['Farmer', (ctx: MarsBotMAContext) => (ctx.trackPos(3) >= 6 && ctx.trackPos(2) >= 6) || (ctx.trackPos(6) >= 6 && ctx.trackPos(3) >= 6)],
  // Modular
  ['Briber', (ctx: MarsBotMAContext) => ctx.mc >= 20],
  ['Builder7', (ctx: MarsBotMAContext) => ctx.trackPos(0) >= 7],
  ['Forester', (ctx: MarsBotMAContext) => ctx.trackPos(6) >= 6],
  ['Fundraiser', (ctx: MarsBotMAContext) => ctx.trackPos(4) >= 8],
  ['Hydrologist', (ctx: MarsBotMAContext) => ctx.oceanCount >= 4],
  ['Landshaper', (ctx: MarsBotMAContext) => ctx.cityCount >= 1 && ctx.greeneryCount >= 1 && ctx.trackPos(0) >= 5],
  ['Legend4', (ctx: MarsBotMAContext) => ctx.playedCards.red >= 4],
  ['Lobbyist', () => false],
  ['Merchant', (ctx: MarsBotMAContext) => allTracksAtOrAbove(ctx, 2, false)],
  ['Metallurgist', (ctx: MarsBotMAContext) => ctx.trackPos(0) + ctx.trackPos(1) >= 9],
  ['Philantropist', (ctx: MarsBotMAContext) => ctx.playedCards.withNonNegativeVP >= 5],
  ['Pioneer4', () => undefined],
  ['Planetologist', () => false],
  ['Producer', (ctx: MarsBotMAContext) => topThreeTracksSum(ctx) >= 16],
  ['Researcher', (ctx: MarsBotMAContext) => ctx.trackPos(3) >= 4],
  ['Spacefarer4', (ctx: MarsBotMAContext) => ctx.trackPos(1) >= 4],
  ['Sponsor', (ctx: MarsBotMAContext) => ctx.playedCards.costing20Plus >= 3],
  ['Tactician4', (ctx: MarsBotMAContext) => ctx.mc >= 30],
  ['Terraformer29', () => false],
  ['Terran5', (ctx: MarsBotMAContext) => ctx.trackPos(5) >= 5],
  ['Thawer', (ctx: MarsBotMAContext) => ctx.temperatureRaises >= 5],
  ['Hoverlord', (ctx: MarsBotMAContext) => ctx.floaterCount >= 7],
  ['Trader', () => false],
  ['Tycoon10', (ctx: MarsBotMAContext) => ctx.playedCards.greenOrBlue >= 10],
]);

/**
 * Award evaluation functions for MarsBot.
 * Returns the numeric score, or undefined for fallback to default game evaluation.
 */
type AwardEval = (ctx: MarsBotMAContext) => number | undefined;
export const AWARD_EVALS = new Map<AwardName, AwardEval>([
  // Tharsis
  ['Landlord', (ctx: MarsBotMAContext) => ctx.tilesOwned],
  ['Banker', (ctx: MarsBotMAContext) => ctx.trackPos(0) + ctx.trackPos(2)],
  ['Scientist', (ctx: MarsBotMAContext) => ctx.trackPos(3)],
  ['Thermalist', (ctx: MarsBotMAContext) => ctx.trackPos(4) + 5],
  ['Miner', (ctx: MarsBotMAContext) => ctx.trackPos(1) + 5],
  // Hellas
  ['Cultivator', () => undefined],
  ['Magnate', (ctx: MarsBotMAContext) => ctx.playedCards.green],
  ['Space Baron', (ctx: MarsBotMAContext) => ctx.trackPos(1)],
  ['Excentric', (ctx: MarsBotMAContext) => Math.floor(ctx.mc / 5)],
  ['Contractor', (ctx: MarsBotMAContext) => ctx.trackPos(0)],
  // Elysium
  ['Celebrity', (ctx: MarsBotMAContext) => ctx.playedCards.costing20Plus],
  ['Industrialist', (ctx: MarsBotMAContext) => ctx.trackPos(4) + 5],
  ['Desert Settler', () => undefined],
  ['Estate Dealer', () => undefined],
  ['Benefactor', (ctx: MarsBotMAContext) => Math.max(0, ctx.tr - 15)],
  // Terra Cimmeria
  ['Electrician', (ctx: MarsBotMAContext) => ctx.trackPos(4)],
  ['Founder', () => undefined],
  ['Mogul', (ctx: MarsBotMAContext) => ctx.highestTrackPos * 2],
  ['Zoologist', (ctx: MarsBotMAContext) => ctx.trackPos(6) + 5],
  ['Forecaster', (ctx: MarsBotMAContext) => Math.floor(ctx.mc / 7)],
  // Utopia Planitia
  ['Suburbian', () => undefined],
  ['Investor', (ctx: MarsBotMAContext) => ctx.trackPos(0) + ctx.trackPos(3)],
  ['Botanist', (ctx: MarsBotMAContext) => Math.max(0, ctx.trackPos(6) - 2)],
  ['Incorporator', (ctx: MarsBotMAContext) => ctx.playedCards.costing10OrLess],
  ['Metropolist', () => undefined],
  // Vastitas Borealis Nova
  ['Traveller', (ctx: MarsBotMAContext) => ctx.trackPos(0) + ctx.trackPos(3) + 5],
  ['Landscaper', () => undefined],
  ['Highlander', () => undefined],
  ['Manufacturer', (ctx: MarsBotMAContext) => ctx.trackPos(0) + ctx.trackPos(4)],
  ['Blacksmith', (ctx: MarsBotMAContext) => Math.max(ctx.trackPos(0), ctx.trackPos(1))],
  // Modular
  ['Administrator', (ctx: MarsBotMAContext) => ctx.playedCards.withoutTags + 2],
  ['Collector', (ctx: MarsBotMAContext) => ctx.tracksAtOrAbove(3)],
  ['Constructor', () => undefined],
  ['Politician', () => 5],
  ['Visionary', (ctx: MarsBotMAContext) => {
    if (!ctx.hasVenus) {
      return ctx.lowestTrackPos * 2;
    }
    // With Venus: 2nd lowest track position doubled
    const all = [...ctx.allTrackPositions(), ctx.venusTrackPos].sort((a, b) => a - b);
    return all[1] * 2;
  }],
  ['Promoter', (ctx: MarsBotMAContext) => ctx.trackPos(4)],
  // Venus Next
  ['Venuphile', (ctx: MarsBotMAContext) => ctx.venusTrackPos],
]);
