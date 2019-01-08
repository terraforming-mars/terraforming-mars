
import { AquiferPumping } from "./cards/AquiferPumping";
import { EnergySaving } from "./cards/EnergySaving";
import { Flooding } from "./cards/Flooding";
import { FuelFactory } from "./cards/FuelFactory";
import { IceCapMelting } from "./cards/IceCapMelting";
import { ImportOfAdvancedGHG } from "./cards/ImportOfAdvancedGHG";
import { IndenturedWorkers } from "./cards/IndenturedWorkers";
import { InventionContest } from "./cards/InventionContest";
import { LagrangeObservatory } from "./cards/LagrangeObservatory";
import { Livestock } from "./cards/Livestock";
import { LocalHeatTrapping } from "./cards/LocalHeatTrapping";
import { OlympusConference } from "./cards/OlympusConference";
import { NoctisFarming } from "./cards/NoctisFarming";
import { PermafrostExtraction } from "./cards/PermafrostExtraction";
import { Plantation } from "./cards/Plantation";
import { PowerInfrastructure } from "./cards/PowerInfrastructure";
import { RadSuits } from "./cards/RadSuits";
import { SoilFactory } from "./cards/SoilFactory";
import { TundraFarming } from "./cards/TundraFarming";
import { Windmills } from "./cards/Windmills";

import { IProjectCard } from "./cards/IProjectCard";

const ALL_CARDS: Array<IProjectCard> = [
    new AquiferPumping(),
    new EnergySaving(),
    new Flooding(),
    new FuelFactory(),
    new IceCapMelting(),
    new ImportOfAdvancedGHG(),
    new IndenturedWorkers(),
    new InventionContest(),
    new LagrangeObservatory(),
    new Livestock(),
    new LocalHeatTrapping(),
    new NoctisFarming(),
    new OlympusConference(),
    new PermafrostExtraction(),
    new Plantation(),
    new PowerInfrastructure(),
    new RadSuits(),
    new SoilFactory(),
    new TundraFarming(),
    new Windmills()
];

export class Dealer {
    public getCards(count: number): Array<IProjectCard> {
        return [];
    }    
}
