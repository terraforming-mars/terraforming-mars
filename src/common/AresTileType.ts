import {HAZARD_TILES, TileType} from './TileType';

export enum HazardSeverity {
  NONE,
  MILD,
  SEVERE
}

export function isHazardTileType(type: TileType): boolean {
  return HAZARD_TILES.has(type);
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
