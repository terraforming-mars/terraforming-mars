import {GlobalEventName} from './GlobalEventName';
import {IGlobalEvent} from './IGlobalEvent';
import {GlobalDustStorm} from './GlobalDustStorm';
import {SponsoredProjects} from './SponsoredProjects';
import {AsteroidMining} from './AsteroidMining';
import {GenerousFunding} from './GenerousFunding';
import {SuccessfulOrganisms} from './SuccessfulOrganisms';
import {Productivity} from './Productivity';
import {EcoSabotage} from './EcoSabotage';
import {HomeworldSupport} from './HomeworldSupport';
import {MinersOnStrike} from './MinersOnStrike';
import {MudSlides} from './MudSlides';
import {Revolution} from './Revolution';
import {Riots} from './Riots';
import {Sabotage} from './Sabotage';
import {SnowCover} from './SnowCover';
import {VolcanicEruptions} from './VolcanicEruptions';
import {InterplanetaryTrade} from './InterplanetaryTrade';
import {ImprovedEnergyTemplates} from './ImprovedEnergyTemplates';
import {WarOnEarth} from './WarOnEarth';
import {Pandemic} from './Pandemic';
import {Diversity} from './Diversity';
import {CelebrityLeaders} from './CelebrityLeaders';
import {SpinoffProducts} from './SpinoffProducts';
import {Election} from './Election';
import {AquiferReleasedByPublicCouncil} from './AquiferReleasedByPublicCouncil';
import {ParadigmBreakdown} from './ParadigmBreakdown';
import {CorrosiveRain} from './CorrosiveRain';
import {Game} from '../../Game';
import {JovianTaxRights} from './JovianTaxRights';
import {DryDeserts} from './DryDeserts';
import {ScientificCommunity} from './ScientificCommunity';
import {RedInfluence} from './RedInfluence';
import {SolarnetShutdown} from './SolarnetShutdown';
import {StrongSociety} from './StrongSociety';
import {SolarFlare} from './SolarFlare';
import {VenusInfrastructure} from './VenusInfrastructure';
import {CloudSocieties} from './CloudSocieties';
import {MicrogravityHealthProblems} from './MicrogravityHealthProblems';
import {SerializedGlobalEventDealer} from './SerializedGlobalEventDealer';
import {ISerializable} from '../../ISerializable';
import {LeadershipSummit} from './LeadershipSummit';

export interface IGlobalEventFactory<T> {
    globalEventName: GlobalEventName;
    Factory: new () => T
}

export const COLONY_ONLY_POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.JOVIAN_TAX_RIGHTS, Factory: JovianTaxRights},
];

export const COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS, Factory: MicrogravityHealthProblems},
];

export const VENUS_COLONY_POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.CLOUD_SOCIETIES, Factory: CloudSocieties},
];

export const VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.CORROSIVE_RAIN, Factory: CorrosiveRain},
];

export const VENUS_POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.VENUS_INFRASTRUCTURE, Factory: VenusInfrastructure},
];

// ALL POSITIVE GLOBAL EVENTS
export const POSITIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.SPONSORED_PROJECTS, Factory: SponsoredProjects},
  {globalEventName: GlobalEventName.ASTEROID_MINING, Factory: AsteroidMining},
  {globalEventName: GlobalEventName.GENEROUS_FUNDING, Factory: GenerousFunding},
  {globalEventName: GlobalEventName.SUCCESSFUL_ORGANISMS, Factory: SuccessfulOrganisms},
  {globalEventName: GlobalEventName.PRODUCTIVITY, Factory: Productivity},
  {globalEventName: GlobalEventName.HOMEWORLD_SUPPORT, Factory: HomeworldSupport},
  {globalEventName: GlobalEventName.VOLCANIC_ERUPTIONS, Factory: VolcanicEruptions},
  {globalEventName: GlobalEventName.DIVERSITY, Factory: Diversity},
  {globalEventName: GlobalEventName.IMPROVED_ENERGY_TEMPLATES, Factory: ImprovedEnergyTemplates},
  {globalEventName: GlobalEventName.INTERPLANETARY_TRADE, Factory: InterplanetaryTrade},
  {globalEventName: GlobalEventName.CELEBRITY_LEADERS, Factory: CelebrityLeaders},
  {globalEventName: GlobalEventName.SPINOFF_PRODUCTS, Factory: SpinoffProducts},
  {globalEventName: GlobalEventName.ELECTION, Factory: Election},
  {globalEventName: GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL, Factory: AquiferReleasedByPublicCouncil},
  {globalEventName: GlobalEventName.SCIENTIFIC_COMMUNITY, Factory: ScientificCommunity},
  {globalEventName: GlobalEventName.STRONG_SOCIETY, Factory: StrongSociety},
];

