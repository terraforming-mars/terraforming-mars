import {ModuleManifest} from '../ModuleManifest';
import {CardName} from '../../../common/cards/CardName';

import {AdhaiHighOrbitConstructions} from './AdhaiHighOrbitConstructions';
import {AdvancedPowerGrid} from './AdvancedPowerGrid';
import {AgroDrones} from './AgroDrones';
import {Ambient} from './Ambient';
import {Anthozoa} from './Anthozoa';
import {AntidesertificationTechniques} from './AntidesertificationTechniques';
import {AsteroidResources} from './AsteroidResources';
import {Aurorai} from './Aurorai';
import {BotanicalExperience} from './BotanicalExperience';
import {BreedingFarms} from './BreedingFarms';
import {BioSol} from './BioSol';
import {CassiniStation} from './CassiniStation';
import {CeresSpaceport} from './CeresSpaceport';
import {CharityDonation} from './CharityDonation';
import {Chimera} from './Chimera';
import {CO2Reducers} from './CO2Reducers';
import {CollegiumCopernicus} from './CollegiumCopernicus';
import {CommunicationCenter} from './CommunicationCenter';
import {ControlledBloom} from './ControlledBloom';
import {CoordinatedRaid} from './CoordinatedRaid';
import {CrewTraining} from './CrewTraining';
import {Cryptocurrency} from './Cryptocurrency';
import {CultivationOfVenus} from './CultivationOfVenus';
import {Cyanobacteria} from './Cyanobacteria';
import {DataLeak} from './DataLeak';
import {DeclarationOfIndependence} from './DeclarationOfIndependence';
import {DeepSpaceOperations} from './DeepSpaceOperations';
import {DesignCompany} from './DesignCompany';
import {DesignedOrganisms} from './DesignedOrganisms';
import {DustStorm} from './DustStorm';
import {DysonScreens} from './DysonScreens';
import {EarlyExpedition} from './EarlyExpedition';
import {EconomicEspionage} from './EconomicEspionage';
import {EconomicHelp} from './EconomicHelp';
import {ExpeditionToTheSurfaceVenus} from './ExpeditionToTheSurfaceVenus';
import {ExperiencedMartians} from './ExperiencedMartians';
import {FlatMarsTheory} from './FlatMarsTheory';
import {FloaterUrbanism} from './FloaterUrbanism';
import {GeologicalExpedition} from './GeologicalExpedition';
import {HabitatMarte} from './HabitatMarte';
import {HighTempSuperconductors} from './HighTempSuperconductors';
import {HuygensObservatory} from './HuygensObservatory';
import {HydrogenBombardment} from './HydrogenBombardment';
import {HydrogenProcessingPlant} from './HydrogenProcessingPlant';
import {InterplanetaryTransport} from './InterplanetaryTransport';
import {Kickstarter} from './Kickstarter';
import {LastResortIngenuity} from './LastResortIngenuity';
import {LobbyHalls} from './LobbyHalls';
import {LunarEmbassy} from './LunarEmbassy';
import {LuxuryEstate} from './LuxuryEstate';
import {MarsDirect} from './MarsDirect';
import {MartianCulture} from './MartianCulture';
import {MartianDustProcessingPlant} from './MartianDustProcessingPlant';
import {MartianInsuranceGroup} from './MartianInsuranceGroup';
import {MartianMonuments} from './MartianMonuments';
import {MartianNatureWonders} from './MartianNatureWonders';
import {MartianRepository} from './MartianRepository';
import {MicrobiologyPatents} from './MicrobiologyPatents';
import {MindSetMars} from './MindSetMars';
import {MuseumofEarlyColonisation} from './MuseumofEarlyColonisation';
import {NewVenice} from './NewVenice';
import {NobelLabs} from './NobelLabs';
import {Odyssey} from './Odyssey';
import {OrbitalLaboratories} from './OrbitalLaboratories';
import {OumuamuaTypeObjectSurvey} from './OumuamuaTypeObjectSurvey';
import {OzoneGenerators} from './OzoneGenerators';
import {PersonalAgenda} from './PersonalAgenda';
import {Polaris} from './Polaris';
import {Pollinators} from './Pollinators';
import {PowerPlant} from './PowerPlant';
import {PrefabricationofHumanHabitats} from './PrefabricationofHumanHabitats';
import {PrivateSecurity} from './PrivateSecurity';
import {PublicSponsoredGrant} from './PublicSponsoredGrant';
import {RareEarthElements} from './RareEarthElements';
import {RedCity} from './RedCity';
import {Ringcom} from './Ringcom';
import {ResearchGrant} from './ResearchGrant';
import {ReturntoAbandonedTechnology} from './ReturntoAbandonedTechnology';
import {RichDeposits} from './RichDeposits';
import {RobinHaulings} from './RobinHaulings';
import {SecretLabs} from './SecretLabs';
import {SmallOpenPitMine} from './SmallOpenPitMine';
import {SmallComet} from './SmallComet';
import {SocialEvents} from './SocialEvents';
import {SoilDetoxification} from './SoilDetoxification';
import {Solarpedia} from './Solarpedia';
import {SolarStorm} from './SolarStorm';
import {SoylentSeedlingSystems} from './SoylentSeedlingSystems';
import {SpaceDebrisCleaningOperation} from './SpaceDebrisCleaningOperation';
import {SpaceRelay} from './SpaceRelay';
import {SpecializedSettlement} from './SpecializedSettlement';
import {StrategicBasePlanning} from './StrategicBasePlanning';
import {Steelaris} from './Steelaris';
import {SurveyMission} from './SurveyMission';
import {TerraformingControlStation} from './TerraformingControlStation';
import {TerraformingRobots} from './TerraformingRobots';
import {TheNewSpaceRace} from './TheNewSpaceRace';
import {ValuableGases} from './ValuableGases';
import {VeneraBase} from './VeneraBase';
import {VenusFirst} from './VenusFirst';
import {VitalColony} from './VitalColony';
import {Wetlands} from './Wetlands';

