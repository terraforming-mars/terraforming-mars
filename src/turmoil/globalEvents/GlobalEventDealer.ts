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
import {BalancedDevelopment} from './BalancedDevelopment';
import {TiredEarth} from './TiredEarth';
import {MagneticFieldStimulationDelays} from './MagneticFieldStimulationDelays';
import {ConstantStruggle} from './ConstantStruggle';
import {SpaceRaceToMars} from './SpaceRaceToMars';
import {CommunicationBoom} from './CommunicationBoom';

const COLONY_ONLY_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.JOVIAN_TAX_RIGHTS, JovianTaxRights],
]);

const COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS, MicrogravityHealthProblems],
]);

const VENUS_COLONY_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.CLOUD_SOCIETIES, CloudSocieties],
]);

const VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.CORROSIVE_RAIN, CorrosiveRain],
]);

const VENUS_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.VENUS_INFRASTRUCTURE, VenusInfrastructure],
]);

const POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.SPONSORED_PROJECTS, SponsoredProjects],
  [GlobalEventName.ASTEROID_MINING, AsteroidMining],
  [GlobalEventName.GENEROUS_FUNDING, GenerousFunding],
  [GlobalEventName.SUCCESSFUL_ORGANISMS, SuccessfulOrganisms],
  [GlobalEventName.PRODUCTIVITY, Productivity],
  [GlobalEventName.HOMEWORLD_SUPPORT, HomeworldSupport],
  [GlobalEventName.VOLCANIC_ERUPTIONS, VolcanicEruptions],
  [GlobalEventName.DIVERSITY, Diversity],
  [GlobalEventName.IMPROVED_ENERGY_TEMPLATES, ImprovedEnergyTemplates],
  [GlobalEventName.INTERPLANETARY_TRADE, InterplanetaryTrade],
  [GlobalEventName.CELEBRITY_LEADERS, CelebrityLeaders],
  [GlobalEventName.SPINOFF_PRODUCTS, SpinoffProducts],
  [GlobalEventName.ELECTION, Election],
  [GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL, AquiferReleasedByPublicCouncil],
  [GlobalEventName.SCIENTIFIC_COMMUNITY, ScientificCommunity],
  [GlobalEventName.STRONG_SOCIETY, StrongSociety],
]);

const NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.GLOBAL_DUST_STORM, GlobalDustStorm],
  [GlobalEventName.ECO_SABOTAGE, EcoSabotage],
  [GlobalEventName.MINERS_ON_STRIKE, MinersOnStrike],
  [GlobalEventName.MUD_SLIDES, MudSlides],
  [GlobalEventName.REVOLUTION, Revolution],
  [GlobalEventName.RIOTS, Riots],
  [GlobalEventName.SABOTAGE, Sabotage],
  [GlobalEventName.SNOW_COVER, SnowCover],
  [GlobalEventName.PANDEMIC, Pandemic],
  [GlobalEventName.WAR_ON_EARTH, WarOnEarth],
  [GlobalEventName.PARADIGM_BREAKDOWN, ParadigmBreakdown],
  [GlobalEventName.DRY_DESERTS, DryDeserts],
  [GlobalEventName.RED_INFLUENCE, RedInfluence],
  [GlobalEventName.SOLARNET_SHUTDOWN, SolarnetShutdown],
  [GlobalEventName.SOLAR_FLARE, SolarFlare],
]);

const COMMUNITY_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.LEADERSHIP_SUMMIT, LeadershipSummit],
]);

const PATHFINDERS_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.BALANCED_DEVELOPMENT, BalancedDevelopment],
  [GlobalEventName.SPACE_RACE_TO_MARS, SpaceRaceToMars],
]);

const PATHFINDERS_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.CONSTANT_STRUGGLE, ConstantStruggle],
  [GlobalEventName.TIRED_EARTH, TiredEarth],
  [GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS, MagneticFieldStimulationDelays],
  [GlobalEventName.COMMUNICATION_BOOM, CommunicationBoom],
]);

// When renaming, add the rename here and add a TODO (like the example below)
// And remember to add a test in GlobalEventDealer.spec.ts
const RENAMED_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  // ['Miners Of Strike' as GlobalEventName, MinersOnStrike],
]);

export const ALL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  ...Array.from(POSITIVE_GLOBAL_EVENTS),
  ...Array.from(NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(COLONY_ONLY_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(VENUS_COLONY_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(VENUS_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(COMMUNITY_GLOBAL_EVENTS),
  ...Array.from(RENAMED_GLOBAL_EVENTS),
  ...Array.from(PATHFINDERS_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(PATHFINDERS_NEGATIVE_GLOBAL_EVENTS),
]);

// Function to return a global event object by its name
export function getGlobalEventByName(globalEventName: GlobalEventName): IGlobalEvent | undefined {
  const Factory = ALL_EVENTS.get(globalEventName);

  if (Factory !== undefined) return new Factory();
  return undefined;
}

export class GlobalEventDealer implements ISerializable<SerializedGlobalEventDealer> {
  constructor(
    public readonly globalEventsDeck: Array<IGlobalEvent>,
    public readonly discardedGlobalEvents: Array<IGlobalEvent>) {}

  public static newInstance(game: Game): GlobalEventDealer {
    const events = Array.from(POSITIVE_GLOBAL_EVENTS);

    if (!game.gameOptions.removeNegativeGlobalEventsOption) {
      events.push(...Array.from(NEGATIVE_GLOBAL_EVENTS));
      if (game.gameOptions.coloniesExtension) events.push(...Array.from(COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS));

      if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
        events.push(...Array.from(VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS));
      };
    }

    if (game.gameOptions.venusNextExtension) events.push(...Array.from(VENUS_POSITIVE_GLOBAL_EVENTS));

    if (game.gameOptions.coloniesExtension) events.push(...Array.from(COLONY_ONLY_POSITIVE_GLOBAL_EVENTS));

    if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
      events.push(...Array.from(VENUS_COLONY_POSITIVE_GLOBAL_EVENTS));
    }

    if (game.gameOptions.communityCardsOption) events.push(...Array.from(COMMUNITY_GLOBAL_EVENTS));

    if (game.gameOptions.pathfindersExpansion) {
      events.push(...Array.from(PATHFINDERS_POSITIVE_GLOBAL_EVENTS));
      if (!game.gameOptions.removeNegativeGlobalEventsOption) {
        events.push(...Array.from(PATHFINDERS_NEGATIVE_GLOBAL_EVENTS));
      }
    }

    const globalEventsDeck = this.shuffle(events.map((cf) => new cf[1]));
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
    return this.globalEventsDeck.pop();
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
