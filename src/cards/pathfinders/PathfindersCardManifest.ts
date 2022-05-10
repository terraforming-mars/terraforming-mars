import {CardManifest} from '../CardManifest';
import {CardName} from '../../common/cards/CardName';

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
// import {Odyssey} from './Odyssey';
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
import {ValuableGases} from './ValuableGases';
import {VeneraBase} from './VeneraBase';
import {VenusFirst} from './VenusFirst';
import {VitalColony} from './VitalColony';
import {Wetlands} from './Wetlands';

export const PATHFINDERS_CARD_MANIFEST = new CardManifest({
  module: 'pathfinders',
  projectCards: [
    {cardName: CardName.BREEDING_FARMS, Factory: BreedingFarms},
    {cardName: CardName.PREFABRICATION_OF_HUMAN_HABITATS, Factory: PrefabricationofHumanHabitats},
    {cardName: CardName.NEW_VENICE, Factory: NewVenice},
    {cardName: CardName.AGRO_DRONES, Factory: AgroDrones},
    {cardName: CardName.WETLANDS, Factory: Wetlands},
    {cardName: CardName.RARE_EARTH_ELEMENTS, Factory: RareEarthElements},
    {cardName: CardName.ORBITAL_LABORATORIES, Factory: OrbitalLaboratories},
    {cardName: CardName.DUST_STORM, Factory: DustStorm},
    {cardName: CardName.MARTIAN_MONUMENTS, Factory: MartianMonuments},
    {cardName: CardName.MARTIAN_NATURE_WONDERS, Factory: MartianNatureWonders},
    {cardName: CardName.MUSEUM_OF_EARLY_COLONISATION, Factory: MuseumofEarlyColonisation},
    {cardName: CardName.TERRAFORMING_CONTROL_STATION, Factory: TerraformingControlStation, compatibility: 'venus'},
    // // {cardName: CardName.MARTIAN_TRANSHIPMENT_STATION, Factory: MartianTranshipmentStation},  // COMPLICATED EFFECT.
    {cardName: CardName.CERES_SPACEPORT, Factory: CeresSpaceport},
    {cardName: CardName.DYSON_SCREENS, Factory: DysonScreens},
    {cardName: CardName.LUNAR_EMBASSY, Factory: LunarEmbassy},
    {cardName: CardName.GEOLOGICAL_EXPEDITION, Factory: GeologicalExpedition},
    {cardName: CardName.EARLY_EXPEDITION, Factory: EarlyExpedition},
    {cardName: CardName.HYDROGEN_PROCESSING_PLANT, Factory: HydrogenProcessingPlant},
    {cardName: CardName.POWER_PLANT_PATHFINDERS, Factory: PowerPlant},
    {cardName: CardName.LUXURY_ESTATE, Factory: LuxuryEstate},
    {cardName: CardName.RETURN_TO_ABANDONED_TECHNOLOGY, Factory: ReturntoAbandonedTechnology},
    {cardName: CardName.DESIGNED_ORGANISMS, Factory: DesignedOrganisms},
    {cardName: CardName.SPACE_DEBRIS_CLEANING_OPERATION, Factory: SpaceDebrisCleaningOperation},
    {cardName: CardName.PRIVATE_SECURITY, Factory: PrivateSecurity},
    {cardName: CardName.SECRET_LABS, Factory: SecretLabs},
    {cardName: CardName.CYANOBACTERIA, Factory: Cyanobacteria},
    {cardName: CardName.COMMUNICATION_CENTER, Factory: CommunicationCenter},
    {cardName: CardName.MARTIAN_REPOSITORY, Factory: MartianRepository},
    {cardName: CardName.DATA_LEAK, Factory: DataLeak},
    {cardName: CardName.SMALL_OPEN_PIT_MINE, Factory: SmallOpenPitMine},
    {cardName: CardName.SOLAR_STORM, Factory: SolarStorm},
    {cardName: CardName.SPACE_RELAY, Factory: SpaceRelay},
    {cardName: CardName.DECLARATION_OF_INDEPENDENCE, Factory: DeclarationOfIndependence, compatibility: 'turmoil'},
    {cardName: CardName.MARTIAN_CULTURE, Factory: MartianCulture},
    {cardName: CardName.OZONE_GENERATORS, Factory: OzoneGenerators},
    {cardName: CardName.SMALL_COMET, Factory: SmallComet},
    {cardName: CardName.ECONOMIC_ESPIONAGE, Factory: EconomicEspionage},
    {cardName: CardName.FLAT_MARS_THEORY, Factory: FlatMarsTheory},
    {cardName: CardName.ASTEROID_RESOURCES, Factory: AsteroidResources},
    {cardName: CardName.KICKSTARTER, Factory: Kickstarter},
    {cardName: CardName.ECONOMIC_HELP, Factory: EconomicHelp},
    {cardName: CardName.INTERPLANETARY_TRANSPORT, Factory: InterplanetaryTransport},
    {cardName: CardName.MARTIAN_DUST_PROCESSING_PLANT, Factory: MartianDustProcessingPlant},
    {cardName: CardName.CULTIVATION_OF_VENUS, Factory: CultivationOfVenus, compatibility: 'venus'},
    {cardName: CardName.EXPEDITION_TO_THE_SURFACE_VENUS, Factory: ExpeditionToTheSurfaceVenus, compatibility: 'venus'},
    {cardName: CardName.LAST_RESORT_INGENUITY, Factory: LastResortIngenuity},
    // // {cardName: CardName.CRASHLANDING, Factory: Crashlanding},                             // COMPLICATED ADJACENCY BONUS RULES
    // // {cardName: CardName.THINK_TANK, Factory: ThinkTank},                                  // COMPLICATED REQUIREMENT RULES
    {cardName: CardName.BOTANICAL_EXPERIENCE, Factory: BotanicalExperience},
    {cardName: CardName.CRYPTOCURRENCY, Factory: Cryptocurrency},
    {cardName: CardName.RICH_DEPOSITS, Factory: RichDeposits},
    {cardName: CardName.OUMUAMUA_TYPE_OBJECT_SURVEY, Factory: OumuamuaTypeObjectSurvey},
    {cardName: CardName.SOLARPEDIA, Factory: Solarpedia, compatibility: 'venus'},
    {cardName: CardName.ANTHOZOA, Factory: Anthozoa},
    {cardName: CardName.ADVANCED_POWER_GRID, Factory: AdvancedPowerGrid},
    {cardName: CardName.SPECIALIZED_SETTLEMENT, Factory: SpecializedSettlement},
    {cardName: CardName.CHARITY_DONATION, Factory: CharityDonation},
    // // {cardName: CardName.CURIOSITY_LABS, Factory: CuriosityLabs},                          // TWO RESOURCE TYPES
    {cardName: CardName.NOBEL_LABS, Factory: NobelLabs},
    {cardName: CardName.HUYGENS_OBSERVATORY, Factory: HuygensObservatory, compatibility: 'colonies'},
    {cardName: CardName.CASSINI_STATION, Factory: CassiniStation, compatibility: 'colonies'},
    {cardName: CardName.MICROBIOLOGY_PATENTS, Factory: MicrobiologyPatents},
    {cardName: CardName.COORDINATED_RAID, Factory: CoordinatedRaid, compatibility: 'colonies'},
    {cardName: CardName.LOBBY_HALLS, Factory: LobbyHalls, compatibility: 'turmoil'},
    {cardName: CardName.RED_CITY, Factory: RedCity, compatibility: 'turmoil'},
    {cardName: CardName.VENERA_BASE, Factory: VeneraBase, compatibility: ['turmoil', 'venus']},
    // // {cardName: CardName.GATEWAY_STATION, Factory: GatewayStation, compatibility: 'turmoil'}, // Place a city tile outside Mars with new adjacency??
    {cardName: CardName.FLOATER_URBANISM, Factory: FloaterUrbanism, compatibility: 'venus'},
    {cardName: CardName.SOIL_DETOXIFICATION, Factory: SoilDetoxification, compatibility: 'turmoil'},
    {cardName: CardName.HIGH_TEMP_SUPERCONDUCTORS, Factory: HighTempSuperconductors, compatibility: 'turmoil'},
    {cardName: CardName.PUBLIC_SPONSORED_GRANT, Factory: PublicSponsoredGrant, compatibility: 'turmoil'},
    {cardName: CardName.POLLINATORS, Factory: Pollinators},
    {cardName: CardName.SOCIAL_EVENTS, Factory: SocialEvents},
    {cardName: CardName.CONTROLLED_BLOOM, Factory: ControlledBloom},
    {cardName: CardName.TERRAFORMING_ROBOTS, Factory: TerraformingRobots},
  ],
  corporationCards: [
    {cardName: CardName.POLARIS, Factory: Polaris},
    // {cardName: CardName.PLANET_PR, Factory: planetpr},
    {cardName: CardName.AMBIENT, Factory: Ambient, compatibility: 'venus'},
    {cardName: CardName.RINGCOM, Factory: Ringcom},
    {cardName: CardName.CHIMERA, Factory: Chimera},
    // {cardName: CardName.SISTEMAS_SEEBECK, Factory: SistemasSeebeck},
    // {cardName: CardName.SPIRE, Factory: Spire},
    {cardName: CardName.SOYLENT_SEEDLING_SYSTEMS, Factory: SoylentSeedlingSystems},
    {cardName: CardName.STEELARIS, Factory: Steelaris},
    // {cardName: CardName.MARS_MATHS, Factory: MarsMaths},
    {cardName: CardName.MARS_DIRECT, Factory: MarsDirect, compatibility: 'pathfinders'},
    {cardName: CardName.MARTIAN_INSURANCE_GROUP, Factory: MartianInsuranceGroup, compatibility: 'pathfinders'},
    // {cardName: CardName.SOLBANK, Factory: SolBank},
    {cardName: CardName.BIO_SOL, Factory: BioSol},
    {cardName: CardName.AURORAI, Factory: Aurorai},
    {cardName: CardName.COLLEGIUM_COPERNICUS, Factory: CollegiumCopernicus, compatibility: 'colonies'},
    {cardName: CardName.ROBIN_HAULINGS, Factory: RobinHaulings, compatibility: ['venus', 'pathfinders']},
    // {cardName: CardName.ODYSSEY, Factory: Odyssey},
    // {cardName: CardName.GAGARIN_MOBILE_BASE, Factory: GagarinMobileBase},
    // {cardName: CardName.MARS_FRONTIER_ALLIANCE, Factory: MarsFrontierAlliance},
    {cardName: CardName.MIND_SET_MARS, Factory: MindSetMars, compatibility: 'turmoil'},
    {cardName: CardName.HABITAT_MARTE, Factory: HabitatMarte},
    {cardName: CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS, Factory: AdhaiHighOrbitConstructions},
  ],
  preludeCards: [
    {cardName: CardName.VENUS_FIRST_PATHFINDERS, Factory: VenusFirst, compatibility: 'venus'},
    {cardName: CardName.VALUABLE_GASES_PATHFINDERS, Factory: ValuableGases, compatibility: 'venus'},
    {cardName: CardName.CO2_REDUCERS, Factory: CO2Reducers, compatibility: 'venus'},
    {cardName: CardName.HYDROGEN_BOMBARDMENT, Factory: HydrogenBombardment, compatibility: 'venus'},
    {cardName: CardName.RESEARCH_GRANT_PATHFINDERS, Factory: ResearchGrant},
    {cardName: CardName.CREW_TRAINING, Factory: CrewTraining},
    {cardName: CardName.SURVEY_MISSION, Factory: SurveyMission},
    {cardName: CardName.DESIGN_COMPANY, Factory: DesignCompany},
    // {cardName: CardName.CONSOLIDATION, Factory: Consolidation},
    {cardName: CardName.PERSONAL_AGENDA, Factory: PersonalAgenda},
    {cardName: CardName.VITAL_COLONY, Factory: VitalColony, compatibility: 'colonies'},
    {cardName: CardName.STRATEGIC_BASE_PLANNING, Factory: StrategicBasePlanning, compatibility: 'colonies'},
    {cardName: CardName.DEEP_SPACE_OPERATIONS, Factory: DeepSpaceOperations},
    {cardName: CardName.ANTI_DESERTIFICATION_TECHNIQUES, Factory: AntidesertificationTechniques},
    {cardName: CardName.EXPERIENCED_MARTIANS, Factory: ExperiencedMartians, compatibility: 'turmoil'},
    // {cardName: CardName.THE_NEW_SPACE_RACE, Factory: TheNewSpaceRace},
  ],

  // Perhaps these community cards should just move to this manifest, but only if it becomes
  // generally easier to just add all the preludes that match what game someone's playing.
  cardsToRemove: [
    CardName.VENUS_FIRST,
    CardName.RESEARCH_GRANT,
  ],
});