export const PATHFINDERS_CARD_MANIFEST = new ModuleManifest({
  module: 'pathfinders',
  projectCards: {
    [CardName.BREEDING_FARMS]: {Factory: BreedingFarms},
    [CardName.PREFABRICATION_OF_HUMAN_HABITATS]: {Factory: PrefabricationofHumanHabitats},
    [CardName.NEW_VENICE]: {Factory: NewVenice},
    [CardName.AGRO_DRONES]: {Factory: AgroDrones},
    [CardName.WETLANDS]: {Factory: Wetlands},
    [CardName.RARE_EARTH_ELEMENTS]: {Factory: RareEarthElements},
    [CardName.ORBITAL_LABORATORIES]: {Factory: OrbitalLaboratories},
    [CardName.DUST_STORM]: {Factory: DustStorm},
    [CardName.MARTIAN_MONUMENTS]: {Factory: MartianMonuments},
    [CardName.MARTIAN_NATURE_WONDERS]: {Factory: MartianNatureWonders},
    [CardName.MUSEUM_OF_EARLY_COLONISATION]: {Factory: MuseumofEarlyColonisation},
    [CardName.TERRAFORMING_CONTROL_STATION]: {Factory: TerraformingControlStation, compatibility: 'venus'},
    // // [CardName.MARTIAN_TRANSHIPMENT_STATION]: {Factory: MartianTranshipmentStation},  // COMPLICATED EFFECT.
    [CardName.CERES_SPACEPORT]: {Factory: CeresSpaceport},
    [CardName.DYSON_SCREENS]: {Factory: DysonScreens},
    [CardName.LUNAR_EMBASSY]: {Factory: LunarEmbassy},
    [CardName.GEOLOGICAL_EXPEDITION]: {Factory: GeologicalExpedition},
    [CardName.EARLY_EXPEDITION]: {Factory: EarlyExpedition},
    [CardName.HYDROGEN_PROCESSING_PLANT]: {Factory: HydrogenProcessingPlant},
    [CardName.POWER_PLANT_PATHFINDERS]: {Factory: PowerPlant},
    [CardName.LUXURY_ESTATE]: {Factory: LuxuryEstate},
    [CardName.RETURN_TO_ABANDONED_TECHNOLOGY]: {Factory: ReturntoAbandonedTechnology},
    [CardName.DESIGNED_ORGANISMS]: {Factory: DesignedOrganisms},
    [CardName.SPACE_DEBRIS_CLEANING_OPERATION]: {Factory: SpaceDebrisCleaningOperation},
    [CardName.PRIVATE_SECURITY]: {Factory: PrivateSecurity},
    [CardName.SECRET_LABS]: {Factory: SecretLabs},
    [CardName.CYANOBACTERIA]: {Factory: Cyanobacteria},
    [CardName.COMMUNICATION_CENTER]: {Factory: CommunicationCenter},
    [CardName.MARTIAN_REPOSITORY]: {Factory: MartianRepository},
    [CardName.DATA_LEAK]: {Factory: DataLeak},
    [CardName.SMALL_OPEN_PIT_MINE]: {Factory: SmallOpenPitMine},
    [CardName.SOLAR_STORM]: {Factory: SolarStorm},
    [CardName.SPACE_RELAY]: {Factory: SpaceRelay},
    [CardName.DECLARATION_OF_INDEPENDENCE]: {Factory: DeclarationOfIndependence, compatibility: 'turmoil'},
    [CardName.MARTIAN_CULTURE]: {Factory: MartianCulture},
    [CardName.OZONE_GENERATORS]: {Factory: OzoneGenerators},
    [CardName.SMALL_COMET]: {Factory: SmallComet},
    [CardName.ECONOMIC_ESPIONAGE]: {Factory: EconomicEspionage},
    [CardName.FLAT_MARS_THEORY]: {Factory: FlatMarsTheory},
    [CardName.ASTEROID_RESOURCES]: {Factory: AsteroidResources},
    [CardName.KICKSTARTER]: {Factory: Kickstarter},
    [CardName.ECONOMIC_HELP]: {Factory: EconomicHelp},
    [CardName.INTERPLANETARY_TRANSPORT]: {Factory: InterplanetaryTransport},
    [CardName.MARTIAN_DUST_PROCESSING_PLANT]: {Factory: MartianDustProcessingPlant},
    [CardName.CULTIVATION_OF_VENUS]: {Factory: CultivationOfVenus, compatibility: 'venus'},
    [CardName.EXPEDITION_TO_THE_SURFACE_VENUS]: {Factory: ExpeditionToTheSurfaceVenus, compatibility: 'venus'},
    [CardName.LAST_RESORT_INGENUITY]: {Factory: LastResortIngenuity},
    // // [CardName.CRASHLANDING]: {Factory: Crashlanding},                             // COMPLICATED ADJACENCY BONUS RULES
    // // [CardName.THINK_TANK]: {Factory: ThinkTank},                                  // COMPLICATED REQUIREMENT RULES
    [CardName.BOTANICAL_EXPERIENCE]: {Factory: BotanicalExperience},
    [CardName.CRYPTOCURRENCY]: {Factory: Cryptocurrency},
    [CardName.RICH_DEPOSITS]: {Factory: RichDeposits},
    [CardName.OUMUAMUA_TYPE_OBJECT_SURVEY]: {Factory: OumuamuaTypeObjectSurvey},
    [CardName.SOLARPEDIA]: {Factory: Solarpedia, compatibility: 'venus'},
    [CardName.ANTHOZOA]: {Factory: Anthozoa},
    [CardName.ADVANCED_POWER_GRID]: {Factory: AdvancedPowerGrid},
    [CardName.SPECIALIZED_SETTLEMENT]: {Factory: SpecializedSettlement},
    [CardName.CHARITY_DONATION]: {Factory: CharityDonation},
    // // [CardName.CURIOSITY_LABS]: {Factory: CuriosityLabs},                          // TWO RESOURCE TYPES
    [CardName.NOBEL_LABS]: {Factory: NobelLabs},
    [CardName.HUYGENS_OBSERVATORY]: {Factory: HuygensObservatory, compatibility: 'colonies'},
    [CardName.CASSINI_STATION]: {Factory: CassiniStation, compatibility: 'colonies'},
    [CardName.MICROBIOLOGY_PATENTS]: {Factory: MicrobiologyPatents},
    [CardName.COORDINATED_RAID]: {Factory: CoordinatedRaid, compatibility: 'colonies'},
    [CardName.LOBBY_HALLS]: {Factory: LobbyHalls, compatibility: 'turmoil'},
    [CardName.RED_CITY]: {Factory: RedCity, compatibility: 'turmoil'},
    [CardName.VENERA_BASE]: {Factory: VeneraBase, compatibility: ['turmoil', 'venus']},
    // // [CardName.GATEWAY_STATION]: {Factory: GatewayStation, compatibility: 'turmoil'}, // Place a city tile outside Mars with new adjacency??
    [CardName.FLOATER_URBANISM]: {Factory: FloaterUrbanism, compatibility: 'venus'},
    [CardName.SOIL_DETOXIFICATION]: {Factory: SoilDetoxification, compatibility: 'turmoil'},
    [CardName.HIGH_TEMP_SUPERCONDUCTORS]: {Factory: HighTempSuperconductors, compatibility: 'turmoil'},
    [CardName.PUBLIC_SPONSORED_GRANT]: {Factory: PublicSponsoredGrant, compatibility: 'turmoil'},
    [CardName.POLLINATORS]: {Factory: Pollinators},
    [CardName.SOCIAL_EVENTS]: {Factory: SocialEvents},
    [CardName.CONTROLLED_BLOOM]: {Factory: ControlledBloom},
    [CardName.TERRAFORMING_ROBOTS]: {Factory: TerraformingRobots},
  },
  corporationCards: {
    [CardName.POLARIS]: {Factory: Polaris},
    // [CardName.PLANET_PR]: {Factory: planetpr},
    [CardName.AMBIENT]: {Factory: Ambient, compatibility: 'venus'},
    [CardName.RINGCOM]: {Factory: Ringcom},
    [CardName.CHIMERA]: {Factory: Chimera},
    // [CardName.SISTEMAS_SEEBECK]: {Factory: SistemasSeebeck},
    // [CardName.SPIRE]: {Factory: Spire},
    [CardName.SOYLENT_SEEDLING_SYSTEMS]: {Factory: SoylentSeedlingSystems},
    [CardName.STEELARIS]: {Factory: Steelaris},
    // [CardName.MARS_MATHS]: {Factory: MarsMaths},
    [CardName.MARS_DIRECT]: {Factory: MarsDirect, compatibility: 'pathfinders'},
    [CardName.MARTIAN_INSURANCE_GROUP]: {Factory: MartianInsuranceGroup, compatibility: 'pathfinders'},
    // [CardName.SOLBANK]: {Factory: SolBank},
    [CardName.BIO_SOL]: {Factory: BioSol},
    [CardName.AURORAI]: {Factory: Aurorai, compatibility: 'pathfinders'},
    [CardName.COLLEGIUM_COPERNICUS]: {Factory: CollegiumCopernicus, compatibility: 'colonies'},
    [CardName.ROBIN_HAULINGS]: {Factory: RobinHaulings, compatibility: ['venus', 'pathfinders']},
    [CardName.ODYSSEY]: {Factory: Odyssey},
    // [CardName.GAGARIN_MOBILE_BASE]: {Factory: GagarinMobileBase},
    // [CardName.MARS_FRONTIER_ALLIANCE]: {Factory: MarsFrontierAlliance},
    [CardName.MIND_SET_MARS]: {Factory: MindSetMars, compatibility: 'turmoil'},
    [CardName.HABITAT_MARTE]: {Factory: HabitatMarte, compatibility: 'pathfinders'},
    [CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS]: {Factory: AdhaiHighOrbitConstructions, compatibility: 'colonies'},
  },
  preludeCards: {
    [CardName.VENUS_FIRST_PATHFINDERS]: {Factory: VenusFirst, compatibility: 'venus'},
    [CardName.VALUABLE_GASES_PATHFINDERS]: {Factory: ValuableGases, compatibility: 'venus'},
    [CardName.CO2_REDUCERS]: {Factory: CO2Reducers, compatibility: 'venus'},
    [CardName.HYDROGEN_BOMBARDMENT]: {Factory: HydrogenBombardment, compatibility: 'venus'},
    [CardName.RESEARCH_GRANT_PATHFINDERS]: {Factory: ResearchGrant},
    [CardName.CREW_TRAINING]: {Factory: CrewTraining, compatibility: 'pathfinders'},
    [CardName.SURVEY_MISSION]: {Factory: SurveyMission},
    [CardName.DESIGN_COMPANY]: {Factory: DesignCompany},
    // [CardName.CONSOLIDATION]: {Factory: Consolidation},
    [CardName.PERSONAL_AGENDA]: {Factory: PersonalAgenda},
    [CardName.VITAL_COLONY]: {Factory: VitalColony, compatibility: 'colonies'},
    [CardName.STRATEGIC_BASE_PLANNING]: {Factory: StrategicBasePlanning, compatibility: 'colonies'},
    [CardName.DEEP_SPACE_OPERATIONS]: {Factory: DeepSpaceOperations},
    [CardName.ANTI_DESERTIFICATION_TECHNIQUES]: {Factory: AntidesertificationTechniques},
    [CardName.EXPERIENCED_MARTIANS]: {Factory: ExperiencedMartians, compatibility: ['turmoil', 'pathfinders']},
    [CardName.THE_NEW_SPACE_RACE]: {Factory: TheNewSpaceRace, compatibility: 'turmoil'},
  },

  // Perhaps these community cards should just move to this manifest, but only if it becomes
  // generally easier to just add all the preludes that match what game someone's playing.
  cardsToRemove: [
    CardName.VENUS_FIRST,
    CardName.RESEARCH_GRANT,
    CardName.VALUABLE_GASES,
  ],
});

