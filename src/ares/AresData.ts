import { HazardData } from "./HazardData";

export class AresData {
    constructor(public active: boolean, public includeHazards: boolean, public hazardData: HazardData = HazardData.initial()) {
    }
}