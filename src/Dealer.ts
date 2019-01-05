
import { ImportOfAdvancedGHG } from "./cards/ImportOfAdvancedGHG";
import { IndenturedWorkers } from "./cards/IndenturedWorkers";
import { LagrangeObservatory } from "./cards/LagrangeObservatory";
import { Plantation } from "./cards/Plantation";
import { PowerInfrastructure } from "./cards/PowerInfrastructure";

import { IProjectCard } from "./cards/IProjectCard";

const ALL_CARDS: Array<IProjectCard> = [
    new ImportOfAdvancedGHG(),
    new IndenturedWorkers(),
    new LagrangeObservatory(),
    new Plantation(),
    new PowerInfrastructure()
];

export class Dealer {
    public getCards(count: number): Array<IProjectCard> {
        return [];
    }    
}
