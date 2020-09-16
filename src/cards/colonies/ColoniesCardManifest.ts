import { CardName } from "../../CardName";
import { ICardFactory } from "../../Dealer";
import { CardManifest } from "../CardManifest";
import { CorporationCard } from "../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Airliners } from "./Airliners";
import { AirRaid } from "./AirRaid";
import { Aridor } from "./Aridor";
import { Arklight } from "./Arklight";
import { AtmoCollectors } from "./AtmoCollectors";
import { CommunityServices } from "./CommunityServices";
import { Conscription } from "./Conscription";
import { CoronaExtractor } from "./CoronaExtractor";
import { CryoSleep } from "./CryoSleep";
import { EarthElevator } from "./EarthElevator";
import { EcologyResearch } from "./EcologyResearch";
import { FloaterLeasing } from "./FloaterLeasing";
import { FloaterPrototypes } from "./FloaterPrototypes";
import { FloaterTechnology } from "./FloaterTechnology";
import { GalileanWaystation } from "./GalileanWaystation";
import { HeavyTaxation } from "./HeavyTaxation";
import { IceMoonColony } from "./IceMoonColony";
import { ImpactorSwarm } from "./ImpactorSwarm";
import { InterplanetaryColonyShip } from "./InterplanetaryColonyShip";
import { JovianLanterns } from "./JovianLanterns";
import { JupiterFloatingStation } from "./JupiterFloatingStation";
import { LunaGovernor } from "./LunaGovernor";
import { LunarExports } from "./LunarExports";
import { LunarMining } from "./LunarMining";
import { MarketManipulation } from "./MarketManipulation";
import { MartianZoo } from "./MartianZoo";
import { MiningColony } from "./MiningColony";
import { MinorityRefuge } from "./MinorityRefuge";
import { MolecularPrinting } from "./MolecularPrinting";
import { NitrogenFromTitan } from "./NitrogenFromTitan";
import { PioneerSettlement } from "./PioneerSettlement";
import { Polyphemos } from "./Polyphemos";
import { Poseidon } from "./Poseidon";
import { ProductiveOutpost } from "./ProductiveOutpost";
import { QuantumCommunications } from "./QuantumCommunications";
import { RedSpotObservatory } from "./RedSpotObservatory";
import { RefugeeCamps } from "./RefugeeCamps";
import { ResearchColony } from "./ResearchColony";
import { RimFreighters } from "./RimFreighters";
import { SkyDocks } from "./SkyDocks";
import { SolarProbe } from "./SolarProbe";
import { SolarReflectors } from "./SolarReflectors";
import { SpacePort } from "./SpacePort";
import { SpacePortColony } from "./SpacePortColony";
import { SpinoffDepartment } from "./SpinoffDepartment";
import { StormCraftIncorporated } from "./StormCraftIncorporated";
import { SubZeroSaltFish } from "./SubZeroSaltFish";
import { TitanAirScrapping } from "./TitanAirScrapping";
import { TitanFloatingLaunchPad } from "./TitanFloatingLaunchPad";
import { TitanShuttles } from "./TitanShuttles";
import { TradeEnvoys } from "./TradeEnvoys";
import { TradingColony } from "./TradingColony";
import { UrbanDecomposers } from "./UrbanDecomposers";
import { WarpDrive } from "./WarpDrive";

