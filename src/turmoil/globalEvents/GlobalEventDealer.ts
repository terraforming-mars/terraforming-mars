import { GlobalEventName } from "./GlobalEventName";
import { IGlobalEvent } from "./IGlobalEvent";
import { GlobalDustStorm } from "./GlobalDustStorm";
import { SponsoredProjects } from "./SponsoredProjects";
import { AsteroidMining } from "./AsteroidMining";
import { GenerousFunding } from "./GenerousFunding";
import { SuccessfulOrganisms } from "./SuccessfulOrganisms";
import { Productivity } from "./Productivity";
import { EcoSabotage } from "./EcoSabotage";
import { HomeworldSupport } from "./HomeworldSupport";
import { MinersOnStrike } from "./MinersOnStrike";
import { MudSlides } from "./MudSlides";
import { Revolution } from "./Revolution";
import { Riots } from "./Riots";
import { Sabotage } from "./Sabotage";
import { SnowCover } from "./SnowCover";
import { VolcanicEruptions } from "./VolcanicEruptions";
import { InterplanetaryTrade } from "./InterplanetaryTrade";
import { ImprovedEnergyTemplates } from "./ImprovedEnergyTemplates";
import { WarOnEarth } from "./WarOnEarth";
import { Pandemic } from "./Pandemic";
import { Diversity } from "./Diversity";
import { CelebrityLeaders } from "./CelebrityLeaders";
import { SpinoffProducts } from "./SpinoffProducts";
import { Election } from "./Election";
import { AquiferReleasedByPublicCouncil } from "./AquiferReleasedByPublicCouncil";
import { ParadigmBreakdown } from "./ParadigmBreakdown";
import { CorrosiveRain } from "./CorrosiveRain";
import { Game } from "../../Game";
import { JovianTaxRights } from "./JovianTaxRights";
import { DryDeserts } from "./DryDeserts";
import { ScientificCommunity } from "./ScientificCommunity";
import { RedInfluence } from "./RedInfluence";
import { SolarnetShutdown } from "./SolarnetShutdown";
import { StrongSociety } from "./StrongSociety";
import { SolarFlare } from "./SolarFlare";
import { VenusInfrastructure } from "./VenusInfrastructure";
import { CloudSocieties } from "./CloudSocieties";
import { MicrogravityHealthProblems } from "./MicrogravityHealthProblems";

export interface IGlobalEventFactory<T> {
    globalEventName: GlobalEventName;
    factory: new () => T
}

export const COLONY_ONLY_POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.JOVIAN_TAX_RIGHTS , factory: JovianTaxRights },
];

export const COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS , factory: MicrogravityHealthProblems },
];

export const VENUS_COLONY_POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.CLOUD_SOCIETIES , factory: CloudSocieties },  
];

export const VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.CORROSIVE_RAIN , factory: CorrosiveRain },
];

export const VENUS_POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.VENUS_INFRASTRUCTURE , factory: VenusInfrastructure },
];

// ALL POSITIVE GLOBAL EVENTS
export const POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.SPONSORED_PROJECTS , factory: SponsoredProjects },
    { globalEventName: GlobalEventName.ASTEROID_MINING , factory: AsteroidMining },
    { globalEventName: GlobalEventName.GENEROUS_FUNDING , factory: GenerousFunding },
    { globalEventName: GlobalEventName.SUCCESSFUL_ORGANISMS , factory: SuccessfulOrganisms },
    { globalEventName: GlobalEventName.PRODUCTIVITY , factory: Productivity },
    { globalEventName: GlobalEventName.HOMEWORLD_SUPPORT , factory: HomeworldSupport },
    { globalEventName: GlobalEventName.VOLCANIC_ERUPTIONS , factory: VolcanicEruptions },
    { globalEventName: GlobalEventName.DIVERSITY , factory: Diversity },
    { globalEventName: GlobalEventName.IMPROVED_ENERGY_TEMPLATES , factory: ImprovedEnergyTemplates },
    { globalEventName: GlobalEventName.INTERPLANETARY_TRADE , factory: InterplanetaryTrade },
    { globalEventName: GlobalEventName.CELEBRITY_LEADERS , factory: CelebrityLeaders },
    { globalEventName: GlobalEventName.SPINOFF_PRODUCTS , factory: SpinoffProducts },
    { globalEventName: GlobalEventName.ELECTION , factory: Election },    
    { globalEventName: GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL , factory: AquiferReleasedByPublicCouncil },
    { globalEventName: GlobalEventName.SCIENTIFIC_COMMUNITY , factory: ScientificCommunity },
    { globalEventName: GlobalEventName.STRONG_SOCIETY , factory: StrongSociety },
];

