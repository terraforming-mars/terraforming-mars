import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {BuildBuildBuild} from '@/server/automa/bonusCards/BuildBuildBuild';
import {CorporateCompetitionBorealis} from '@/server/automa/bonusCards/CorporateCompetitionBorealis';
import {CorporateCompetitionCimmeria} from '@/server/automa/bonusCards/CorporateCompetitionCimmeria';
import {CorporateCompetitionElysium} from '@/server/automa/bonusCards/CorporateCompetitionElysium';
import {CorporateCompetitionHellas} from '@/server/automa/bonusCards/CorporateCompetitionHellas';
import {CorporateCompetitionMA} from '@/server/automa/bonusCards/CorporateCompetitionMA';
import {CorporateCompetition} from '@/server/automa/bonusCards/CorporateCompetition';
import {CorporateCompetitionUtopia} from '@/server/automa/bonusCards/CorporateCompetitionUtopia';
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
import {Overachievement} from '@/server/automa/bonusCards/Overachievement';
import {PartyPolitics} from '@/server/automa/bonusCards/PartyPolitics';
import {RapidSprouting} from '@/server/automa/bonusCards/RapidSprouting';
import {ResearchAndDevelopment} from '@/server/automa/bonusCards/ResearchAndDevelopment';
import {Settlers} from '@/server/automa/bonusCards/Settlers';
import {ShippingLines} from '@/server/automa/bonusCards/ShippingLines';
import {SupplyAndDemand} from '@/server/automa/bonusCards/SupplyAndDemand';
import {VenusianLobby} from '@/server/automa/bonusCards/VenusianLobby';

/**
 * The class for each bonus card.
 *
 * Keyed by every BonusCardName, so a card without a class doesn't compile.
 */
const CARD_CLASSES: Record<BonusCardName, new () => MarsBotBonusCard> = {
  [BonusCardName.METEOR_SHOWER]: MeteorShower,
  [BonusCardName.INVASIVE_SPECIES]: InvasiveSpecies,
  [BonusCardName.RESEARCH_AND_DEVELOPMENT]: ResearchAndDevelopment,
  [BonusCardName.OVERACHIEVEMENT]: Overachievement,
  [BonusCardName.EXPEDITED_CONSTRUCTION]: ExpeditedConstruction,
  [BonusCardName.LOBBYISTS]: Lobbyists,
  [BonusCardName.LOCAL_NEURAL_INSTANCE]: LocalNeuralInstance,
  [BonusCardName.CORPORATE_COMPETITION]: CorporateCompetition,
  [BonusCardName.CORPORATE_COMPETITION_HELLAS]: CorporateCompetitionHellas,
  [BonusCardName.CORPORATE_COMPETITION_ELYSIUM]: CorporateCompetitionElysium,
  [BonusCardName.CORPORATE_COMPETITION_UTOPIA]: CorporateCompetitionUtopia,
  [BonusCardName.CORPORATE_COMPETITION_CIMMERIA]: CorporateCompetitionCimmeria,
  [BonusCardName.CORPORATE_COMPETITION_BOREALIS]: CorporateCompetitionBorealis,
  [BonusCardName.CORPORATE_COMPETITION_MA]: CorporateCompetitionMA,
  [BonusCardName.LOBBYISTS_VENUS]: LobbyistsVenus,
  [BonusCardName.GOVERNMENT_INTERVENTION]: GovernmentIntervention,
  [BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES]: ExpeditedConstructionColonies,
  [BonusCardName.OUTER_SYSTEM_FOOTHOLD]: OuterSystemFoothold,
  [BonusCardName.SHIPPING_LINES]: ShippingLines,
  [BonusCardName.EXTENDED_SHIPPING_LINES]: ExtendedShippingLines,
  [BonusCardName.PARTY_POLITICS]: PartyPolitics,
  [BonusCardName.SETTLERS]: Settlers,
  [BonusCardName.RAPID_SPROUTING]: RapidSprouting,
  [BonusCardName.SUPPLY_AND_DEMAND]: SupplyAndDemand,
  [BonusCardName.DO_IT_RIGHT]: DoItRight,
  [BonusCardName.VENUSIAN_LOBBY]: VenusianLobby,
  [BonusCardName.BUILD_BUILD_BUILD]: BuildBuildBuild,
  [BonusCardName.DIVERSIFICATION]: Diversification,
  [BonusCardName.GRAY_EMINENCE]: GrayEminence,
  [BonusCardName.INTERFACE_HYPERLINK]: InterfaceHyperlink,
  [BonusCardName.GOVERNMENT_SUBSIDY]: GovernmentSubsidy,
  [BonusCardName.INVESTORS]: Investors,
};

/**
 * Create a single bonus card by name, from any set.
 *
 * Throws for a name with no card, such as one read from a corrupt saved game.
 */
export function createBonusCard(name: BonusCardName): MarsBotBonusCard {
  const Klass = CARD_CLASSES[name];
  if (Klass === undefined) {
    throw new Error(`No MarsBot bonus card ${name}`);
  }
  return new Klass();
}
