import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {Advertising} from './Advertising';
import {AntidesertificationTechniques} from './AntidesertificationTechniques';
import {AqueductSystems} from './AqueductSystems';
import {ArcadianCommunities} from './ArcadianCommunities';
import {AsteroidDeflectionSystem} from './AsteroidDeflectionSystem';
import {AsteroidHollowing} from './AsteroidHollowing';
import {AsteroidRights} from './AsteroidRights';
import {AstraMechanica} from './AstraMechanica';
import {Astrodrill} from './Astrodrill';
import {BactoviralResearch} from './BactoviralResearch';
import {BioPrintingFacility} from './BioPrintingFacility';
import {CarbonNanosystems} from './CarbonNanosystems';
import {CityPark} from './CityPark';
import {CometAiming} from './CometAiming';
import {CorporateArchives} from './CorporateArchives';
import {CrashSiteCleanup} from './CrashSiteCleanup';
import {CuttingEdgeTechnology} from './CuttingEdgeTechnology';
import {CyberiaSystems} from './CyberiaSystems';
import {DeimosDownPromo} from './DeimosDownPromo';
import {DirectedHeatUsage} from './DirectedHeatUsage';
import {DirectedImpactors} from './DirectedImpactors';
import {DiversitySupport} from './DiversitySupport';
import {DoubleDown} from './DoubleDown';
import {DuskLaserMining} from './DuskLaserMining';
import {EnergyMarket} from './EnergyMarket';
import {Factorum} from './Factorum';
import {FieldCappedCity} from './FieldCappedCity';
import {FloydContinuum} from './FloydContinuum';
import {GiantSolarCollector} from './GiantSolarCollector';
import {GreatDamPromo} from './GreatDamPromo';
import {Harvest} from './Harvest';
// import {HeadStart} from './HeadStart';
import {HermeticOrderOfMars} from './HermeticOrderofMars';
import {HiTechLab} from './HiTechLab';
import {HomeostasisBureau} from './HomeostasisBureau';
import {IcyImpactors} from './IcyImpactors';
import {ImportedNutrients} from './ImportedNutrients';
import {InterplanetaryTrade} from './InterplanetaryTrade';
import {JovianEmbassy} from './JovianEmbassy';
import {KaguyaTech} from './KaguyaTech';
import {KuiperCooperative} from './KuiperCooperative';
import {LawSuit} from './LawSuit';
import {MagneticFieldGeneratorsPromo} from './MagneticFieldGeneratorsPromo';
import {MagneticShield} from './MagneticShield';
import {MarsNomads} from './MarsNomads';
import {MartianLumberCorp} from './MartianLumberCorp';
import {MeatIndustry} from './MeatIndustry';
import {Meltworks} from './Meltworks';
import {MercurianAlloys} from './MercurianAlloys';
import {Merger} from './Merger';
import {MoholeLake} from './MoholeLake';
import {MonsInsurance} from './MonsInsurance';
import {NeptunianPowerConsultants} from './NeptunianPowerConsultants';
import {NewPartner} from './NewPartner';
import {OrbitalCleanup} from './OrbitalCleanup';
import {OutdoorSports} from './OutdoorSports';
import {Penguins} from './Penguins';
import {PharmacyUnion} from './PharmacyUnion';
import {Philares} from './Philares';
import {Potatoes} from './Potatoes';
import {ProjectInspection} from './ProjectInspection';
import {Psyche} from './16Psyche';
import {Recyclon} from './Recyclon';
import {RedShips} from './RedShips';
import {RegoPlastics} from './RegoPlastics';
import {RobotPollinators} from './RobotPollinators';
import {SaturnSurfing} from './SaturnSurfing';
import {SelfReplicatingRobots} from './SelfReplicatingRobots';
import {SmallAsteroid} from './SmallAsteroid';
import {SnowAlgae} from './SnowAlgae';
import {SoilEnrichment} from './SoilEnrichment';
import {SolarLogistics} from './SolarLogistics';
import {Splice} from './Splice';
import {StanfordTorus} from './StanfordTorus';
import {StJosephOfCupertinoMission} from './StJosephOfCupertinoMission';
import {SubCrustMeasurements} from './SubCrustMeasurements';
import {Supercapacitors} from './Supercapacitors';
import {Supermarkets} from './Supermarkets';
import {Teslaract} from './Teslaract';
import {TopsoilContract} from './TopsoilContract';
import {TychoMagnetics} from './TychoMagnetics';