// ALL NEGATIVE GLOBAL EVENTS
export const NEGATIVE_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.GLOBAL_DUST_STORM, Factory: GlobalDustStorm},
  {globalEventName: GlobalEventName.ECO_SABOTAGE, Factory: EcoSabotage},
  {globalEventName: GlobalEventName.MINERS_ON_STRIKE, Factory: MinersOnStrike},
  {globalEventName: GlobalEventName.MUD_SLIDES, Factory: MudSlides},
  {globalEventName: GlobalEventName.REVOLUTION, Factory: Revolution},
  {globalEventName: GlobalEventName.RIOTS, Factory: Riots},
  {globalEventName: GlobalEventName.SABOTAGE, Factory: Sabotage},
  {globalEventName: GlobalEventName.SNOW_COVER, Factory: SnowCover},
  {globalEventName: GlobalEventName.PANDEMIC, Factory: Pandemic},
  {globalEventName: GlobalEventName.WAR_ON_EARTH, Factory: WarOnEarth},
  {globalEventName: GlobalEventName.PARADIGM_BREAKDOWN, Factory: ParadigmBreakdown},
  {globalEventName: GlobalEventName.DRY_DESERTS, Factory: DryDeserts},
  {globalEventName: GlobalEventName.RED_INFLUENCE, Factory: RedInfluence},
  {globalEventName: GlobalEventName.SOLARNET_SHUTDOWN, Factory: SolarnetShutdown},
  {globalEventName: GlobalEventName.SOLAR_FLARE, Factory: SolarFlare},
];

export const COMMUNITY_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
  {globalEventName: GlobalEventName.LEADERSHIP_SUMMIT, Factory: LeadershipSummit},
];

const ALL_EVENTS = [
  ...POSITIVE_GLOBAL_EVENTS,
  ...NEGATIVE_GLOBAL_EVENTS,
  ...COLONY_ONLY_POSITIVE_GLOBAL_EVENTS,
  ...COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS,
  ...VENUS_COLONY_POSITIVE_GLOBAL_EVENTS,
  ...VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS,
  ...VENUS_POSITIVE_GLOBAL_EVENTS,
  ...COMMUNITY_GLOBAL_EVENTS,
];
// Function to return a global event object by its name
export function getGlobalEventByName(globalEventName: string): IGlobalEvent | undefined {
  const globalEventFactory = ALL_EVENTS.find((globalEventFactory) => globalEventFactory.globalEventName === globalEventName);

  if (globalEventFactory !== undefined) return new globalEventFactory.Factory();
  return undefined;
}

export class GlobalEventDealer implements ISerializable<SerializedGlobalEventDealer> {
  constructor(
    public readonly globalEventsDeck: Array<IGlobalEvent>,
    public readonly discardedGlobalEvents: Array<IGlobalEvent>) {}

  public static newInstance(game: Game): GlobalEventDealer {
    const events = [...POSITIVE_GLOBAL_EVENTS];

    if (!game.gameOptions.removeNegativeGlobalEventsOption) {
      events.push(...NEGATIVE_GLOBAL_EVENTS);
      if (game.gameOptions.coloniesExtension) events.push(...COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS);

      if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
        events.push(...VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS);
      };
    }

    if (game.gameOptions.venusNextExtension) events.push(...VENUS_POSITIVE_GLOBAL_EVENTS);

    if (game.gameOptions.coloniesExtension) events.push(...COLONY_ONLY_POSITIVE_GLOBAL_EVENTS);

    if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
      events.push(...VENUS_COLONY_POSITIVE_GLOBAL_EVENTS);
    }

    if (game.gameOptions.communityCardsOption) events.push(...COMMUNITY_GLOBAL_EVENTS);

    const globalEventsDeck = this.shuffle(events.map((cf) => new cf.Factory()));
    return new GlobalEventDealer(globalEventsDeck, []);
  };

  private static shuffle(cards: Array<IGlobalEvent>): Array<IGlobalEvent> {
    const deck: Array<IGlobalEvent> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return deck;
  }

  public draw(): IGlobalEvent | undefined {
    const globalEvent = this.globalEventsDeck.pop();
    if (globalEvent) return globalEvent;
    return undefined;
  }

  public serialize(): SerializedGlobalEventDealer {
    return {
      deck: this.globalEventsDeck.map((card) => card.name),
      discarded: this.discardedGlobalEvents.map((card) => card.name),
    };
  }

  public static deserialize(d: SerializedGlobalEventDealer): GlobalEventDealer {
    const deck = d.deck.map((element: GlobalEventName) => {
      return getGlobalEventByName(element)!;
    });

    const discardPile = d.discarded.map((element: GlobalEventName) => {
      return getGlobalEventByName(element)!;
    });
    return new GlobalEventDealer(deck, discardPile);
  }
}
