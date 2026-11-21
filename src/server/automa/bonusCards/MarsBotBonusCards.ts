import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {newProjectCard} from '@/server/createCard';
import {BuildBuildBuild} from '@/server/automa/bonusCards/BuildBuildBuild';
import {Diversification} from '@/server/automa/bonusCards/Diversification';
import {DoItRight} from '@/server/automa/bonusCards/DoItRight';
import {ExpeditedConstructionColonies} from '@/server/automa/bonusCards/ExpeditedConstructionColonies';
import {ExpeditedConstruction} from '@/server/automa/bonusCards/ExpeditedConstruction';
import {ExtendedShippingLines} from '@/server/automa/bonusCards/ExtendedShippingLines';
import {GovernmentIntervention} from '@/server/automa/bonusCards/GovernmentIntervention';
import {GovernmentSubsidy} from '@/server/automa/bonusCards/GovernmentSubsidy';
import {GrayEminence} from '@/server/automa/bonusCards/GrayEminence';
import {InterfaceHyperlink} from '@/server/automa/bonusCards/InterfaceHyperlink';
import {InvasiveSpecies} from '@/server/automa/bonusCards/InvasiveSpecies';
import {Investors} from '@/server/automa/bonusCards/Investors';
import {Lobbyists} from '@/server/automa/bonusCards/Lobbyists';
import {LobbyistsVenus} from '@/server/automa/bonusCards/LobbyistsVenus';
import {LocalNeuralInstance} from '@/server/automa/bonusCards/LocalNeuralInstance';
import {MeteorShower} from '@/server/automa/bonusCards/MeteorShower';
import {OuterSystemFoothold} from '@/server/automa/bonusCards/OuterSystemFoothold';
import {PartyPolitics} from '@/server/automa/bonusCards/PartyPolitics';
import {RapidSprouting} from '@/server/automa/bonusCards/RapidSprouting';
import {ResearchAndDevelopment} from '@/server/automa/bonusCards/ResearchAndDevelopment';
import {Settlers} from '@/server/automa/bonusCards/Settlers';
import {ShippingLines} from '@/server/automa/bonusCards/ShippingLines';
import {SupplyAndDemand} from '@/server/automa/bonusCards/SupplyAndDemand';
import {VenusianLobby} from '@/server/automa/bonusCards/VenusianLobby';

/** The bonus cards that have a class of their own. */
const BONUS_CARDS = new Map<BonusCardId, () => MarsBotBonusCard>([
  [BonusCardId.B01_METEOR_SHOWER, () => new MeteorShower()],
  [BonusCardId.B02_INVASIVE_SPECIES, () => new InvasiveSpecies()],
  [BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, () => new ResearchAndDevelopment()],
  [BonusCardId.B05_EXPEDITED_CONSTRUCTION, () => new ExpeditedConstruction()],
  [BonusCardId.B06_LOBBYISTS, () => new Lobbyists()],
  [BonusCardId.B07_LOCAL_NEURAL_INSTANCE, () => new LocalNeuralInstance()],
  [BonusCardId.B15_LOBBYISTS_VENUS, () => new LobbyistsVenus()],
  [BonusCardId.B16_GOVERNMENT_INTERVENTION, () => new GovernmentIntervention()],
  [BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES, () => new ExpeditedConstructionColonies()],
  [BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD, () => new OuterSystemFoothold()],
  [BonusCardId.B19_SHIPPING_LINES, () => new ShippingLines()],
  [BonusCardId.B20_EXTENDED_SHIPPING_LINES, () => new ExtendedShippingLines()],
  [BonusCardId.B21_PARTY_POLITICS, () => new PartyPolitics()],
  [BonusCardId.B22_SETTLERS, () => new Settlers()],
  [BonusCardId.B23_RAPID_SPROUTING, () => new RapidSprouting()],
  [BonusCardId.B24_SUPPLY_AND_DEMAND, () => new SupplyAndDemand()],
  [BonusCardId.B25_DO_IT_RIGHT, () => new DoItRight()],
  [BonusCardId.B26_VENUSIAN_LOBBY, () => new VenusianLobby()],
  [BonusCardId.B27_BUILD_BUILD_BUILD, () => new BuildBuildBuild()],
  [BonusCardId.B28_DIVERSIFICATION, () => new Diversification()],
  [BonusCardId.B29_GRAY_EMINENCE, () => new GrayEminence()],
  [BonusCardId.B30_INTERFACE_HYPERLINK, () => new InterfaceHyperlink()],
  [BonusCardId.B31_GOVERNMENT_SUBSIDY, () => new GovernmentSubsidy()],
  [BonusCardId.B32_INVESTORS, () => new Investors()],
]);

/** The bonus cards that have no class of their own yet. Each one is a blank card. */
const BLANK_BONUS_CARDS = new Map<BonusCardId, CardName>([
  [BonusCardId.B04_OVERACHIEVEMENT, CardName.AUTOMA_OVERACHIEVEMENT],
  [BonusCardId.B08_CORPORATE_COMPETITION, CardName.AUTOMA_CORPORATE_COMPETITION],
]);

/**
 * Creates a bonus card by id, from any set.
 *
 * An id without a class of its own gives a blank card, which does nothing when it resolves.
 */
export function createBonusCard(id: BonusCardId): MarsBotBonusCard {
  return BONUS_CARDS.get(id)?.() ?? new MarsBotBonusCard({id, name: BLANK_BONUS_CARDS.get(id) ?? (id as unknown as CardName)});
}

/** Create the base set of bonus cards (B01-B08). */
export function createBaseBonusCards(): Array<MarsBotBonusCard> {
  return [
    BonusCardId.B01_METEOR_SHOWER,
    BonusCardId.B02_INVASIVE_SPECIES,
    BonusCardId.B03_RESEARCH_AND_DEVELOPMENT,
    BonusCardId.B04_OVERACHIEVEMENT,
    BonusCardId.B05_EXPEDITED_CONSTRUCTION,
    BonusCardId.B06_LOBBYISTS,
    BonusCardId.B07_LOCAL_NEURAL_INSTANCE,
    BonusCardId.B08_CORPORATE_COMPETITION,
  ].map(createBonusCard);
}

/**
 * A card in MarsBot's bonus deck: a bonus card, or a project card a corporation put there.
 *
 * Only bonus cards have an `id`. MarsBot plays a project card drawn from the bonus deck like one
 * from its action deck.
 */
export type MarsBotBonusDeckCard = MarsBotBonusCard | (IProjectCard & {readonly id?: undefined});

/** Card name without its ':automa' suffix, for log lines that print the name raw. */
export function bonusCardDisplayName(card: MarsBotBonusDeckCard): string {
  return card.name.split(':')[0];
}

/** Restore bonus deck cards from their serialized names: bonus cards, and project cards a corporation put there. */
export function marsBotBonusCardsFromJSON(names: ReadonlyArray<CardName>): Array<MarsBotBonusDeckCard> {
  const byName = new Map<CardName, BonusCardId>();
  for (const id of [...BONUS_CARDS.keys(), ...BLANK_BONUS_CARDS.keys()]) {
    byName.set(createBonusCard(id).name, id);
  }
  const cards: Array<MarsBotBonusDeckCard> = [];
  for (const name of names) {
    const id = byName.get(name);
    const card = id !== undefined ? createBonusCard(id) : newProjectCard(name);
    if (card === undefined) {
      throw new Error(`Cannot restore MarsBot bonus deck card ${name}`);
    }
    cards.push(card);
  }
  return cards;
}
