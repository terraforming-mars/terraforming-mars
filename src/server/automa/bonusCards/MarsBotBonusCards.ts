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

const FACTORIES: ReadonlyArray<new () => MarsBotBonusCard> = [
  MeteorShower,
  InvasiveSpecies,
  ResearchAndDevelopment,
  Overachievement,
  ExpeditedConstruction,
  Lobbyists,
  LocalNeuralInstance,
  CorporateCompetition,
  CorporateCompetitionHellas,
  CorporateCompetitionElysium,
  CorporateCompetitionUtopia,
  CorporateCompetitionCimmeria,
  CorporateCompetitionBorealis,
  CorporateCompetitionMA,
  LobbyistsVenus,
  GovernmentIntervention,
  ExpeditedConstructionColonies,
  OuterSystemFoothold,
  ShippingLines,
  ExtendedShippingLines,
  PartyPolitics,
  Settlers,
  RapidSprouting,
  SupplyAndDemand,
  DoItRight,
  VenusianLobby,
  BuildBuildBuild,
  Diversification,
  GrayEminence,
  InterfaceHyperlink,
  GovernmentSubsidy,
  Investors,
];

const BY_NAME: Map<BonusCardName, new () => MarsBotBonusCard> = new Map(FACTORIES.map((Klass) => [new Klass().name, Klass]));

/** Create the base set of bonus cards (B01-B08). */
export function createBaseBonusCards(): Array<MarsBotBonusCard> {
  return [
    BonusCardName.METEOR_SHOWER,
    BonusCardName.INVASIVE_SPECIES,
    BonusCardName.RESEARCH_AND_DEVELOPMENT,
    BonusCardName.OVERACHIEVEMENT,
    BonusCardName.EXPEDITED_CONSTRUCTION,
    BonusCardName.LOBBYISTS,
    BonusCardName.LOCAL_NEURAL_INSTANCE,
    BonusCardName.CORPORATE_COMPETITION,
  ].map(createBonusCard);
}

/** Create a single bonus card by name, from any set. */
export function createBonusCard(name: BonusCardName): MarsBotBonusCard {
  const Klass = BY_NAME.get(name);
  if (Klass === undefined) {
    throw new Error(`No MarsBot bonus card ${name}`);
  }
  return new Klass();
}
