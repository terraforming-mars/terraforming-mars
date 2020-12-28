import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {Advertising} from './Advertising';
import {ArcadianCommunities} from './ArcadianCommunities';
import {AsteroidDeflectionSystem} from './AsteroidDeflectionSystem';
import {AsteroidHollowing} from './AsteroidHollowing';
import {AsteroidRights} from './AsteroidRights';
import {Astrodrill} from './Astrodrill';
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
    CardManifest.dynamicFactory(CardName.PENGUINS, Penguins),
    CardManifest.dynamicFactory(CardName.SELF_REPLICATING_ROBOTS, SelfReplicatingRobots),
    CardManifest.staticFactory(CardName.SMALL_ASTEROID, new SmallAsteroid()),
    CardManifest.dynamicFactory(CardName.SNOW_ALGAE, SnowAlgae),
    CardManifest.dynamicFactory(CardName.DUSK_LASER_MINING, DuskLaserMining),
    CardManifest.dynamicFactory(CardName.MERCURIAN_ALLOYS, MercurianAlloys),
    CardManifest.dynamicFactory(CardName.REGO_PLASTICS, RegoPlastics),
    CardManifest.dynamicFactory(CardName.INTERPLANETARY_TRADE, InterplanetaryTrade),
    CardManifest.dynamicFactory(CardName.ORBITAL_CLEANUP, OrbitalCleanup),
    CardManifest.staticFactory(CardName.PROJECT_INSPECTION, new ProjectInspection()),
    CardManifest.dynamicFactory(CardName.HI_TECH_LAB, HiTechLab),
    CardManifest.dynamicFactory(CardName.ENERGY_MARKET, EnergyMarket),
    CardManifest.staticFactory(CardName.LAW_SUIT, new LawSuit()),
    CardManifest.dynamicFactory(CardName.STANFORD_TORUS, StanfordTorus),
    CardManifest.dynamicFactory(CardName.ASTEROID_HOLLOWING, AsteroidHollowing),
    CardManifest.dynamicFactory(CardName.ASTEROID_RIGHTS, AsteroidRights),
    CardManifest.dynamicFactory(CardName.COMET_AIMING, CometAiming),
    CardManifest.dynamicFactory(CardName.CUTTING_EDGE_TECHNOLOGY, CuttingEdgeTechnology),
    CardManifest.staticFactory(CardName.CRASH_SITE_CLEANUP, new CrashSiteCleanup()),
    CardManifest.dynamicFactory(CardName.DIRECTED_IMPACTORS, DirectedImpactors),
    CardManifest.dynamicFactory(CardName.FIELD_CAPPED_CITY, FieldCappedCity),
    CardManifest.dynamicFactory(CardName.MAGNETIC_SHIELD, MagneticShield),
    CardManifest.dynamicFactory(CardName.MELTWORKS, Meltworks),
    CardManifest.dynamicFactory(CardName.MOHOLE_LAKE, MoholeLake),
    CardManifest.staticFactory(CardName.DIVERSITY_SUPPORT, new DiversitySupport()),
    CardManifest.dynamicFactory(CardName.JOVIAN_EMBASSY, JovianEmbassy),
    CardManifest.dynamicFactory(CardName.TOPSOIL_CONTRACT, TopsoilContract),
    CardManifest.staticFactory(CardName.IMPORTED_NUTRIENTS, new ImportedNutrients()),
    CardManifest.dynamicFactory(CardName.ASTEROID_DEFLECTION_SYSTEM, AsteroidDeflectionSystem),
    CardManifest.dynamicFactory(CardName.SUB_CRUST_MEASUREMENTS, SubCrustMeasurements),
    CardManifest.dynamicFactory(CardName.POTATOES, Potatoes),
    CardManifest.dynamicFactory(CardName.MEAT_INDUSTRY, MeatIndustry),
    CardManifest.dynamicFactory(CardName.ADVERTISING, Advertising),
    CardManifest.staticFactory(CardName.DEIMOS_DOWN_PROMO, new DeimosDownPromo()),
    CardManifest.dynamicFactory(CardName.GREAT_DAM_PROMO, GreatDamPromo),
    CardManifest.dynamicFactory(CardName.MAGNETIC_FIELD_GENERATORS_PROMO, MagneticFieldGeneratorsPromo),
    CardManifest.dynamicFactory(CardName.SATURN_SURFING, SaturnSurfing),
  ],

  projectCardsToRemove: [
    CardName.DEIMOS_DOWN,
    CardName.GREAT_DAM,
    CardName.MAGNETIC_FIELD_GENERATORS],

  corporationCards: [
    CardManifest.dynamicFactory(CardName.ARCADIAN_COMMUNITIES, ArcadianCommunities),
    CardManifest.dynamicFactory(CardName.ASTRODRILL, Astrodrill),
    CardManifest.dynamicFactory(CardName.FACTORUM, Factorum),
    CardManifest.dynamicFactory(CardName.PHARMACY_UNION, PharmacyUnion),
    CardManifest.dynamicFactory(CardName.PHILARES, Philares),
    CardManifest.dynamicFactory(CardName.MONS_INSURANCE, MonsInsurance),
    CardManifest.dynamicFactory(CardName.RECYCLON, Recyclon),
    CardManifest.dynamicFactory(CardName.SPLICE, Splice),
  ]});
