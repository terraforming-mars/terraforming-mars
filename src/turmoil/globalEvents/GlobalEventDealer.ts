import { GlobalEventName } from "./GlobalEventName";
import { IGlobalEvent } from "./IGlobalEvent";
import { GlobalDustStorm } from "./GlobalDustStorm";
import { SponsoredProjects } from "./SponsoredProjects";
import { AsteroidMining } from "./AsteroidMining";
import { GenerousFunding } from "./GenerousFunding";
import { SucessfulOrganisms } from './SucessfulOrganisms';
import { Productivity } from './Productivity';
import { EcoSabotage } from './EcoSabotage';


export interface IGlobalEventFactory<T> {
    globalEventName: GlobalEventName;
    factory: new () => T
}

// ALL GLOBAL EVENTS
export const ALL_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.GLOBAL_DUST_STORM , factory: GlobalDustStorm },
    { globalEventName: GlobalEventName.SPONSORED_PROJECTS , factory: SponsoredProjects },
    { globalEventName: GlobalEventName.ASTEROID_MINING , factory: AsteroidMining },
    { globalEventName: GlobalEventName.GENEROUS_FUNDING , factory: GenerousFunding },
    { globalEventName: GlobalEventName.SUCESSFUL_ORGANISMS , factory: SucessfulOrganisms },
    { globalEventName: GlobalEventName.ECO_SABOTAGE , factory: EcoSabotage },
    { globalEventName: GlobalEventName.PRODUCTIVITY , factory: Productivity }

];

export class GlobalEventDealer {
    public globalEventsDeck: Array<IGlobalEvent> = this.shuffle(ALL_GLOBAL_EVENTS.map((cf) => new cf.factory()));
    public discardedGlobalEvents: Array<IGlobalEvent> = [];

    private shuffle(cards: Array<any>): Array<any> {
        const deck: Array<any> = [];
        const copy = cards.slice();
        while (copy.length) {
            deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return deck;
    }

    public draw(): IGlobalEvent | undefined{
        const globalEvent = this.globalEventsDeck.pop();
        if (globalEvent) return globalEvent;
        return undefined;
    }

}    