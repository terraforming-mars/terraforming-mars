import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
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
import {BuildColonyStandard} from '../standardProjects/BuildColony';

export const COLONIES_CARD_MANIFEST = new CardManifest({
  module: GameModule.Colonies,

  projectCards: [
    CardManifest.dynamicFactory(CardName.AIRLINERS, Airliners),
    CardManifest.staticFactory(CardName.AIR_RAID, new AirRaid()),
    CardManifest.dynamicFactory(CardName.ATMO_COLLECTORS, AtmoCollectors),
    CardManifest.dynamicFactory(CardName.COMMUNITY_SERVICES, CommunityServices),
    CardManifest.staticFactory(CardName.CONSCRIPTION, new Conscription()),
    CardManifest.dynamicFactory(CardName.CORONA_EXTRACTOR, CoronaExtractor),
    CardManifest.dynamicFactory(CardName.CRYO_SLEEP, CryoSleep),
    CardManifest.dynamicFactory(CardName.EARTH_ELEVATOR, EarthElevator),
    CardManifest.dynamicFactory(CardName.ECOLOGY_RESEARCH, EcologyResearch),
    CardManifest.staticFactory(CardName.FLOATER_LEASING, new FloaterLeasing()),
    CardManifest.dynamicFactory(CardName.FLOATER_PROTOTYPES, FloaterPrototypes),
    CardManifest.dynamicFactory(CardName.FLOATER_TECHNOLOGY, FloaterTechnology),
    CardManifest.dynamicFactory(CardName.GALILEAN_WAYSTATION, GalileanWaystation),
    CardManifest.dynamicFactory(CardName.HEAVY_TAXATION, HeavyTaxation),
    CardManifest.dynamicFactory(CardName.ICE_MOON_COLONY, IceMoonColony),
    CardManifest.staticFactory(CardName.IMPACTOR_SWARM, new ImpactorSwarm()),
    CardManifest.staticFactory(CardName.INTERPLANETARY_COLONY_SHIP, new InterplanetaryColonyShip()),
    CardManifest.dynamicFactory(CardName.JOVIAN_LANTERNS, JovianLanterns),
    CardManifest.dynamicFactory(CardName.JUPITER_FLOATING_STATION, JupiterFloatingStation),
    CardManifest.dynamicFactory(CardName.LUNA_GOVERNOR, LunaGovernor),
    CardManifest.dynamicFactory(CardName.LUNAR_EXPORTS, LunarExports),
    CardManifest.dynamicFactory(CardName.LUNAR_MINING, LunarMining),
    CardManifest.dynamicFactory(CardName.MARTIAN_ZOO, MartianZoo),
    CardManifest.staticFactory(CardName.MARKET_MANIPULATION, new MarketManipulation()),
    CardManifest.dynamicFactory(CardName.MINING_COLONY, MiningColony),
    CardManifest.dynamicFactory(CardName.MINORITY_REFUGE, MinorityRefuge),
    CardManifest.dynamicFactory(CardName.MOLECULAR_PRINTING, MolecularPrinting),
    CardManifest.dynamicFactory(CardName.NITROGEN_FROM_TITAN, NitrogenFromTitan),
    CardManifest.dynamicFactory(CardName.PIONEER_SETTLEMENT, PioneerSettlement),
    CardManifest.dynamicFactory(CardName.PRODUCTIVE_OUTPOST, ProductiveOutpost),
    CardManifest.dynamicFactory(CardName.QUANTUM_COMMUNICATIONS, QuantumCommunications),
    CardManifest.dynamicFactory(CardName.RED_SPOT_OBSERVATORY, RedSpotObservatory),
    CardManifest.dynamicFactory(CardName.RESEARCH_COLONY, ResearchColony),
    CardManifest.dynamicFactory(CardName.RIM_FREIGHTERS, RimFreighters),
    CardManifest.dynamicFactory(CardName.REFUGEE_CAMP, RefugeeCamps),
    CardManifest.staticFactory(CardName.SOLAR_PROBE, new SolarProbe()),
    CardManifest.dynamicFactory(CardName.SOLAR_REFLECTORS, SolarReflectors),
    CardManifest.dynamicFactory(CardName.SKY_DOCKS, SkyDocks),
    CardManifest.dynamicFactory(CardName.SPACE_PORT, SpacePort),
    CardManifest.dynamicFactory(CardName.SPACE_PORT_COLONY, SpacePortColony),
    CardManifest.dynamicFactory(CardName.SPINOFF_DEPARTMENT, SpinoffDepartment),
    CardManifest.dynamicFactory(CardName.SUBZERO_SALT_FISH, SubZeroSaltFish),
    CardManifest.dynamicFactory(CardName.TITAN_AIRSCRAPPING, TitanAirScrapping),
    CardManifest.dynamicFactory(CardName.TITAN_FLOATER_LAUNCHPAD, TitanFloatingLaunchPad),
    CardManifest.dynamicFactory(CardName.TITAN_SHUTTLES, TitanShuttles),
    CardManifest.dynamicFactory(CardName.TRADING_COLONY, TradingColony),
    CardManifest.dynamicFactory(CardName.TRADE_ENVOYS, TradeEnvoys),
    CardManifest.dynamicFactory(CardName.URBAN_DECOMPOSERS, UrbanDecomposers),
    CardManifest.dynamicFactory(CardName.WARP_DRIVE, WarpDrive),
  ],
  standardProjects: [
    CardManifest.dynamicFactory(CardName.STANDARD_BUILD_COLONY, BuildColonyStandard),
  ],
  corporationCards: [
    CardManifest.dynamicFactory(CardName.ARIDOR, Aridor),
    CardManifest.dynamicFactory(CardName.ARKLIGHT, Arklight),
    CardManifest.dynamicFactory(CardName.POLYPHEMOS, Polyphemos),
    CardManifest.dynamicFactory(CardName.POSEIDON, Poseidon),
    CardManifest.dynamicFactory(CardName.STORMCRAFT_INCORPORATED, StormCraftIncorporated),
  ]});
