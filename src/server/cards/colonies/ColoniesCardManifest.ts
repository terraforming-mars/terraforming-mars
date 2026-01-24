import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {Airliners} from './Airliners';
import {AirRaid} from './AirRaid';
import {Aridor} from './Aridor';
import {Arklight} from './Arklight';
import {AtmoCollectors} from './AtmoCollectors';
import {CommunityServices} from './CommunityServices';
import {Conscription} from './Conscription';
import {CoronaExtractor} from './CoronaExtractor';
import {CryoSleep} from './CryoSleep';
import {EarthElevator} from './EarthElevator';
import {EcologyResearch} from './EcologyResearch';
import {FloaterLeasing} from './FloaterLeasing';
import {FloaterPrototypes} from './FloaterPrototypes';
import {FloaterTechnology} from './FloaterTechnology';
import {GalileanWaystation} from './GalileanWaystation';
import {HeavyTaxation} from './HeavyTaxation';
import {IceMoonColony} from './IceMoonColony';
import {ImpactorSwarm} from './ImpactorSwarm';
import {InterplanetaryColonyShip} from './InterplanetaryColonyShip';
import {JovianLanterns} from './JovianLanterns';
import {JupiterFloatingStation} from './JupiterFloatingStation';
import {LunaGovernor} from './LunaGovernor';
import {LunarExports} from './LunarExports';
import {LunarMining} from './LunarMining';
import {MarketManipulation} from './MarketManipulation';
import {MartianZoo} from './MartianZoo';
import {MiningColony} from './MiningColony';
import {MinorityRefuge} from './MinorityRefuge';
import {MolecularPrinting} from './MolecularPrinting';
import {NitrogenFromTitan} from './NitrogenFromTitan';
import {PioneerSettlement} from './PioneerSettlement';
import {Polyphemos} from './Polyphemos';
import {Poseidon} from './Poseidon';
import {ProductiveOutpost} from './ProductiveOutpost';
import {QuantumCommunications} from './QuantumCommunications';
import {RedSpotObservatory} from './RedSpotObservatory';
import {RefugeeCamps} from './RefugeeCamps';
import {ResearchColony} from './ResearchColony';
import {RimFreighters} from './RimFreighters';
import {SkyDocks} from './SkyDocks';
import {SolarProbe} from './SolarProbe';
import {SolarReflectors} from './SolarReflectors';
import {SpacePort} from './SpacePort';
import {SpacePortColony} from './SpacePortColony';
import {SpinoffDepartment} from './SpinoffDepartment';
import {StormCraftIncorporated} from './StormCraftIncorporated';
import {SubZeroSaltFish} from './SubZeroSaltFish';
import {TitanAirScrapping} from './TitanAirScrapping';
import {TitanFloatingLaunchPad} from './TitanFloatingLaunchPad';
import {TitanShuttles} from './TitanShuttles';
import {TradeEnvoys} from './TradeEnvoys';
import {TradingColony} from './TradingColony';
import {UrbanDecomposers} from './UrbanDecomposers';
import {WarpDrive} from './WarpDrive';
import {BuildColonyStandardProject} from './BuildColonyStandardProject';

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
