import { CardName } from "../../CardName";
import { GameModule } from "../../GameModule";
import { CardManifest } from "../CardManifest";
import { AcquiredSpaceAgency } from "./AcquiredSpaceAgency";
import { AlliedBanks } from "./AlliedBanks";
import { AquiferTurbines } from "./AquiferTurbines";
import { Biofuels } from "./Biofuels";
import { Biolab } from "./Biolab";
import { BiosphereSupport } from "./BiosphereSupport";
import { BusinessEmpire } from "./BusinessEmpire";
import { CheungShingMARS } from "./CheungShingMARS";
import { DomeFarming } from "./DomeFarming";
import { Donation } from "./Donation";
import { EarlySettlement } from "./EarlySettlement";
import { EccentricSponsor } from "./EccentricSponsor";
import { EcologyExperts } from "./EcologyExperts";
import { ExperimentalForest } from "./ExperimentalForest";
import { GalileanMining } from "./GalileanMining";
import { GreatAquifer } from "./GreatAquifer";
import { HousePrinting } from "./HousePrinting";
import { HugeAsteroid } from "./HugeAsteroid";
import { IoResearchOutpost } from "./IoResearchOutpost";
import { LavaTubeSettlement } from "./LavaTubeSettlement";
import { Loan } from "./Loan";
import { MartianIndustries } from "./MartianIndustries";
import { MartianSurvey } from "./MartianSurvey";
import { MetalRichAsteroid } from "./MetalRichAsteroid";
import { MetalsCompany } from "./MetalsCompany";
import { MiningOperations } from "./MiningOperations";
import { Mohole } from "./Mohole";
import { MoholeExcavation } from "./MoholeExcavation";
import { NitrogenDelivery } from "./NitrogenDelivery";
import { OrbitalConstructionYard } from "./OrbitalConstructionYard";
import { PointLuna } from "./PointLuna";
import { PolarIndustries } from "./PolarIndustries";
import { PowerGeneration } from "./PowerGeneration";
import { Psychrophiles } from "./Psychrophiles";
import { ResearchCoordination } from "./ResearchCoordination";
import { ResearchNetwork } from "./ResearchNetwork";
import { RobinsonIndustries } from "./RobinsonIndustries";
import { SelfSufficientSettlement } from "./SelfSufficientSettlement";
import { SFMemorial } from "./SFMemorial";
import { SmeltingPlant } from "./SmeltingPlant";
import { SocietySupport } from "./SocietySupport";
import { SpaceHotels } from "./SpaceHotels";
import { Supplier } from "./Supplier";
import { SupplyDrop } from "./SupplyDrop";
import { UNMIContractor } from "./UNMIContractor";
import { ValleyTrust } from "./ValleyTrust";
import { Vitor } from "./Vitor";

export const PRELUDE_CARD_MANIFEST = new CardManifest({
    module: GameModule.Prelude,
    projectCards: [
        { cardName: CardName.SF_MEMORIAL, factory: SFMemorial },
        { cardName: CardName.HOUSE_PRINTING, factory: HousePrinting },
        { cardName: CardName.SPACE_HOTELS, factory: SpaceHotels },
        { cardName: CardName.MARTIAN_SURVEY, factory: MartianSurvey },
        { cardName: CardName.RESEARCH_COORDINATION, factory: ResearchCoordination },
        { cardName: CardName.LAVA_TUBE_SETTLEMENT, factory: LavaTubeSettlement },
        { cardName: CardName.PSYCHROPHILES, factory: Psychrophiles }
    ],

    corporationCards: [
        { cardName: CardName.CHEUNG_SHING_MARS, factory: CheungShingMARS },
        { cardName: CardName.POINT_LUNA, factory: PointLuna },
        { cardName: CardName.ROBINSON_INDUSTRIES, factory: RobinsonIndustries },
        { cardName: CardName.VALLEY_TRUST, factory: ValleyTrust },
        { cardName: CardName.VITOR, factory: Vitor }
    ],

    preludeCards: [
        { cardName: CardName.ALLIED_BANKS, factory: AlliedBanks },
        { cardName: CardName.BIOSPHERE_SUPPORT, factory: BiosphereSupport },
        { cardName: CardName.AQUIFER_TURBINES, factory: AquiferTurbines },
        { cardName: CardName.MOHOLE_EXCAVATION, factory: MoholeExcavation },
        { cardName: CardName.EARLY_SETTLEMENT, factory: EarlySettlement },
        { cardName: CardName.BIOFUELS, factory: Biofuels },
        { cardName: CardName.POWER_GENERATION, factory: PowerGeneration },
        { cardName: CardName.SELF_SUFFICIENT_SETTLEMENT, factory: SelfSufficientSettlement },
        { cardName: CardName.MINING_OPERATIONS, factory: MiningOperations },
        { cardName: CardName.UNMI_CONTRACTOR, factory: UNMIContractor },
        { cardName: CardName.DOME_FARMING, factory: DomeFarming },
        { cardName: CardName.BUSINESS_EMPIRE, factory: BusinessEmpire },
        { cardName: CardName.DONATION, factory: Donation },
        { cardName: CardName.NITROGEN_SHIPMENT, factory: NitrogenDelivery },
        { cardName: CardName.SMELTING_PLANT, factory: SmeltingPlant },
        { cardName: CardName.SUPPLIER, factory: Supplier },
        { cardName: CardName.SUPPLY_DROP, factory: SupplyDrop },
        { cardName: CardName.GREAT_AQUIFER, factory: GreatAquifer },
        { cardName: CardName.BIOLAB, factory: Biolab },
        { cardName: CardName.MARTIAN_INDUSTRIES, factory: MartianIndustries },
        { cardName: CardName.IO_RESEARCH_OUTPOST, factory: IoResearchOutpost },
        { cardName: CardName.POLAR_INDUSTRIES, factory: PolarIndustries },
        { cardName: CardName.SOCIETY_SUPPORT, factory: SocietySupport },
        { cardName: CardName.GALILEAN_MINING, factory: GalileanMining },
        { cardName: CardName.HUGE_ASTEROID, factory: HugeAsteroid },
        { cardName: CardName.METALS_COMPANY, factory: MetalsCompany },
        { cardName: CardName.LOAN, factory: Loan },
        { cardName: CardName.MOHOLE, factory: Mohole },
        { cardName: CardName.METAL_RICH_ASTEROID, factory: MetalRichAsteroid },
        { cardName: CardName.ORBITAL_CONSTRUCTION_YARD, factory: OrbitalConstructionYard },
        { cardName: CardName.ACQUIRED_SPACE_AGENCY, factory: AcquiredSpaceAgency },
        { cardName: CardName.RESEARCH_NETWORK, factory: ResearchNetwork },
        { cardName: CardName.ECCENTRIC_SPONSOR, factory: EccentricSponsor },
        { cardName: CardName.ECOLOGY_EXPERTS, factory: EcologyExperts },
        { cardName: CardName.EXPERIMENTAL_FOREST, factory: ExperimentalForest }
    ]
});
