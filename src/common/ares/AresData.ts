import {PlayerId} from '../Types';

export type AresData = {
    includeHazards: boolean;
    hazardData: HazardData;
    milestoneResults: Array<MilestoneCount>;
}

export type HazardConstraint = {
    threshold: number,
    available: boolean
}

export const HAZARD_CONSTRAINTS = [
  'erosionOceanCount',
  'removeDustStormsOceanCount',
  'severeErosionTemperature',
  'severeDustStormOxygen',
] as const;

/*
 * This is the same as
 * type HazardData = {
 *    erosionOceanCount: HazardConstraint;
 *   removeDustStormsOceanCount: HazardConstraint;
 *   severeErosionTemperature: HazardConstraint;
 *   severeDustStormOxygen: HazardConstraint;
 * }
 */
export type HazardData = Record<typeof HAZARD_CONSTRAINTS[number], HazardConstraint>;

export type MilestoneCount = {
    id: PlayerId;
    count: number;
}
