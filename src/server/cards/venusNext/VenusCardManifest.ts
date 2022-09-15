import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AerialMappers} from './AerialMappers';
import {AerosportTournament} from './AerosportTournament';
import {AirScrappingStandardProject} from './AirScrappingStandardProject';
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
import {AirScrappingStandardProjectVariant} from './AirScrappingStandardProjectVariant';

export const VENUS_CARD_MANIFEST = new ModuleManifest({
  module: 'venus',
  projectCards: {
    [CardName.AERIAL_MAPPERS]: {Factory: AerialMappers},
    [CardName.AEROSPORT_TOURNAMENT]: {Factory: AerosportTournament},
    [CardName.AIR_SCRAPPING_EXPEDITION]: {Factory: AirScrappingExpedition},
    [CardName.ATALANTA_PLANITIA_LAB]: {Factory: AtalantaPlanitiaLab},
    [CardName.ATMOSCOOP]: {Factory: Atmoscoop},
    [CardName.COMET_FOR_VENUS]: {Factory: CometForVenus},
    [CardName.CORRODER_SUITS]: {Factory: CorroderSuits},
    [CardName.DAWN_CITY]: {Factory: DawnCity},
    [CardName.DEUTERIUM_EXPORT]: {Factory: DeuteriumExport},
    [CardName.DIRIGIBLES]: {Factory: Dirigibles},
    [CardName.EXTRACTOR_BALLOONS]: {Factory: ExtractorBalloons},
    [CardName.EXTREMOPHILES]: {Factory: Extremophiles},
    [CardName.FLOATING_HABS]: {Factory: FloatingHabs},
    [CardName.FORCED_PRECIPITATION]: {Factory: ForcedPrecipitation},
    [CardName.FREYJA_BIODOMES]: {Factory: FreyjaBiodomes},
    [CardName.GIANT_SOLAR_SHADE]: {Factory: GiantSolarShade},
    [CardName.GHG_IMPORT_FROM_VENUS]: {Factory: GHGImportFromVenus},
    [CardName.GYROPOLIS]: {Factory: Gyropolis},
    [CardName.HYDROGEN_TO_VENUS]: {Factory: HydrogenToVenus},
    [CardName.IO_SULPHUR_RESEARCH]: {Factory: IoSulphurResearch},
    [CardName.ISHTAR_MINING]: {Factory: IshtarMining},
    [CardName.JET_STREAM_MICROSCRAPPERS]: {Factory: JetStreamMicroscrappers},
    [CardName.LUNA_METROPOLIS]: {Factory: LunaMetropolis},
    [CardName.LOCAL_SHADING]: {Factory: LocalShading},
    [CardName.MAXWELL_BASE]: {Factory: MaxwellBase},
    [CardName.ROTATOR_IMPACTS]: {Factory: RotatorImpacts},
    [CardName.SISTER_PLANET_SUPPORT]: {Factory: SisterPlanetSupport},
    [CardName.SOLARNET]: {Factory: Solarnet},
    [CardName.SPIN_INDUCING_ASTEROID]: {Factory: SpinInducingAsteroid},
    [CardName.SPONSORED_ACADEMIES]: {Factory: SponsoredAcademies},
    [CardName.STRATOPOLIS]: {Factory: Stratopolis},
    [CardName.STRATOSPHERIC_BIRDS]: {Factory: StratosphericBirds},
    [CardName.SULPHUR_EATING_BACTERIA]: {Factory: SulphurEatingBacteria},
    [CardName.SULPHUR_EXPORTS]: {Factory: SulphurExports},
    [CardName.TERRAFORMING_CONTRACT]: {Factory: TerraformingContract},
    [CardName.THERMOPHILES]: {Factory: Thermophiles},
    [CardName.VENUS_GOVERNOR]: {Factory: VenusGovernor},
    [CardName.VENUSIAN_ANIMALS]: {Factory: VenusianAnimals},
    [CardName.VENUSIAN_INSECTS]: {Factory: VenusianInsects},
    [CardName.VENUSIAN_PLANTS]: {Factory: VenusianPlants},
    [CardName.VENUS_MAGNETIZER]: {Factory: VenusMagnetizer},
    [CardName.VENUS_SOILS]: {Factory: VenusSoils},
    [CardName.VENUS_WAYSTATION]: {Factory: VenusWaystation},
    [CardName.WATER_TO_VENUS]: {Factory: WaterToVenus},
    [CardName.LUXURY_FOODS]: {Factory: LuxuryFoods},
    [CardName.NEUTRALIZER_FACTORY]: {Factory: NeutralizerFactory},
    [CardName.ORBITAL_REFLECTORS]: {Factory: OrbitalReflectors},
    [CardName.OMNICOURT]: {Factory: Omnicourt},
    [CardName.MINING_QUOTA]: {Factory: MiningQuota},
  },
  standardProjects: {
    [CardName.AIR_SCRAPPING_STANDARD_PROJECT]: {Factory: AirScrappingStandardProject},
    [CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT]: {Factory: AirScrappingStandardProjectVariant},
  },

  corporationCards: {
    [CardName.APHRODITE]: {Factory: Aphrodite, compatibility: 'venus'},
    [CardName.CELESTIC]: {Factory: Celestic, compatibility: 'venus'},
    [CardName.MANUTECH]: {Factory: Manutech},
    [CardName.MORNING_STAR_INC]: {Factory: MorningStarInc, compatibility: 'venus'},
    [CardName.VIRON]: {Factory: Viron},
  },
});
