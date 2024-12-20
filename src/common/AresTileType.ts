import {TileType} from './TileType';

export enum HazardSeverity {
  NONE,
  MILD,
  SEVERE
}

export function hazardSeverity(type: TileType | undefined): HazardSeverity {
  switch (type) {
  case TileType.DUST_STORM_MILD:
  case TileType.EROSION_MILD:
    return HazardSeverity.MILD;

  case TileType.DUST_STORM_SEVERE:
  case TileType.EROSION_SEVERE:
    return HazardSeverity.SEVERE;

  default:
    return HazardSeverity.NONE;
  }
}

export const HAZARD_STEPS: Record<HazardSeverity, number> = {
  [HazardSeverity.NONE]: 0,
  [HazardSeverity.MILD]: 1,
  [HazardSeverity.SEVERE]: 2,
} as const;
