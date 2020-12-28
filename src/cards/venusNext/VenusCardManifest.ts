import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AerialMappers} from './AerialMappers';
import {AerosportTournament} from './AerosportTournament';
import {AirScrappingExpedition} from './AirScrappingExpedition';
import {Aphrodite} from './Aphrodite';
import {AtalantaPlanitiaLab} from './AtalantaPlanitiaLab';
import {Atmoscoop} from './Atmoscoop';
import {Celestic} from './Celestic';
import {CometForVenus} from './CometForVenus';
import {CorroderSuits} from './CorroderSuits';
import {DawnCity} from './DawnCity';
import {DeuteriumExport} from './DeuteriumExport';
import {Dirigibles} from './Dirigibles';
import {ExtractorBalloons} from './ExtractorBalloons';
import {Extremophiles} from './Extremophiles';
import {FloatingHabs} from './FloatingHabs';
import {ForcedPrecipitation} from './ForcedPrecipitation';
import {FreyjaBiodomes} from './FreyjaBiodomes';
import {GHGImportFromVenus} from './GHGImportFromVenus';
import {GiantSolarShade} from './GiantSolarShade';
import {Gyropolis} from './Gyropolis';
import {HydrogenToVenus} from './HydrogenToVenus';
import {IoSulphurResearch} from './IoSulphurResearch';
import {IshtarMining} from './IshtarMining';
import {JetStreamMicroscrappers} from './JetStreamMicroscrappers';
import {LocalShading} from './LocalShading';
import {LunaMetropolis} from './LunaMetropolis';
import {LuxuryFoods} from './LuxuryFoods';
import {Manutech} from './Manutech';
import {MaxwellBase} from './MaxwellBase';
import {MiningQuota} from './MiningQuota';
import {MorningStarInc} from './MorningStarInc';
import {NeutralizerFactory} from './NeutralizerFactory';
import {Omnicourt} from './Omnicourt';
import {OrbitalReflectors} from './OrbitalReflectors';
import {RotatorImpacts} from './RotatorImpacts';
import {SisterPlanetSupport} from './SisterPlanetSupport';
import {Solarnet} from './Solarnet';
import {SpinInducingAsteroid} from './SpinInducingAsteroid';
import {SponsoredAcademies} from './SponsoredAcademies';
import {Stratopolis} from './Stratopolis';
import {StratosphericBirds} from './StratosphericBirds';
import {SulphurEatingBacteria} from './SulphurEatingBacteria';
import {SulphurExports} from './SulphurExports';
import {TerraformingContract} from './TerraformingContract';
import {Thermophiles} from './Thermophiles';
import {VenusGovernor} from './VenusGovernor';
import {VenusianAnimals} from './VenusianAnimals';
import {VenusianInsects} from './VenusianInsects';
import {VenusianPlants} from './VenusianPlants';
import {VenusMagnetizer} from './VenusMagnetizer';
import {VenusSoils} from './VenusSoils';
import {VenusWaystation} from './VenusWaystation';
import {Viron} from './Viron';
import {WaterToVenus} from './WaterToVenus';
import {AirScrapping} from '../standardProjects/AirScrapping';

