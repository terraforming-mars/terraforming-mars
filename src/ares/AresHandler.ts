// Game.ts-specific behavior for Ares

import { ISpace } from "../ISpace";
import { TileType } from "../TileType";

export enum HazardSeverity {
    NONE,
    MILD,
    SEVERE
};

export class AresHandler {
    public static hasHazardTile(space: ISpace): boolean {
        return AresHandler.hazardSeverity(space) !== HazardSeverity.NONE;
    }

    public static hazardSeverity(space: ISpace): HazardSeverity {
        const type = space.tile?.tileType;

        switch(type) {
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
}