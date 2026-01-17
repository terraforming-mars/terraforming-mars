import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {Airliners} from '@/server/cards/colonies/Airliners';
import {AirRaid} from '@/server/cards/colonies/AirRaid';
import {Aridor} from '@/server/cards/colonies/Aridor';
import {Arklight} from '@/server/cards/colonies/Arklight';
import {AtmoCollectors} from '@/server/cards/colonies/AtmoCollectors';
import {CommunityServices} from '@/server/cards/colonies/CommunityServices';
import {Conscription} from '@/server/cards/colonies/Conscription';
import {CoronaExtractor} from '@/server/cards/colonies/CoronaExtractor';
import {CryoSleep} from '@/server/cards/colonies/CryoSleep';
import {EarthElevator} from '@/server/cards/colonies/EarthElevator';
import {EcologyResearch} from '@/server/cards/colonies/EcologyResearch';
import {FloaterLeasing} from '@/server/cards/colonies/FloaterLeasing';
import {FloaterPrototypes} from '@/server/cards/colonies/FloaterPrototypes';
import {FloaterTechnology} from '@/server/cards/colonies/FloaterTechnology';
import {GalileanWaystation} from '@/server/cards/colonies/GalileanWaystation';
import {HeavyTaxation} from '@/server/cards/colonies/HeavyTaxation';
import {IceMoonColony} from '@/server/cards/colonies/IceMoonColony';
import {ImpactorSwarm} from '@/server/cards/colonies/ImpactorSwarm';
import {InterplanetaryColonyShip} from '@/server/cards/colonies/InterplanetaryColonyShip';
import {JovianLanterns} from '@/server/cards/colonies/JovianLanterns';
import {JupiterFloatingStation} from '@/server/cards/colonies/JupiterFloatingStation';
import {LunaGovernor} from '@/server/cards/colonies/LunaGovernor';
import {LunarExports} from '@/server/cards/colonies/LunarExports';
import {LunarMining} from '@/server/cards/colonies/LunarMining';
import {MarketManipulation} from '@/server/cards/colonies/MarketManipulation';
import {MartianZoo} from '@/server/cards/colonies/MartianZoo';
import {MiningColony} from '@/server/cards/colonies/MiningColony';
import {MinorityRefuge} from '@/server/cards/colonies/MinorityRefuge';
import {MolecularPrinting} from '@/server/cards/colonies/MolecularPrinting';
import {NitrogenFromTitan} from '@/server/cards/colonies/NitrogenFromTitan';
import {PioneerSettlement} from '@/server/cards/colonies/PioneerSettlement';
import {Polyphemos} from '@/server/cards/colonies/Polyphemos';
import {Poseidon} from '@/server/cards/colonies/Poseidon';
import {ProductiveOutpost} from '@/server/cards/colonies/ProductiveOutpost';
import {QuantumCommunications} from '@/server/cards/colonies/QuantumCommunications';
import {RedSpotObservatory} from '@/server/cards/colonies/RedSpotObservatory';
import {RefugeeCamps} from '@/server/cards/colonies/RefugeeCamps';
import {ResearchColony} from '@/server/cards/colonies/ResearchColony';
import {RimFreighters} from '@/server/cards/colonies/RimFreighters';
import {SkyDocks} from '@/server/cards/colonies/SkyDocks';
import {SolarProbe} from '@/server/cards/colonies/SolarProbe';
import {SolarReflectors} from '@/server/cards/colonies/SolarReflectors';
import {SpacePort} from '@/server/cards/colonies/SpacePort';
import {SpacePortColony} from '@/server/cards/colonies/SpacePortColony';
import {SpinoffDepartment} from '@/server/cards/colonies/SpinoffDepartment';
import {StormCraftIncorporated} from '@/server/cards/colonies/StormCraftIncorporated';
import {SubZeroSaltFish} from '@/server/cards/colonies/SubZeroSaltFish';
import {TitanAirScrapping} from '@/server/cards/colonies/TitanAirScrapping';
import {TitanFloatingLaunchPad} from '@/server/cards/colonies/TitanFloatingLaunchPad';
import {TitanShuttles} from '@/server/cards/colonies/TitanShuttles';
import {TradeEnvoys} from '@/server/cards/colonies/TradeEnvoys';
import {TradingColony} from '@/server/cards/colonies/TradingColony';
import {UrbanDecomposers} from '@/server/cards/colonies/UrbanDecomposers';
import {WarpDrive} from '@/server/cards/colonies/WarpDrive';
import {BuildColonyStandardProject} from '@/server/cards/colonies/BuildColonyStandardProject';

