export interface HazardConstraint {
    threshold: number,
    available: boolean
}

export class HazardData {
    constructor(public erosionOceanCount: HazardConstraint,
        public removeDustStormsOceanCount: HazardConstraint,
        public severeErosionTemperature: HazardConstraint,
        public severeDustStormOxygen: HazardConstraint) {
    }
    public static initial(): HazardData {
        return new HazardData(
            { threshold: 3, available: true }, // oceans: add erosion tiles
            { threshold: 6, available: true }, // oceans: remove dust storms
            { threshold: -4, available: true }, // temperatore: severe erosion
            { threshold: 5, available: true }); // oxygen: severe dust storms
    }
}