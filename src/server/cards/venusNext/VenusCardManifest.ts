import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {AerialMappers} from '@/server/cards/venusNext/AerialMappers';
import {AerosportTournament} from '@/server/cards/venusNext/AerosportTournament';
import {AirScrappingStandardProject} from '@/server/cards/venusNext/AirScrappingStandardProject';
import {AirScrappingExpedition} from '@/server/cards/venusNext/AirScrappingExpedition';
import {Aphrodite} from '@/server/cards/venusNext/Aphrodite';
import {AtalantaPlanitiaLab} from '@/server/cards/venusNext/AtalantaPlanitiaLab';
import {Atmoscoop} from '@/server/cards/venusNext/Atmoscoop';
import {Celestic} from '@/server/cards/venusNext/Celestic';
import {CometForVenus} from '@/server/cards/venusNext/CometForVenus';
import {CorroderSuits} from '@/server/cards/venusNext/CorroderSuits';
import {DawnCity} from '@/server/cards/venusNext/DawnCity';
import {DeuteriumExport} from '@/server/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '@/server/cards/venusNext/Dirigibles';
import {ExtractorBalloons} from '@/server/cards/venusNext/ExtractorBalloons';
import {Extremophiles} from '@/server/cards/venusNext/Extremophiles';
import {FloatingHabs} from '@/server/cards/venusNext/FloatingHabs';
import {ForcedPrecipitation} from '@/server/cards/venusNext/ForcedPrecipitation';
import {FreyjaBiodomes} from '@/server/cards/venusNext/FreyjaBiodomes';
import {GHGImportFromVenus} from '@/server/cards/venusNext/GHGImportFromVenus';
import {GiantSolarShade} from '@/server/cards/venusNext/GiantSolarShade';
import {Gyropolis} from '@/server/cards/venusNext/Gyropolis';
import {HydrogenToVenus} from '@/server/cards/venusNext/HydrogenToVenus';
import {IoSulphurResearch} from '@/server/cards/venusNext/IoSulphurResearch';
import {IshtarMining} from '@/server/cards/venusNext/IshtarMining';
import {JetStreamMicroscrappers} from '@/server/cards/venusNext/JetStreamMicroscrappers';
import {LocalShading} from '@/server/cards/venusNext/LocalShading';
import {LunaMetropolis} from '@/server/cards/venusNext/LunaMetropolis';
import {LuxuryFoods} from '@/server/cards/venusNext/LuxuryFoods';
import {Manutech} from '@/server/cards/venusNext/Manutech';
import {MaxwellBase} from '@/server/cards/venusNext/MaxwellBase';
import {MiningQuota} from '@/server/cards/venusNext/MiningQuota';
import {MorningStarInc} from '@/server/cards/venusNext/MorningStarInc';
import {NeutralizerFactory} from '@/server/cards/venusNext/NeutralizerFactory';
import {Omnicourt} from '@/server/cards/venusNext/Omnicourt';
import {OrbitalReflectors} from '@/server/cards/venusNext/OrbitalReflectors';
import {RotatorImpacts} from '@/server/cards/venusNext/RotatorImpacts';
import {SisterPlanetSupport} from '@/server/cards/venusNext/SisterPlanetSupport';
import {Solarnet} from '@/server/cards/venusNext/Solarnet';
import {SpinInducingAsteroid} from '@/server/cards/venusNext/SpinInducingAsteroid';
import {SponsoredAcademies} from '@/server/cards/venusNext/SponsoredAcademies';
import {Stratopolis} from '@/server/cards/venusNext/Stratopolis';
import {StratosphericBirds} from '@/server/cards/venusNext/StratosphericBirds';
import {SulphurEatingBacteria} from '@/server/cards/venusNext/SulphurEatingBacteria';
import {SulphurExports} from '@/server/cards/venusNext/SulphurExports';
import {TerraformingContract} from '@/server/cards/venusNext/TerraformingContract';
import {Thermophiles} from '@/server/cards/venusNext/Thermophiles';
import {VenusGovernor} from '@/server/cards/venusNext/VenusGovernor';
import {VenusianAnimals} from '@/server/cards/venusNext/VenusianAnimals';
import {VenusianInsects} from '@/server/cards/venusNext/VenusianInsects';
import {VenusianPlants} from '@/server/cards/venusNext/VenusianPlants';
import {VenusMagnetizer} from '@/server/cards/venusNext/VenusMagnetizer';
import {VenusSoils} from '@/server/cards/venusNext/VenusSoils';
import {VenusWaystation} from '@/server/cards/venusNext/VenusWaystation';
import {Viron} from '@/server/cards/venusNext/Viron';
import {WaterToVenus} from '@/server/cards/venusNext/WaterToVenus';
import {AirScrappingStandardProjectVariant} from '@/server/cards/venusNext/AirScrappingStandardProjectVariant';

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
