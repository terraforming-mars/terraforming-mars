
import { ImportOfAdvancedGHG } from "./cards/ImportOfAdvancedGHG";
import { LagrangeObservatory } from "./cards/LagrangeObservatory";
import { IProjectCard } from "./cards/IProjectCard";

const ALL_CARDS: Array<IProjectCard> = [
    new ImportOfAdvancedGHG(),
    new LagrangeObservatory()
];

export class Dealer {
    public getCards(count: number): Array<IProjectCard> {
        return [];
    }    
}
