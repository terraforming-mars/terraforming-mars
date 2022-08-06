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

export type HazardData = {
    erosionOceanCount: HazardConstraint,
    removeDustStormsOceanCount: HazardConstraint,
    severeErosionTemperature: HazardConstraint,
    severeDustStormOxygen: HazardConstraint
}

export type MilestoneCount = {
    id: PlayerId;
    count: number;
}
