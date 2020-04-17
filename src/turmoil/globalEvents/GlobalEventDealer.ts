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
import { InterplanetaryTrade } from './InterplanetaryTrade';
import { ImprovedEnergyTemplates } from './ImprovedEnergyTemplates';
import { WarOnEarth } from './WarOnEarth';
import { Pandemic } from './Pandemic';
import { Diversity } from './Diversity';



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
    { globalEventName: GlobalEventName.DIVERSITY , factory: Diversity },     
    { globalEventName: GlobalEventName.PANDEMIC , factory: Pandemic },        
    { globalEventName: GlobalEventName.WAR_ON_EARTH , factory: WarOnEarth },    
    { globalEventName: GlobalEventName.IMPROVED_ENERGY_TEMPLATES , factory: ImprovedEnergyTemplates },
    { globalEventName: GlobalEventName.INTERPLANETARY_TRADE , factory: InterplanetaryTrade }
];

// Function to return a global event object by its name
export function getGlobalEventByName(globalEventName: string): IGlobalEvent | undefined {
    let globalEventFactory = ALL_GLOBAL_EVENTS.find((globalEventFactory) => globalEventFactory.globalEventName === globalEventName);
    if (globalEventFactory !== undefined) {
        return new globalEventFactory.factory();
    }
    return undefined;
}

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