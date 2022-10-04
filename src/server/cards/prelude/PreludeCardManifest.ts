import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AcquiredSpaceAgency} from './AcquiredSpaceAgency';
import {AlliedBanks} from './AlliedBanks';
import {AquiferTurbines} from './AquiferTurbines';
import {Biofuels} from './Biofuels';
import {Biolab} from './Biolab';
import {BiosphereSupport} from './BiosphereSupport';
import {BusinessEmpire} from './BusinessEmpire';
import {CheungShingMARS} from './CheungShingMARS';
import {DomeFarming} from './DomeFarming';
import {Donation} from './Donation';
import {EarlySettlement} from './EarlySettlement';
import {EccentricSponsor} from './EccentricSponsor';
import {EcologyExperts} from './EcologyExperts';
import {ExperimentalForest} from './ExperimentalForest';
import {GalileanMining} from './GalileanMining';
import {GreatAquifer} from './GreatAquifer';
import {HousePrinting} from './HousePrinting';
import {HugeAsteroid} from './HugeAsteroid';
import {IoResearchOutpost} from './IoResearchOutpost';
import {LavaTubeSettlement} from './LavaTubeSettlement';
import {Loan} from './Loan';
import {MartianIndustries} from './MartianIndustries';
import {MartianSurvey} from './MartianSurvey';
import {MetalRichAsteroid} from './MetalRichAsteroid';
import {MetalsCompany} from './MetalsCompany';
import {MiningOperations} from './MiningOperations';
import {Mohole} from './Mohole';
import {MoholeExcavation} from './MoholeExcavation';
import {NitrogenShipment} from './NitrogenShipment';
import {OrbitalConstructionYard} from './OrbitalConstructionYard';
import {PointLuna} from './PointLuna';
import {PolarIndustries} from './PolarIndustries';
import {PowerGeneration} from './PowerGeneration';
import {Psychrophiles} from './Psychrophiles';
import {ResearchCoordination} from './ResearchCoordination';
import {ResearchNetwork} from './ResearchNetwork';
import {RobinsonIndustries} from './RobinsonIndustries';
import {SelfSufficientSettlement} from './SelfSufficientSettlement';
import {SFMemorial} from './SFMemorial';
import {SmeltingPlant} from './SmeltingPlant';
import {SocietySupport} from './SocietySupport';
import {SpaceHotels} from './SpaceHotels';
import {Supplier} from './Supplier';
import {SupplyDrop} from './SupplyDrop';
import {UNMIContractor} from './UNMIContractor';
import {ValleyTrust} from './ValleyTrust';
import {Vitor} from './Vitor';

export const PRELUDE_CARD_MANIFEST = new ModuleManifest({
  module: 'prelude',
  projectCards: {
    [CardName.SF_MEMORIAL]: {Factory: SFMemorial},
    [CardName.HOUSE_PRINTING]: {Factory: HousePrinting},
    [CardName.SPACE_HOTELS]: {Factory: SpaceHotels},
    [CardName.MARTIAN_SURVEY]: {Factory: MartianSurvey},
    [CardName.RESEARCH_COORDINATION]: {Factory: ResearchCoordination},
    [CardName.LAVA_TUBE_SETTLEMENT]: {Factory: LavaTubeSettlement},
    [CardName.PSYCHROPHILES]: {Factory: Psychrophiles},
  },

  corporationCards: {
    [CardName.CHEUNG_SHING_MARS]: {Factory: CheungShingMARS},
    [CardName.POINT_LUNA]: {Factory: PointLuna},
    [CardName.ROBINSON_INDUSTRIES]: {Factory: RobinsonIndustries},
    [CardName.VALLEY_TRUST]: {Factory: ValleyTrust},
    [CardName.VITOR]: {Factory: Vitor},
  },

  preludeCards: {
    [CardName.ALLIED_BANK]: {Factory: AlliedBanks},
    [CardName.BIOSPHERE_SUPPORT]: {Factory: BiosphereSupport},
    [CardName.AQUIFER_TURBINES]: {Factory: AquiferTurbines},
    [CardName.MOHOLE_EXCAVATION]: {Factory: MoholeExcavation},
    [CardName.EARLY_SETTLEMENT]: {Factory: EarlySettlement},
    [CardName.BIOFUELS]: {Factory: Biofuels},
    [CardName.POWER_GENERATION]: {Factory: PowerGeneration},
    [CardName.SELF_SUFFICIENT_SETTLEMENT]: {Factory: SelfSufficientSettlement},
    [CardName.MINING_OPERATIONS]: {Factory: MiningOperations},
    [CardName.UNMI_CONTRACTOR]: {Factory: UNMIContractor},
    [CardName.DOME_FARMING]: {Factory: DomeFarming},
    [CardName.BUSINESS_EMPIRE]: {Factory: BusinessEmpire},
    [CardName.DONATION]: {Factory: Donation},
    [CardName.NITROGEN_SHIPMENT]: {Factory: NitrogenShipment},
    [CardName.SMELTING_PLANT]: {Factory: SmeltingPlant},
    [CardName.SUPPLIER]: {Factory: Supplier},
    [CardName.SUPPLY_DROP]: {Factory: SupplyDrop},
    [CardName.GREAT_AQUIFER]: {Factory: GreatAquifer},
    [CardName.BIOLAB]: {Factory: Biolab},
    [CardName.MARTIAN_INDUSTRIES]: {Factory: MartianIndustries},
    [CardName.IO_RESEARCH_OUTPOST]: {Factory: IoResearchOutpost},
    [CardName.POLAR_INDUSTRIES]: {Factory: PolarIndustries},
    [CardName.SOCIETY_SUPPORT]: {Factory: SocietySupport},
    [CardName.GALILEAN_MINING]: {Factory: GalileanMining},
    [CardName.HUGE_ASTEROID]: {Factory: HugeAsteroid},
    [CardName.METALS_COMPANY]: {Factory: MetalsCompany},
    [CardName.LOAN]: {Factory: Loan},
    [CardName.MOHOLE]: {Factory: Mohole},
    [CardName.METAL_RICH_ASTEROID]: {Factory: MetalRichAsteroid},
    [CardName.ORBITAL_CONSTRUCTION_YARD]: {Factory: OrbitalConstructionYard},
    [CardName.ACQUIRED_SPACE_AGENCY]: {Factory: AcquiredSpaceAgency},
    [CardName.RESEARCH_NETWORK]: {Factory: ResearchNetwork},
    [CardName.ECCENTRIC_SPONSOR]: {Factory: EccentricSponsor},
    [CardName.ECOLOGY_EXPERTS]: {Factory: EcologyExperts},
    [CardName.EXPERIMENTAL_FOREST]: {Factory: ExperimentalForest},
  },
});
