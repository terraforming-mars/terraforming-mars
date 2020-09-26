export interface AresData {
    active: boolean;
    includeHazards: boolean;
    hazardData: HazardData;
}

export interface HazardConstraint {
    threshold: number,
    available: boolean
}

export interface HazardData {
 erosionOceanCount: HazardConstraint,
 removeDustStormsOceanCount: HazardConstraint,
 severeErosionTemperature: HazardConstraint,
 severeDustStormOxygen: HazardConstraint
};

export function initialAresData(active: boolean, includeHazards: boolean): AresData {
    return {
        active: active,
        includeHazards: includeHazards,
        hazardData: {
            erosionOceanCount: { threshold: 3, available: true }, // oceans: add erosion tiles
            removeDustStormsOceanCount: { threshold: 6, available: true }, // oceans: remove dust storms
            severeErosionTemperature: { threshold: -4, available: true }, // temperatore: severe erosion
            severeDustStormOxygen: { threshold: 5, available: true } // oxygen: severe dust storms
        }
    };

}