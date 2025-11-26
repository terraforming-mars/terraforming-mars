import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {AcquiredSpaceAgency} from '@/server/cards/prelude/AcquiredSpaceAgency';
import {AlliedBanks} from '@/server/cards/prelude/AlliedBanks';
import {AquiferTurbines} from '@/server/cards/prelude/AquiferTurbines';
import {Biofuels} from '@/server/cards/prelude/Biofuels';
import {Biolab} from '@/server/cards/prelude/Biolab';
import {BiosphereSupport} from '@/server/cards/prelude/BiosphereSupport';
import {BusinessEmpire} from '@/server/cards/prelude/BusinessEmpire';
import {CheungShingMARS} from '@/server/cards/prelude/CheungShingMARS';
import {DomeFarming} from '@/server/cards/prelude/DomeFarming';
import {Donation} from '@/server/cards/prelude/Donation';
import {EarlySettlement} from '@/server/cards/prelude/EarlySettlement';
import {EccentricSponsor} from '@/server/cards/prelude/EccentricSponsor';
import {EcologyExperts} from '@/server/cards/prelude/EcologyExperts';
import {ExperimentalForest} from '@/server/cards/prelude/ExperimentalForest';
import {GalileanMining} from '@/server/cards/prelude/GalileanMining';
import {GreatAquifer} from '@/server/cards/prelude/GreatAquifer';
import {HousePrinting} from '@/server/cards/prelude/HousePrinting';
import {HugeAsteroid} from '@/server/cards/prelude/HugeAsteroid';
import {IoResearchOutpost} from '@/server/cards/prelude/IoResearchOutpost';
import {LavaTubeSettlement} from '@/server/cards/prelude/LavaTubeSettlement';
import {Loan} from '@/server/cards/prelude/Loan';
import {MartianIndustries} from '@/server/cards/prelude/MartianIndustries';
import {MartianSurvey} from '@/server/cards/prelude/MartianSurvey';
import {MetalRichAsteroid} from '@/server/cards/prelude/MetalRichAsteroid';
import {MetalsCompany} from '@/server/cards/prelude/MetalsCompany';
import {MiningOperations} from '@/server/cards/prelude/MiningOperations';
import {Mohole} from '@/server/cards/prelude/Mohole';
import {MoholeExcavation} from '@/server/cards/prelude/MoholeExcavation';
import {NitrogenShipment} from '@/server/cards/prelude/NitrogenShipment';
import {OrbitalConstructionYard} from '@/server/cards/prelude/OrbitalConstructionYard';
import {PointLuna} from '@/server/cards/prelude/PointLuna';
import {PolarIndustries} from '@/server/cards/prelude/PolarIndustries';
import {PowerGeneration} from '@/server/cards/prelude/PowerGeneration';
import {Psychrophiles} from '@/server/cards/prelude/Psychrophiles';
import {ResearchCoordination} from '@/server/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '@/server/cards/prelude/ResearchNetwork';
import {RobinsonIndustries} from '@/server/cards/prelude/RobinsonIndustries';
import {SelfSufficientSettlement} from '@/server/cards/prelude/SelfSufficientSettlement';
import {SFMemorial} from '@/server/cards/prelude/SFMemorial';
import {SmeltingPlant} from '@/server/cards/prelude/SmeltingPlant';
import {SocietySupport} from '@/server/cards/prelude/SocietySupport';
import {SpaceHotels} from '@/server/cards/prelude/SpaceHotels';
import {Supplier} from '@/server/cards/prelude/Supplier';
import {SupplyDrop} from '@/server/cards/prelude/SupplyDrop';
import {UNMIContractor} from '@/server/cards/prelude/UNMIContractor';
import {ValleyTrust} from '@/server/cards/prelude/ValleyTrust';
import {Vitor} from '@/server/cards/prelude/Vitor';

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
