import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
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
  module: GameModule.Prelude,
  projectCards: [
    CardManifest.dynamicFactory(CardName.SF_MEMORIAL, SFMemorial),
    CardManifest.dynamicFactory(CardName.HOUSE_PRINTING, HousePrinting),
    CardManifest.dynamicFactory(CardName.SPACE_HOTELS, SpaceHotels),
    CardManifest.staticFactory(CardName.MARTIAN_SURVEY, new MartianSurvey()),
    CardManifest.dynamicFactory(CardName.RESEARCH_COORDINATION, ResearchCoordination),
    CardManifest.dynamicFactory(CardName.LAVA_TUBE_SETTLEMENT, LavaTubeSettlement),
    CardManifest.dynamicFactory(CardName.PSYCHROPHILES, Psychrophiles),
  ],

  corporationCards: [
    CardManifest.dynamicFactory(CardName.CHEUNG_SHING_MARS, CheungShingMARS),
    CardManifest.dynamicFactory(CardName.POINT_LUNA, PointLuna),
    CardManifest.dynamicFactory(CardName.ROBINSON_INDUSTRIES, RobinsonIndustries),
    CardManifest.dynamicFactory(CardName.VALLEY_TRUST, ValleyTrust),
    CardManifest.dynamicFactory(CardName.VITOR, Vitor),
  ],

  preludeCards: [
    CardManifest.dynamicFactory(CardName.ALLIED_BANKS, AlliedBanks),
    CardManifest.dynamicFactory(CardName.BIOSPHERE_SUPPORT, BiosphereSupport),
    CardManifest.dynamicFactory(CardName.AQUIFER_TURBINES, AquiferTurbines),
    CardManifest.dynamicFactory(CardName.MOHOLE_EXCAVATION, MoholeExcavation),
    CardManifest.dynamicFactory(CardName.EARLY_SETTLEMENT, EarlySettlement),
    CardManifest.dynamicFactory(CardName.BIOFUELS, Biofuels),
    CardManifest.dynamicFactory(CardName.POWER_GENERATION, PowerGeneration),
    CardManifest.dynamicFactory(CardName.SELF_SUFFICIENT_SETTLEMENT, SelfSufficientSettlement),
    CardManifest.dynamicFactory(CardName.MINING_OPERATIONS, MiningOperations),
    CardManifest.dynamicFactory(CardName.UNMI_CONTRACTOR, UNMIContractor),
    CardManifest.dynamicFactory(CardName.DOME_FARMING, DomeFarming),
    CardManifest.dynamicFactory(CardName.BUSINESS_EMPIRE, BusinessEmpire),
    CardManifest.dynamicFactory(CardName.DONATION, Donation),
    CardManifest.dynamicFactory(CardName.NITROGEN_SHIPMENT, NitrogenDelivery),
    CardManifest.dynamicFactory(CardName.SMELTING_PLANT, SmeltingPlant),
    CardManifest.dynamicFactory(CardName.SUPPLIER, Supplier),
    CardManifest.dynamicFactory(CardName.SUPPLY_DROP, SupplyDrop),
    CardManifest.dynamicFactory(CardName.GREAT_AQUIFER, GreatAquifer),
    CardManifest.dynamicFactory(CardName.BIOLAB, Biolab),
    CardManifest.dynamicFactory(CardName.MARTIAN_INDUSTRIES, MartianIndustries),
    CardManifest.dynamicFactory(CardName.IO_RESEARCH_OUTPOST, IoResearchOutpost),
    CardManifest.dynamicFactory(CardName.POLAR_INDUSTRIES, PolarIndustries),
    CardManifest.dynamicFactory(CardName.SOCIETY_SUPPORT, SocietySupport),
    CardManifest.dynamicFactory(CardName.GALILEAN_MINING, GalileanMining),
    CardManifest.dynamicFactory(CardName.HUGE_ASTEROID, HugeAsteroid),
    CardManifest.dynamicFactory(CardName.METALS_COMPANY, MetalsCompany),
    CardManifest.dynamicFactory(CardName.LOAN, Loan),
    CardManifest.dynamicFactory(CardName.MOHOLE, Mohole),
    CardManifest.dynamicFactory(CardName.METAL_RICH_ASTEROID, MetalRichAsteroid),
    CardManifest.dynamicFactory(CardName.ORBITAL_CONSTRUCTION_YARD, OrbitalConstructionYard),
    CardManifest.dynamicFactory(CardName.ACQUIRED_SPACE_AGENCY, AcquiredSpaceAgency),
    CardManifest.dynamicFactory(CardName.RESEARCH_NETWORK, ResearchNetwork),
    CardManifest.dynamicFactory(CardName.ECCENTRIC_SPONSOR, EccentricSponsor),
    CardManifest.dynamicFactory(CardName.ECOLOGY_EXPERTS, EcologyExperts),
    CardManifest.dynamicFactory(CardName.EXPERIMENTAL_FOREST, ExperimentalForest),
  ],
});
