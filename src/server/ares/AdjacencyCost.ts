import {HazardSeverity} from '../../common/AresTileType';

// The number of adjacent mild and severe hazards.
export type AresProductionCost = Record<Exclude<HazardSeverity, 'none'>, number>;

export const EMPTY_ARES_PRODUCTION_COST: Readonly<AresProductionCost> = {
  mild: 0,
  severe: 0,
} as const;

export type AdjacencyCost = {
  megacredits: number;
  production: AresProductionCost;
  tr: number;
}
