import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {Advertising} from './Advertising';
import {ArcadianCommunities} from './ArcadianCommunities';
import {AsteroidDeflectionSystem} from './AsteroidDeflectionSystem';
import {AsteroidHollowing} from './AsteroidHollowing';
import {AsteroidRights} from './AsteroidRights';
import {Astrodrill} from './Astrodrill';
import {BactoviralResearch} from './BactoviralResearch';
import {BioPrintingFacility} from './BioPrintingFacility';
import {CometAiming} from './CometAiming';
import {CrashSiteCleanup} from './CrashSiteCleanup';
import {CuttingEdgeTechnology} from './CuttingEdgeTechnology';
import {DeimosDownPromo} from './DeimosDownPromo';
import {DirectedImpactors} from './DirectedImpactors';
import {DiversitySupport} from './DiversitySupport';
import {DuskLaserMining} from './DuskLaserMining';
import {EnergyMarket} from './EnergyMarket';
import {Factorum} from './Factorum';
import {FieldCappedCity} from './FieldCappedCity';
import {GreatDamPromo} from './GreatDamPromo';
import {Harvest} from './Harvest';
import {HiTechLab} from './HiTechLab';
import {ImportedNutrients} from './ImportedNutrients';
import {InterplanetaryTrade} from './InterplanetaryTrade';
import {JovianEmbassy} from './JovianEmbassy';
import {LawSuit} from './LawSuit';
import {MagneticFieldGeneratorsPromo} from './MagneticFieldGeneratorsPromo';
import {MagneticShield} from './MagneticShield';
import {MeatIndustry} from './MeatIndustry';
import {Meltworks} from './Meltworks';
import {MercurianAlloys} from './MercurianAlloys';
import {MoholeLake} from './MoholeLake';
import {MonsInsurance} from './MonsInsurance';
import {OrbitalCleanup} from './OrbitalCleanup';
import {OutdoorSports} from './OutdoorSports';
import {Penguins} from './Penguins';
import {PharmacyUnion} from './PharmacyUnion';
import {Philares} from './Philares';
import {Potatoes} from './Potatoes';
import {ProjectInspection} from './ProjectInspection';
import {Recyclon} from './Recyclon';
import {RegoPlastics} from './RegoPlastics';
import {SaturnSurfing} from './SaturnSurfing';
import {SelfReplicatingRobots} from './SelfReplicatingRobots';
import {SmallAsteroid} from './SmallAsteroid';
import {SnowAlgae} from './SnowAlgae';
import {Splice} from './Splice';
import {StanfordTorus} from './StanfordTorus';
import {SubCrustMeasurements} from './SubCrustMeasurements';
import {TopsoilContract} from './TopsoilContract';

export const PROMO_CARD_MANIFEST = new CardManifest({
  module: GameModule.Promo,
  projectCards: [
    {cardName: CardName.PENGUINS, Factory: Penguins},
    {cardName: CardName.SELF_REPLICATING_ROBOTS, Factory: SelfReplicatingRobots},
    {cardName: CardName.SMALL_ASTEROID, Factory: SmallAsteroid},
    {cardName: CardName.SNOW_ALGAE, Factory: SnowAlgae},
    {cardName: CardName.DUSK_LASER_MINING, Factory: DuskLaserMining},
    {cardName: CardName.MERCURIAN_ALLOYS, Factory: MercurianAlloys},
    {cardName: CardName.REGO_PLASTICS, Factory: RegoPlastics},
    {cardName: CardName.INTERPLANETARY_TRADE, Factory: InterplanetaryTrade},
    {cardName: CardName.ORBITAL_CLEANUP, Factory: OrbitalCleanup},
    {cardName: CardName.PROJECT_INSPECTION, Factory: ProjectInspection},
    {cardName: CardName.HI_TECH_LAB, Factory: HiTechLab},
    {cardName: CardName.ENERGY_MARKET, Factory: EnergyMarket},
    {cardName: CardName.LAW_SUIT, Factory: LawSuit},
    {cardName: CardName.STANFORD_TORUS, Factory: StanfordTorus},
    {cardName: CardName.ASTEROID_HOLLOWING, Factory: AsteroidHollowing},
    {cardName: CardName.ASTEROID_RIGHTS, Factory: AsteroidRights},
    {cardName: CardName.COMET_AIMING, Factory: CometAiming},
    {cardName: CardName.CUTTING_EDGE_TECHNOLOGY, Factory: CuttingEdgeTechnology},
    {cardName: CardName.CRASH_SITE_CLEANUP, Factory: CrashSiteCleanup},
    {cardName: CardName.DIRECTED_IMPACTORS, Factory: DirectedImpactors},
    {cardName: CardName.FIELD_CAPPED_CITY, Factory: FieldCappedCity},
    {cardName: CardName.MAGNETIC_SHIELD, Factory: MagneticShield},
    {cardName: CardName.MELTWORKS, Factory: Meltworks},
    {cardName: CardName.MOHOLE_LAKE, Factory: MoholeLake},
    {cardName: CardName.DIVERSITY_SUPPORT, Factory: DiversitySupport},
    {cardName: CardName.JOVIAN_EMBASSY, Factory: JovianEmbassy},
    {cardName: CardName.TOPSOIL_CONTRACT, Factory: TopsoilContract},
    {cardName: CardName.IMPORTED_NUTRIENTS, Factory: ImportedNutrients},
    {cardName: CardName.ASTEROID_DEFLECTION_SYSTEM, Factory: AsteroidDeflectionSystem},
    {cardName: CardName.SUB_CRUST_MEASUREMENTS, Factory: SubCrustMeasurements},
    {cardName: CardName.POTATOES, Factory: Potatoes},
    {cardName: CardName.MEAT_INDUSTRY, Factory: MeatIndustry},
    {cardName: CardName.ADVERTISING, Factory: Advertising},
    {cardName: CardName.DEIMOS_DOWN_PROMO, Factory: DeimosDownPromo},
    {cardName: CardName.GREAT_DAM_PROMO, Factory: GreatDamPromo},
    {cardName: CardName.MAGNETIC_FIELD_GENERATORS_PROMO, Factory: MagneticFieldGeneratorsPromo},
    {cardName: CardName.SATURN_SURFING, Factory: SaturnSurfing},
    {cardName: CardName.BIO_PRINTING_FACILITY, Factory: BioPrintingFacility},
    {cardName: CardName.BACTOVIRAL_RESEARCH, Factory: BactoviralResearch},
    {cardName: CardName.HARVEST, Factory: Harvest},
    {cardName: CardName.OUTDOOR_SPORTS, Factory: OutdoorSports},
  ],

  cardsToRemove: [
    CardName.DEIMOS_DOWN,
    CardName.GREAT_DAM,
    CardName.MAGNETIC_FIELD_GENERATORS],

  corporationCards: [
    {cardName: CardName.ARCADIAN_COMMUNITIES, Factory: ArcadianCommunities},
    {cardName: CardName.ASTRODRILL, Factory: Astrodrill},
    {cardName: CardName.FACTORUM, Factory: Factorum},
    {cardName: CardName.PHARMACY_UNION, Factory: PharmacyUnion},
    {cardName: CardName.PHILARES, Factory: Philares},
    {cardName: CardName.MONS_INSURANCE, Factory: MonsInsurance},
    {cardName: CardName.RECYCLON, Factory: Recyclon},
    {cardName: CardName.SPLICE, Factory: Splice},
  ]});