export const PROMO_CARD_MANIFEST = new ModuleManifest({
  module: 'promo',
  projectCards: {
    [CardName.PENGUINS]: {Factory: Penguins},
    [CardName.SELF_REPLICATING_ROBOTS]: {Factory: SelfReplicatingRobots},
    [CardName.SMALL_ASTEROID]: {Factory: SmallAsteroid},
    [CardName.SNOW_ALGAE]: {Factory: SnowAlgae},
    [CardName.DUSK_LASER_MINING]: {Factory: DuskLaserMining},
    [CardName.MERCURIAN_ALLOYS]: {Factory: MercurianAlloys},
    [CardName.REGO_PLASTICS]: {Factory: RegoPlastics},
    [CardName.INTERPLANETARY_TRADE]: {Factory: InterplanetaryTrade},
    [CardName.ORBITAL_CLEANUP]: {Factory: OrbitalCleanup},
    [CardName.PROJECT_INSPECTION]: {Factory: ProjectInspection},
    [CardName.HI_TECH_LAB]: {Factory: HiTechLab},
    [CardName.ENERGY_MARKET]: {Factory: EnergyMarket},
    [CardName.LAW_SUIT]: {Factory: LawSuit},
    [CardName.STANFORD_TORUS]: {Factory: StanfordTorus},
    [CardName.ASTEROID_HOLLOWING]: {Factory: AsteroidHollowing},
    [CardName.ASTEROID_RIGHTS]: {Factory: AsteroidRights},
    [CardName.COMET_AIMING]: {Factory: CometAiming},
    [CardName.CUTTING_EDGE_TECHNOLOGY]: {Factory: CuttingEdgeTechnology},
    [CardName.CRASH_SITE_CLEANUP]: {Factory: CrashSiteCleanup},
    [CardName.DIRECTED_IMPACTORS]: {Factory: DirectedImpactors},
    [CardName.FIELD_CAPPED_CITY]: {Factory: FieldCappedCity},
    [CardName.MAGNETIC_SHIELD]: {Factory: MagneticShield},
    [CardName.MELTWORKS]: {Factory: Meltworks},
    [CardName.MOHOLE_LAKE]: {Factory: MoholeLake},
    [CardName.DIVERSITY_SUPPORT]: {Factory: DiversitySupport},
    [CardName.JOVIAN_EMBASSY]: {Factory: JovianEmbassy},
    [CardName.TOPSOIL_CONTRACT]: {Factory: TopsoilContract},
    [CardName.IMPORTED_NUTRIENTS]: {Factory: ImportedNutrients},
    [CardName.ASTEROID_DEFLECTION_SYSTEM]: {Factory: AsteroidDeflectionSystem},
    [CardName.SUB_CRUST_MEASUREMENTS]: {Factory: SubCrustMeasurements},
    [CardName.POTATOES]: {Factory: Potatoes},
    [CardName.MEAT_INDUSTRY]: {Factory: MeatIndustry},
    [CardName.ADVERTISING]: {Factory: Advertising},
    [CardName.DEIMOS_DOWN_PROMO]: {Factory: DeimosDownPromo},
    [CardName.GREAT_DAM_PROMO]: {Factory: GreatDamPromo},
    [CardName.MAGNETIC_FIELD_GENERATORS_PROMO]: {Factory: MagneticFieldGeneratorsPromo},
    [CardName.SATURN_SURFING]: {Factory: SaturnSurfing},
    [CardName.BIO_PRINTING_FACILITY]: {Factory: BioPrintingFacility},
    [CardName.BACTOVIRAL_RESEARCH]: {Factory: BactoviralResearch},
    [CardName.HARVEST]: {Factory: Harvest},
    [CardName.OUTDOOR_SPORTS]: {Factory: OutdoorSports},
    [CardName.PSYCHE]: {Factory: Psyche},
    [CardName.ROBOT_POLLINATORS]: {Factory: RobotPollinators},
    [CardName.SUPERCAPACITORS]: {Factory: Supercapacitors},
    [CardName.FLOYD_CONTINUUM]: {Factory: FloydContinuum},
    [CardName.AQUEDUCT_SYSTEMS]: {Factory: AqueductSystems},
    [CardName.ASTRA_MECHANICA]: {Factory: AstraMechanica},
    [CardName.ST_JOSEPH_OF_CUPERTINO_MISSION]: {Factory: StJosephOfCupertinoMission},
    [CardName.CARBON_NANOSYSTEMS]: {Factory: CarbonNanosystems},
    [CardName.CYBERIA_SYSTEMS]: {Factory: CyberiaSystems},
    [CardName.HERMETIC_ORDER_OF_MARS]: {Factory: HermeticOrderOfMars},
    [CardName.HOMEOSTASIS_BUREAU]: {Factory: HomeostasisBureau},
    [CardName.KAGUYA_TECH]: {Factory: KaguyaTech},
    [CardName.MARS_NOMADS]: {Factory: MarsNomads},
    [CardName.NEPTUNIAN_POWER_CONSULTANTS]: {Factory: NeptunianPowerConsultants},
    [CardName.MARTIAN_LUMBER_CORP]: {Factory: MartianLumberCorp},
    [CardName.RED_SHIPS]: {Factory: RedShips},
    [CardName.SOLAR_LOGISTICS]: {Factory: SolarLogistics},
    [CardName.TESLARACT]: {Factory: Teslaract},
    [CardName.DIRECTED_HEAT_USAGE]: {Factory: DirectedHeatUsage},
    [CardName.ICY_IMPACTORS]: {Factory: IcyImpactors},
    [CardName.SOIL_ENRICHMENT]: {Factory: SoilEnrichment},
    [CardName.CITY_PARK]: {Factory: CityPark},
    [CardName.SUPERMARKETS]: {Factory: Supermarkets},
  },

  preludeCards: {
    [CardName.NEW_PARTNER]: {Factory: NewPartner},
    [CardName.MERGER]: {Factory: Merger},
    [CardName.CORPORATE_ARCHIVES]: {Factory: CorporateArchives},
    [CardName.DOUBLE_DOWN]: {Factory: DoubleDown, compatibility: 'prelude'},
    // [CardName.HEAD_START]: {Factory: HeadStart}, // Head Start is disabled because it's not working well.
    [CardName.ANTI_DESERTIFICATION_TECHNIQUES]: {Factory: AntidesertificationTechniques},
    // [CardName.ESTABLISHED_METHODS]: {Factory: EstablishedMethods},
    [CardName.GIANT_SOLAR_COLLECTOR]: {Factory: GiantSolarCollector, compatibility: 'venus'},
  },

  cardsToRemove: [
    CardName.DEIMOS_DOWN,
    CardName.GREAT_DAM,
    CardName.MAGNETIC_FIELD_GENERATORS],

  corporationCards: {
    [CardName.ARCADIAN_COMMUNITIES]: {Factory: ArcadianCommunities},
    [CardName.ASTRODRILL]: {Factory: Astrodrill},
    [CardName.FACTORUM]: {Factory: Factorum},
    [CardName.PHARMACY_UNION]: {Factory: PharmacyUnion},
    [CardName.PHILARES]: {Factory: Philares},
    [CardName.MONS_INSURANCE]: {Factory: MonsInsurance},
    [CardName.RECYCLON]: {Factory: Recyclon},
    [CardName.SPLICE]: {Factory: Splice},
    [CardName.TYCHO_MAGNETICS]: {Factory: TychoMagnetics},
    [CardName.KUIPER_COOPERATIVE]: {Factory: KuiperCooperative},
  },
});
