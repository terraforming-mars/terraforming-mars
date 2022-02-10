import {PlayerId} from '../Types';

export interface IAresData {
    active: boolean;
    includeHazards: boolean;
    hazardData: IHazardData;
    milestoneResults: Array<IMilestoneCount>;
}

export interface IHazardConstraint {
    threshold: number,
    available: boolean
}

export interface IHazardData {
    erosionOceanCount: IHazardConstraint,
    removeDustStormsOceanCount: IHazardConstraint,
    severeErosionTemperature: IHazardConstraint,
    severeDustStormOxygen: IHazardConstraint
}

export interface IMilestoneCount {
    id: PlayerId;
    count: number;
}