export const COLONIES_CARD_MANIFEST = new ModuleManifest({
  module: 'colonies',

  projectCards: {
    [CardName.AIRLINERS]: {Factory: Airliners},
    [CardName.AIR_RAID]: {Factory: AirRaid},
    [CardName.ATMO_COLLECTORS]: {Factory: AtmoCollectors},
    [CardName.COMMUNITY_SERVICES]: {Factory: CommunityServices},
    [CardName.CONSCRIPTION]: {Factory: Conscription},
    [CardName.CORONA_EXTRACTOR]: {Factory: CoronaExtractor},
    [CardName.CRYO_SLEEP]: {Factory: CryoSleep},
    [CardName.EARTH_ELEVATOR]: {Factory: EarthElevator},
    [CardName.ECOLOGY_RESEARCH]: {Factory: EcologyResearch},
    [CardName.FLOATER_LEASING]: {Factory: FloaterLeasing},
    [CardName.FLOATER_PROTOTYPES]: {Factory: FloaterPrototypes},
    [CardName.FLOATER_TECHNOLOGY]: {Factory: FloaterTechnology},
    [CardName.GALILEAN_WAYSTATION]: {Factory: GalileanWaystation},
    [CardName.HEAVY_TAXATION]: {Factory: HeavyTaxation},
    [CardName.ICE_MOON_COLONY]: {Factory: IceMoonColony},
    [CardName.IMPACTOR_SWARM]: {Factory: ImpactorSwarm},
    [CardName.INTERPLANETARY_COLONY_SHIP]: {Factory: InterplanetaryColonyShip},
    [CardName.JOVIAN_LANTERNS]: {Factory: JovianLanterns},
    [CardName.JUPITER_FLOATING_STATION]: {Factory: JupiterFloatingStation},
    [CardName.LUNA_GOVERNOR]: {Factory: LunaGovernor},
    [CardName.LUNAR_EXPORTS]: {Factory: LunarExports},
    [CardName.LUNAR_MINING]: {Factory: LunarMining},
    [CardName.MARTIAN_ZOO]: {Factory: MartianZoo},
    [CardName.MARKET_MANIPULATION]: {Factory: MarketManipulation},
    [CardName.MINING_COLONY]: {Factory: MiningColony},
    [CardName.MINORITY_REFUGE]: {Factory: MinorityRefuge},
    [CardName.MOLECULAR_PRINTING]: {Factory: MolecularPrinting},
    [CardName.NITROGEN_FROM_TITAN]: {Factory: NitrogenFromTitan},
    [CardName.PIONEER_SETTLEMENT]: {Factory: PioneerSettlement},
    [CardName.PRODUCTIVE_OUTPOST]: {Factory: ProductiveOutpost},
    [CardName.QUANTUM_COMMUNICATIONS]: {Factory: QuantumCommunications},
    [CardName.RED_SPOT_OBSERVATORY]: {Factory: RedSpotObservatory},
    [CardName.RESEARCH_COLONY]: {Factory: ResearchColony},
    [CardName.RIM_FREIGHTERS]: {Factory: RimFreighters},
    [CardName.REFUGEE_CAMPS]: {Factory: RefugeeCamps},
    [CardName.SOLAR_PROBE]: {Factory: SolarProbe},
    [CardName.SOLAR_REFLECTORS]: {Factory: SolarReflectors},
    [CardName.SKY_DOCKS]: {Factory: SkyDocks},
    [CardName.SPACE_PORT]: {Factory: SpacePort},
    [CardName.SPACE_PORT_COLONY]: {Factory: SpacePortColony},
    [CardName.SPINOFF_DEPARTMENT]: {Factory: SpinoffDepartment},
    [CardName.SUBZERO_SALT_FISH]: {Factory: SubZeroSaltFish},
    [CardName.TITAN_AIRSCRAPPING]: {Factory: TitanAirScrapping},
    [CardName.TITAN_FLOATING_LAUNCHPAD]: {Factory: TitanFloatingLaunchPad},
    [CardName.TITAN_SHUTTLES]: {Factory: TitanShuttles},
    [CardName.TRADING_COLONY]: {Factory: TradingColony},
    [CardName.TRADE_ENVOYS]: {Factory: TradeEnvoys},
    [CardName.URBAN_DECOMPOSERS]: {Factory: UrbanDecomposers},
    [CardName.WARP_DRIVE]: {Factory: WarpDrive},
  },
  standardProjects: {
    [CardName.BUILD_COLONY_STANDARD_PROJECT]: {Factory: BuildColonyStandardProject},
  },
  corporationCards: {
    [CardName.ARIDOR]: {Factory: Aridor, compatibility: 'colonies'},
    [CardName.ARKLIGHT]: {Factory: Arklight},
    [CardName.POLYPHEMOS]: {Factory: Polyphemos},
    [CardName.POSEIDON]: {Factory: Poseidon, compatibility: 'colonies'},
    [CardName.STORMCRAFT_INCORPORATED]: {Factory: StormCraftIncorporated},
  },
});