export const VENUS_CARD_MANIFEST = new CardManifest({
  module: GameModule.Venus,
  projectCards: [
    CardManifest.dynamicFactory(CardName.AERIAL_MAPPERS, AerialMappers),
    CardManifest.staticFactory(CardName.AEROSPORT_TOURNAMENT, new AerosportTournament()),
    CardManifest.staticFactory(CardName.AIR_SCRAPPING_EXPEDITION, new AirScrappingExpedition()),
    CardManifest.dynamicFactory(CardName.ATALANTA_PLANITIA_LAB, AtalantaPlanitiaLab),
    CardManifest.dynamicFactory(CardName.ATMOSCOOP, Atmoscoop),
    CardManifest.staticFactory(CardName.COMET_FOR_VENUS, new CometForVenus()),
    CardManifest.dynamicFactory(CardName.CORRODER_SUITS, CorroderSuits),
    CardManifest.dynamicFactory(CardName.DAWN_CITY, DawnCity),
    CardManifest.dynamicFactory(CardName.DEUTERIUM_EXPORT, DeuteriumExport),
    CardManifest.dynamicFactory(CardName.DIRIGIBLES, Dirigibles),
    CardManifest.dynamicFactory(CardName.EXTRACTOR_BALLOONS, ExtractorBalloons),
    CardManifest.dynamicFactory(CardName.EXTREMOPHILES, Extremophiles),
    CardManifest.dynamicFactory(CardName.FLOATING_HABS, FloatingHabs),
    CardManifest.dynamicFactory(CardName.FORCED_PRECIPITATION, ForcedPrecipitation),
    CardManifest.dynamicFactory(CardName.FREYJA_BIODOMES, FreyjaBiodomes),
    CardManifest.dynamicFactory(CardName.GIANT_SOLAR_SHADE, GiantSolarShade),
    CardManifest.staticFactory(CardName.GHG_IMPORT_FROM_VENUS, new GHGImportFromVenus()),
    CardManifest.dynamicFactory(CardName.GYROPOLIS, Gyropolis),
    CardManifest.staticFactory(CardName.HYDROGEN_TO_VENUS, new HydrogenToVenus()),
    CardManifest.dynamicFactory(CardName.IO_SULPHUR_RESEARCH, IoSulphurResearch),
    CardManifest.dynamicFactory(CardName.ISHTAR_MINING, IshtarMining),
    CardManifest.dynamicFactory(CardName.JET_STREAM_MICROSCRAPPERS, JetStreamMicroscrappers),
    CardManifest.dynamicFactory(CardName.LUNA_METROPOLIS, LunaMetropolis),
    CardManifest.dynamicFactory(CardName.LOCAL_SHADING, LocalShading),
    CardManifest.dynamicFactory(CardName.MAXWELL_BASE, MaxwellBase),
    CardManifest.dynamicFactory(CardName.ROTATOR_IMPACTS, RotatorImpacts),
    CardManifest.dynamicFactory(CardName.SISTER_PLANET_SUPPORT, SisterPlanetSupport),
    CardManifest.dynamicFactory(CardName.SOLARNET, Solarnet),
    CardManifest.staticFactory(CardName.SPIN_INDUCING_ASTEROID, new SpinInducingAsteroid()),
    CardManifest.dynamicFactory(CardName.SPONSORED_ACADEMIES, SponsoredAcademies),
    CardManifest.dynamicFactory(CardName.STRATOPOLIS, Stratopolis),
    CardManifest.dynamicFactory(CardName.STRATOSPHERIC_BIRDS, StratosphericBirds),
    CardManifest.dynamicFactory(CardName.SULPHUR_EATING_BACTERIA, SulphurEatingBacteria),
    CardManifest.dynamicFactory(CardName.SULPHUR_EXPORTS, SulphurExports),
    CardManifest.dynamicFactory(CardName.TERRAFORMING_CONTRACT, TerraformingContract),
    CardManifest.dynamicFactory(CardName.THERMOPHILES, Thermophiles),
    CardManifest.dynamicFactory(CardName.VENUS_GOVERNOR, VenusGovernor),
    CardManifest.dynamicFactory(CardName.VENUSIAN_ANIMALS, VenusianAnimals),
    CardManifest.dynamicFactory(CardName.VENUSIAN_INSECTS, VenusianInsects),
    CardManifest.dynamicFactory(CardName.VENUSIAN_PLANTS, VenusianPlants),
    CardManifest.dynamicFactory(CardName.VENUS_MAGNETIZER, VenusMagnetizer),
    CardManifest.dynamicFactory(CardName.VENUS_SOILS, VenusSoils),
    CardManifest.dynamicFactory(CardName.VENUS_WAYSTATION, VenusWaystation),
    CardManifest.staticFactory(CardName.WATER_TO_VENUS, new WaterToVenus()),
    CardManifest.dynamicFactory(CardName.LUXURY_FOODS, LuxuryFoods),
    CardManifest.dynamicFactory(CardName.NEUTRALIZER_FACTORY, NeutralizerFactory),
    CardManifest.dynamicFactory(CardName.ORBITAL_REFLECTORS, OrbitalReflectors),
    CardManifest.dynamicFactory(CardName.OMNICOURT, Omnicourt),
    CardManifest.dynamicFactory(CardName.MINING_QUOTA, MiningQuota),
  ],
  standardProjects: [
    CardManifest.dynamicFactory(CardName.STANDARD_AIR_SCRAPPING, AirScrapping),
  ],

  corporationCards: [
    CardManifest.dynamicFactory(CardName.APHRODITE, Aphrodite),
    CardManifest.dynamicFactory(CardName.CELESTIC, Celestic),
    CardManifest.dynamicFactory(CardName.MANUTECH, Manutech),
    CardManifest.dynamicFactory(CardName.MORNING_STAR_INC, MorningStarInc),
    CardManifest.dynamicFactory(CardName.VIRON, Viron),
  ]});
