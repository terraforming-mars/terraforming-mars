import { GlobalEventName } from "./GlobalEventName";
import { IGlobalEvent } from "./IGlobalEvent";
import { GlobalDustStorm } from "./GlobalDustStorm";
import { SponsoredProjects } from "./SponsoredProjects";
import { AsteroidMining } from "./AsteroidMining";
import { GenerousFunding } from "./GenerousFunding";
import { SucessfulOrganisms } from './SucessfulOrganisms';
import { Productivity } from './Productivity';
import { EcoSabotage } from './EcoSabotage';
import { HomeworldSupport } from './HomeworldSupport';
import { MinersOnStrike } from './MinersOnStrike';
import { MudSlides } from './MudSlides';
import { Revolution } from './Revolution';
import { Riots } from './Riots';
import { Sabotage } from './Sabotage';
import { SnowCover } from './SnowCover';
import { VolcanicEruptions } from './VolcanicEruptions';



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
    { globalEventName: GlobalEventName.PRODUCTIVITY , factory: Productivity },
    { globalEventName: GlobalEventName.HOMEWORLD_SUPPORT , factory: HomeworldSupport },
    { globalEventName: GlobalEventName.MINERS_ON_STRIKE , factory: MinersOnStrike },
    { globalEventName: GlobalEventName.MUD_SLIDES , factory: MudSlides },
    { globalEventName: GlobalEventName.REVOLUTION , factory: Revolution },
    { globalEventName: GlobalEventName.RIOTS , factory: Riots },
    { globalEventName: GlobalEventName.SABOTAGE , factory: Sabotage },
    { globalEventName: GlobalEventName.SNOW_COVER , factory: SnowCover },
    { globalEventName: GlobalEventName.VOLCANIC_ERUPTIONS , factory: VolcanicEruptions },

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