// ALL NEGATIVE GLOBAL EVENTS
export const NEGATIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.GLOBAL_DUST_STORM , factory: GlobalDustStorm },
    { globalEventName: GlobalEventName.ECO_SABOTAGE , factory: EcoSabotage },
    { globalEventName: GlobalEventName.MINERS_ON_STRIKE , factory: MinersOnStrike },
    { globalEventName: GlobalEventName.MUD_SLIDES , factory: MudSlides },
    { globalEventName: GlobalEventName.REVOLUTION , factory: Revolution },
    { globalEventName: GlobalEventName.RIOTS , factory: Riots },
    { globalEventName: GlobalEventName.SABOTAGE , factory: Sabotage },
    { globalEventName: GlobalEventName.SNOW_COVER , factory: SnowCover },
    { globalEventName: GlobalEventName.PANDEMIC , factory: Pandemic },        
    { globalEventName: GlobalEventName.WAR_ON_EARTH , factory: WarOnEarth },
    { globalEventName: GlobalEventName.PARADIGM_BREAKDOWN , factory: ParadigmBreakdown },
    { globalEventName: GlobalEventName.DRY_DESERTS , factory: DryDeserts },
    { globalEventName: GlobalEventName.RED_INFLUENCE , factory: RedInfluence },
    { globalEventName: GlobalEventName.SOLARNET_SHUTDOWN , factory: SolarnetShutdown },
    { globalEventName: GlobalEventName.SOLAR_FLARE , factory: SolarFlare },
];

// Function to return a global event object by its name
export function getGlobalEventByName(globalEventName: string): IGlobalEvent | undefined {
    const allEvents = [
        ...POSITIVE_GLOBAL_EVENTS,
        ...NEGATIVE_GLOBAL_EVENTS,
        ...COLONY_ONLY_POSITIVE_GLOBAL_EVENTS,
        ...COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS,
        ...VENUS_COLONY_POSITIVE_GLOBAL_EVENTS,
        ...VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS,
        ...VENUS_POSITIVE_GLOBAL_EVENTS
    ];
    
    const globalEventFactory = allEvents.find((globalEventFactory) => globalEventFactory.globalEventName === globalEventName);

    if (globalEventFactory !== undefined) return new globalEventFactory.factory();
    return undefined;
}

export class GlobalEventDealer {
    public globalEventsDeck: Array<IGlobalEvent> = [];
    public discardedGlobalEvents: Array<IGlobalEvent> = [];

    public initGlobalEvents(game: Game) {
        var events = [...POSITIVE_GLOBAL_EVENTS];

        if (!game.gameOptions.removeNegativeGlobalEventsOption) {
            events.push(...NEGATIVE_GLOBAL_EVENTS);
            if (game.gameOptions.coloniesExtension) events.push(...COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS);

            if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
                events.push(...VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS)
            };
        }

        if (game.gameOptions.venusNextExtension) events.push(...VENUS_POSITIVE_GLOBAL_EVENTS);

        if (game.gameOptions.coloniesExtension) events.push(...COLONY_ONLY_POSITIVE_GLOBAL_EVENTS);

        if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
            events.push(...VENUS_COLONY_POSITIVE_GLOBAL_EVENTS);
        }

        this.globalEventsDeck = this.shuffle(events.map((cf) => new cf.factory()));
    };

    private shuffle(cards: Array<IGlobalEvent>): Array<IGlobalEvent> {
        const deck: Array<IGlobalEvent> = [];
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