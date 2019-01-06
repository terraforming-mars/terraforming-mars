
import { AquiferPumping } from "./cards/AquiferPumping";
import { EnergySaving } from "./cards/EnergySaving";
import { Flooding } from "./cards/Flooding";
import { ImportOfAdvancedGHG } from "./cards/ImportOfAdvancedGHG";
import { IndenturedWorkers } from "./cards/IndenturedWorkers";
import { InventionContest } from "./cards/InventionContest";
import { LagrangeObservatory } from "./cards/LagrangeObservatory";
import { LocalHeatTrapping } from "./cards/LocalHeatTrapping";
import { PermafrostExtraction } from "./cards/PermafrostExtraction";
import { Plantation } from "./cards/Plantation";
import { PowerInfrastructure } from "./cards/PowerInfrastructure";
import { Windmills } from "./cards/Windmills";

import { IProjectCard } from "./cards/IProjectCard";

const ALL_CARDS: Array<IProjectCard> = [
    new AquiferPumping(),
    new EnergySaving(),
    new Flooding(),
    new ImportOfAdvancedGHG(),
    new IndenturedWorkers(),
    new InventionContest(),
    new LagrangeObservatory(),
    new LocalHeatTrapping(),
    new PermafrostExtraction(),
    new Plantation(),
    new PowerInfrastructure(),
    new Windmills()
];

export class Dealer {
    public getCards(count: number): Array<IProjectCard> {
        return [];
    }    
}
