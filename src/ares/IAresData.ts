export interface IAresData {
    active: boolean;
    includeHazards: boolean;
    hazardData: IHazardData;
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
};