export class ColoniesCardManifest extends CardManifest {
    projectCards: Array<ICardFactory<IProjectCard>> = [
        { cardName: CardName.AIRLINERS, factory: Airliners },
        { cardName: CardName.AIR_RAID, factory: AirRaid },
        { cardName: CardName.ATMO_COLLECTORS, factory: AtmoCollectors },
        { cardName: CardName.COMMUNITY_SERVICES, factory: CommunityServices },
        { cardName: CardName.CONSCRIPTION, factory: Conscription },
        { cardName: CardName.CORONA_EXTRACTOR, factory: CoronaExtractor },
        { cardName: CardName.CRYO_SLEEP, factory: CryoSleep },
        { cardName: CardName.EARTH_ELEVATOR, factory: EarthElevator },
        { cardName: CardName.ECOLOGY_RESEARCH, factory: EcologyResearch },
        { cardName: CardName.FLOATER_LEASING, factory: FloaterLeasing },
        { cardName: CardName.FLOATER_PROTOTYPES, factory: FloaterPrototypes },
        { cardName: CardName.FLOATER_TECHNOLOGY, factory: FloaterTechnology },
        { cardName: CardName.GALILEAN_WAYSTATION, factory: GalileanWaystation },
        { cardName: CardName.HEAVY_TAXATION, factory: HeavyTaxation },
        { cardName: CardName.ICE_MOON_COLONY, factory: IceMoonColony },
        { cardName: CardName.IMPACTOR_SWARM, factory: ImpactorSwarm },
        { cardName: CardName.INTERPLANETARY_COLONY_SHIP, factory: InterplanetaryColonyShip },
        { cardName: CardName.JOVIAN_LANTERNS, factory: JovianLanterns },
        { cardName: CardName.JUPITER_FLOATING_STATION, factory: JupiterFloatingStation },
        { cardName: CardName.LUNA_GOVERNOR, factory: LunaGovernor },
        { cardName: CardName.LUNAR_EXPORTS, factory: LunarExports },
        { cardName: CardName.LUNAR_MINING, factory: LunarMining },
        { cardName: CardName.MARTIAN_ZOO, factory: MartianZoo },
        { cardName: CardName.MARKET_MANIPULATION, factory: MarketManipulation },
        { cardName: CardName.MINING_COLONY, factory: MiningColony },
        { cardName: CardName.MINORITY_REFUGE, factory: MinorityRefuge },
        { cardName: CardName.MOLECULAR_PRINTING, factory: MolecularPrinting},
        { cardName: CardName.NITROGEN_FROM_TITAN, factory: NitrogenFromTitan },
        { cardName: CardName.PIONEER_SETTLEMENT, factory: PioneerSettlement },
        { cardName: CardName.PRODUCTIVE_OUTPOST, factory: ProductiveOutpost },
        { cardName: CardName.QUANTUM_COMMUNICATIONS, factory: QuantumCommunications },
        { cardName: CardName.RED_SPOT_OBSERVATORY, factory: RedSpotObservatory },
        { cardName: CardName.RESEARCH_COLONY, factory: ResearchColony },
        { cardName: CardName.RIM_FREIGHTERS, factory: RimFreighters },
        { cardName: CardName.REFUGEE_CAMP, factory: RefugeeCamps },
        { cardName: CardName.SOLAR_PROBE, factory: SolarProbe },
        { cardName: CardName.SOLAR_REFLECTORS, factory: SolarReflectors },
        { cardName: CardName.SKY_DOCKS, factory: SkyDocks },
        { cardName: CardName.SPACE_PORT, factory: SpacePort },
        { cardName: CardName.SPACE_PORT_COLONY, factory: SpacePortColony },
        { cardName: CardName.SPINOFF_DEPARTMENT, factory: SpinoffDepartment },
        { cardName: CardName.SUBZERO_SALT_FISH, factory: SubZeroSaltFish },
        { cardName: CardName.TITAN_AIRSCRAPPING, factory: TitanAirScrapping },
        { cardName: CardName.TITAN_FLOATER_LAUNCHPAD, factory: TitanFloatingLaunchPad },
        { cardName: CardName.TITAN_SHUTTLES, factory: TitanShuttles },
        { cardName: CardName.TRADING_COLONY, factory: TradingColony },
        { cardName: CardName.TRADE_ENVOYS, factory: TradeEnvoys },
        { cardName: CardName.URBAN_DECOMPOSERS, factory: UrbanDecomposers },
        { cardName: CardName.WARP_DRIVE, factory: WarpDrive }
    ];

    corporations : Array<ICardFactory<CorporationCard>> = [
        { cardName: CardName.ARIDOR, factory: Aridor },
        { cardName: CardName.ARKLIGHT, factory: Arklight },
        { cardName: CardName.POLYPHEMOS, factory: Polyphemos },
        { cardName: CardName.POSEIDON, factory: Poseidon },
        { cardName: CardName.STORMCRAFT_INCORPORATED, factory: StormCraftIncorporated }
    ];
}