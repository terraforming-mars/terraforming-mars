import {TileType} from './TileType';

export type HazardSeverity = 'none' | 'mild' | 'severe';

export function hazardSeverity(type: TileType | undefined): HazardSeverity {
  switch (type) {
  case TileType.DUST_STORM_MILD:
  case TileType.EROSION_MILD:
    return 'mild';

  case TileType.DUST_STORM_SEVERE:
  case TileType.EROSION_SEVERE:
    return 'severe';

  default:
    return 'none';
  }
}

export const HAZARD_STEPS: Record<HazardSeverity, number> = {
  'none': 0,
  'mild': 1,
  'severe': 2,
} as const;
