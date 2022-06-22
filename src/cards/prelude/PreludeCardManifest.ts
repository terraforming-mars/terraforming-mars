import {CardName} from '../../common/cards/CardName';
import {CardManifest} from '../CardManifest';
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
import {NitrogenDelivery} from './NitrogenDelivery';
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

export const PRELUDE_CARD_MANIFEST = new CardManifest({
  module: 'prelude',
  projectCards: [
    {cardName: CardName.SF_MEMORIAL, Factory: SFMemorial},
    {cardName: CardName.HOUSE_PRINTING, Factory: HousePrinting},
    {cardName: CardName.SPACE_HOTELS, Factory: SpaceHotels},
    {cardName: CardName.MARTIAN_SURVEY, Factory: MartianSurvey},
    {cardName: CardName.RESEARCH_COORDINATION, Factory: ResearchCoordination},
    {cardName: CardName.LAVA_TUBE_SETTLEMENT, Factory: LavaTubeSettlement},
    {cardName: CardName.PSYCHROPHILES, Factory: Psychrophiles},
  ],

  corporationCards: [
    {cardName: CardName.CHEUNG_SHING_MARS, Factory: CheungShingMARS},
    {cardName: CardName.POINT_LUNA, Factory: PointLuna},
    {cardName: CardName.ROBINSON_INDUSTRIES, Factory: RobinsonIndustries},
    {cardName: CardName.VALLEY_TRUST, Factory: ValleyTrust},
    {cardName: CardName.VITOR, Factory: Vitor},
  ],

  preludeCards: [
    {cardName: CardName.ALLIED_BANKS, Factory: AlliedBanks},
    {cardName: CardName.BIOSPHERE_SUPPORT, Factory: BiosphereSupport},
    {cardName: CardName.AQUIFER_TURBINES, Factory: AquiferTurbines},
    {cardName: CardName.MOHOLE_EXCAVATION, Factory: MoholeExcavation},
    {cardName: CardName.EARLY_SETTLEMENT, Factory: EarlySettlement},
    {cardName: CardName.BIOFUELS, Factory: Biofuels},
    {cardName: CardName.POWER_GENERATION, Factory: PowerGeneration},
    {cardName: CardName.SELF_SUFFICIENT_SETTLEMENT, Factory: SelfSufficientSettlement},
    {cardName: CardName.MINING_OPERATIONS, Factory: MiningOperations},
    {cardName: CardName.UNMI_CONTRACTOR, Factory: UNMIContractor},
    {cardName: CardName.DOME_FARMING, Factory: DomeFarming},
    {cardName: CardName.BUSINESS_EMPIRE, Factory: BusinessEmpire},
    {cardName: CardName.DONATION, Factory: Donation},
    {cardName: CardName.NITROGEN_SHIPMENT, Factory: NitrogenDelivery},
    {cardName: CardName.SMELTING_PLANT, Factory: SmeltingPlant},
    {cardName: CardName.SUPPLIER, Factory: Supplier},
    {cardName: CardName.SUPPLY_DROP, Factory: SupplyDrop},
    {cardName: CardName.GREAT_AQUIFER, Factory: GreatAquifer},
    {cardName: CardName.BIOLAB, Factory: Biolab},
    {cardName: CardName.MARTIAN_INDUSTRIES, Factory: MartianIndustries},
    {cardName: CardName.IO_RESEARCH_OUTPOST, Factory: IoResearchOutpost},
    {cardName: CardName.POLAR_INDUSTRIES, Factory: PolarIndustries},
    {cardName: CardName.SOCIETY_SUPPORT, Factory: SocietySupport},
    {cardName: CardName.GALILEAN_MINING, Factory: GalileanMining},
    {cardName: CardName.HUGE_ASTEROID, Factory: HugeAsteroid},
    {cardName: CardName.METALS_COMPANY, Factory: MetalsCompany},
    {cardName: CardName.LOAN, Factory: Loan},
    {cardName: CardName.MOHOLE, Factory: Mohole},
    {cardName: CardName.METAL_RICH_ASTEROID, Factory: MetalRichAsteroid},
    {cardName: CardName.ORBITAL_CONSTRUCTION_YARD, Factory: OrbitalConstructionYard},
    {cardName: CardName.ACQUIRED_SPACE_AGENCY, Factory: AcquiredSpaceAgency},
    {cardName: CardName.RESEARCH_NETWORK, Factory: ResearchNetwork},
    {cardName: CardName.ECCENTRIC_SPONSOR, Factory: EccentricSponsor},
    {cardName: CardName.ECOLOGY_EXPERTS, Factory: EcologyExperts},
    {cardName: CardName.EXPERIMENTAL_FOREST, Factory: ExperimentalForest},
  ],
});
