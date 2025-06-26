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
 *   erosionOceanCount: HazardConstraint;
 *   removeDustStormsOceanCount: HazardConstraint;
 *   severeErosionTemperature: HazardConstraint;
 *   severeDustStormOxygen: HazardConstraint;
 * }
 */
export type HazardData = Record<typeof HAZARD_CONSTRAINTS[number], HazardConstraint>;

export type MilestoneCount = {
  id: PlayerId;
  // TODO(kberg): Remove count by 2025-08-01
  count?: number;
  networkerCount: number;
  purifierCount: number;
}

// TODO(kberg): Inline this function after 2025-08-01
export function deserializeAresData(serialized: AresData | undefined): AresData | undefined {
  const deserialized = serialized;
  // TODO(kberg): Remove this block after 2025-08-01
  if (deserialized !== undefined) {
    for (const entry of deserialized.milestoneResults) {
      if (entry.networkerCount === undefined) {
        entry.networkerCount = entry.count ?? 0;
      }
    }
  }

  return deserialized;
}
