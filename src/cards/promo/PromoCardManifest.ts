import { CardName } from "../../CardName";
import { GameModule } from "../../GameModule";
import { CardManifest } from "../CardManifest";
import { Advertising } from "./Advertising";
import { ArcadianCommunities } from "./ArcadianCommunities";
import { AsteroidDeflectionSystem } from "./AsteroidDeflectionSystem";
import { AsteroidHollowing } from "./AsteroidHollowing";
import { AsteroidRights } from "./AsteroidRights";
import { Astrodrill } from "./Astrodrill";
import { CometAiming } from "./CometAiming";
import { CrashSiteCleanup } from "./CrashSiteCleanup";
import { CuttingEdgeTechnology } from "./CuttingEdgeTechnology";
import { DeimosDownPromo } from "./DeimosDownPromo";
import { DirectedImpactors } from "./DirectedImpactors";
import { DiversitySupport } from "./DiversitySupport";
import { DuskLaserMining } from "./DuskLaserMining";
import { EnergyMarket } from "./EnergyMarket";
import { Factorum } from "./Factorum";
import { FieldCappedCity } from "./FieldCappedCity";
import { GreatDamPromo } from "./GreatDamPromo";
import { HiTechLab } from "./HiTechLab";
import { ImportedNutrients } from "./ImportedNutrients";
import { InterplanetaryTrade } from "./InterplanetaryTrade";
import { JovianEmbassy } from "./JovianEmbassy";
import { LawSuit } from "./LawSuit";
import { MagneticFieldGeneratorsPromo } from "./MagneticFieldGeneratorsPromo";
import { MagneticShield } from "./MagneticShield";
import { MeatIndustry } from "./MeatIndustry";
import { Meltworks } from "./Meltworks";
import { MercurianAlloys } from "./MercurianAlloys";
import { MoholeLake } from "./MoholeLake";
import { MonsInsurance } from "./MonsInsurance";
import { OrbitalCleanup } from "./OrbitalCleanup";
import { Penguins } from "./Penguins";
import { PharmacyUnion } from "./PharmacyUnion";
import { Philares } from "./Philares";
import { Potatoes } from "./Potatoes";
import { ProjectInspection } from "./ProjectInspection";
import { Recyclon } from "./Recyclon";
import { RegoPlastics } from "./RegoPlastics";
import { SaturnSurfing } from "./SaturnSurfing";
import { SelfReplicatingRobots } from "./SelfReplicatingRobots";
import { SmallAsteroid } from "./SmallAsteroid";
import { SnowAlgae } from "./SnowAlgae";
import { Splice } from "./Splice";
import { StanfordTorus } from "./StanfordTorus";
import { SubCrustMeasurements } from "./SubCrustMeasurements";
import { TopsoilContract } from "./TopsoilContract";

export const PROMO_CARD_MANIFEST = new CardManifest({
    module: GameModule.Promo,
    projectCards: [
        { cardName: CardName.PENGUINS, factory: Penguins },
        { cardName: CardName.SELF_REPLICATING_ROBOTS, factory: SelfReplicatingRobots },
        { cardName: CardName.SMALL_ASTEROID, factory: SmallAsteroid },
        { cardName: CardName.SNOW_ALGAE, factory: SnowAlgae },
        { cardName: CardName.DUSK_LASER_MINING, factory: DuskLaserMining },
        { cardName: CardName.MERCURIAN_ALLOYS, factory: MercurianAlloys },
        { cardName: CardName.REGO_PLASTICS, factory: RegoPlastics },
        { cardName: CardName.INTERPLANETARY_TRADE, factory: InterplanetaryTrade },
        { cardName: CardName.ORBITAL_CLEANUP, factory: OrbitalCleanup },
        { cardName: CardName.PROJECT_INSPECTION, factory: ProjectInspection },
        { cardName: CardName.HI_TECH_LAB, factory: HiTechLab },
        { cardName: CardName.ENERGY_MARKET, factory: EnergyMarket },
        { cardName: CardName.LAW_SUIT, factory: LawSuit },
        { cardName: CardName.STANFORD_TORUS, factory: StanfordTorus },
        { cardName: CardName.ASTEROID_HOLLOWING, factory: AsteroidHollowing },
        { cardName: CardName.ASTEROID_RIGHTS, factory: AsteroidRights },
        { cardName: CardName.COMET_AIMING, factory: CometAiming },
        { cardName: CardName.CUTTING_EDGE_TECHNOLOGY, factory: CuttingEdgeTechnology },
        { cardName: CardName.CRASH_SITE_CLEANUP, factory: CrashSiteCleanup },
        { cardName: CardName.DIRECTED_IMPACTORS, factory: DirectedImpactors },
        { cardName: CardName.FIELD_CAPPED_CITY, factory: FieldCappedCity },
        { cardName: CardName.MAGNETIC_SHIELD, factory: MagneticShield },
        { cardName: CardName.MELTWORKS, factory: Meltworks },
        { cardName: CardName.MOHOLE_LAKE, factory: MoholeLake },
        { cardName: CardName.DIVERSITY_SUPPORT, factory: DiversitySupport },
        { cardName: CardName.JOVIAN_EMBASSY, factory: JovianEmbassy },
        { cardName: CardName.TOPSOIL_CONTRACT, factory: TopsoilContract },
        { cardName: CardName.IMPORTED_NUTRIENTS, factory: ImportedNutrients },
        { cardName: CardName.ASTEROID_DEFLECTION_SYSTEM, factory: AsteroidDeflectionSystem },
        { cardName: CardName.SUB_CRUST_MEASUREMENTS, factory: SubCrustMeasurements },
        { cardName: CardName.POTATOES, factory: Potatoes },
        { cardName: CardName.MEAT_INDUSTRY, factory: MeatIndustry },
        { cardName: CardName.ADVERTISING, factory: Advertising },
        { cardName: CardName.DEIMOS_DOWN_PROMO, factory: DeimosDownPromo },
        { cardName: CardName.GREAT_DAM_PROMO, factory: GreatDamPromo },
        { cardName: CardName.MAGNETIC_FIELD_GENERATORS_PROMO, factory: MagneticFieldGeneratorsPromo },
        { cardName: CardName.SATURN_SURFING, factory: SaturnSurfing }
        ],

    projectCardsToRemove: [
        CardName.DEIMOS_DOWN,
        CardName.GREAT_DAM,
        CardName.MAGNETIC_FIELD_GENERATORS],

    corporationCards: [
        { cardName: CardName.ARCADIAN_COMMUNITIES, factory: ArcadianCommunities },
        { cardName: CardName.ASTRODRILL, factory: Astrodrill },
        { cardName: CardName.FACTORUM, factory: Factorum },
        { cardName: CardName.PHARMACY_UNION, factory: PharmacyUnion },
        { cardName: CardName.PHILARES, factory: Philares },
        { cardName: CardName.MONS_INSURANCE, factory: MonsInsurance },
        { cardName: CardName.RECYCLON, factory: Recyclon },
        { cardName: CardName.SPLICE, factory: Splice }
    ]});