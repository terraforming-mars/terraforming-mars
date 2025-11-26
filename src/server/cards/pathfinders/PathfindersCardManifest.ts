import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {CardName} from '@/common/cards/CardName';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';

import {AdhaiHighOrbitConstructions} from '@/server/cards/pathfinders/AdhaiHighOrbitConstructions';
import {AdvancedPowerGrid} from '@/server/cards/pathfinders/AdvancedPowerGrid';
import {AgroDrones} from '@/server/cards/pathfinders/AgroDrones';
import {Ambient} from '@/server/cards/pathfinders/Ambient';
import {Anthozoa} from '@/server/cards/pathfinders/Anthozoa';
import {AsteroidResources} from '@/server/cards/pathfinders/AsteroidResources';
import {Aurorai} from '@/server/cards/pathfinders/Aurorai';
import {BalancedDevelopment} from '@/server/cards/pathfinders/BalancedDevelopment';
import {BioSol} from '@/server/cards/pathfinders/BioSol';
import {BotanicalExperience} from '@/server/cards/pathfinders/BotanicalExperience';
import {BreedingFarms} from '@/server/cards/pathfinders/BreedingFarms';
import {CassiniStation} from '@/server/cards/pathfinders/CassiniStation';
import {CeresSpaceport} from '@/server/cards/pathfinders/CeresSpaceport';
import {CharityDonation} from '@/server/cards/pathfinders/CharityDonation';
import {Chimera} from '@/server/cards/pathfinders/Chimera';
import {CO2Reducers} from '@/server/cards/pathfinders/CO2Reducers';
import {CollegiumCopernicus} from '@/server/cards/pathfinders/CollegiumCopernicus';
import {CommunicationBoom} from '@/server/cards/pathfinders/CommunicationBoom';
import {CommunicationCenter} from '@/server/cards/pathfinders/CommunicationCenter';
import {ConstantStruggle} from '@/server/cards/pathfinders/ConstantStruggle';
import {ControlledBloom} from '@/server/cards/pathfinders/ControlledBloom';
import {CoordinatedRaid} from '@/server/cards/pathfinders/CoordinatedRaid';
import {Crashlanding} from '@/server/cards/pathfinders/Crashlanding';
import {CrewTraining} from '@/server/cards/pathfinders/CrewTraining';
import {Cryptocurrency} from '@/server/cards/pathfinders/Cryptocurrency';
import {CultivationOfVenus} from '@/server/cards/pathfinders/CultivationOfVenus';
import {Cyanobacteria} from '@/server/cards/pathfinders/Cyanobacteria';
import {DataLeak} from '@/server/cards/pathfinders/DataLeak';
import {DeclarationOfIndependence} from '@/server/cards/pathfinders/DeclarationOfIndependence';
import {DeepSpaceOperations} from '@/server/cards/pathfinders/DeepSpaceOperations';
import {DesignCompany} from '@/server/cards/pathfinders/DesignCompany';
import {DesignedOrganisms} from '@/server/cards/pathfinders/DesignedOrganisms';
import {DustStorm} from '@/server/cards/pathfinders/DustStorm';
import {DysonScreens} from '@/server/cards/pathfinders/DysonScreens';
import {EarlyExpedition} from '@/server/cards/pathfinders/EarlyExpedition';
import {EconomicEspionage} from '@/server/cards/pathfinders/EconomicEspionage';
import {EconomicHelp} from '@/server/cards/pathfinders/EconomicHelp';
import {ExpeditionToTheSurfaceVenus} from '@/server/cards/pathfinders/ExpeditionToTheSurfaceVenus';
import {ExperiencedMartians} from '@/server/cards/pathfinders/ExperiencedMartians';
import {FlatMarsTheory} from '@/server/cards/pathfinders/FlatMarsTheory';
import {FloaterUrbanism} from '@/server/cards/pathfinders/FloaterUrbanism';
import {GagarinMobileBase} from '@/server/cards/pathfinders/GagarinMobileBase';
import {GeologicalExpedition} from '@/server/cards/pathfinders/GeologicalExpedition';
import {HabitatMarte} from '@/server/cards/pathfinders/HabitatMarte';
import {HighTempSuperconductors} from '@/server/cards/pathfinders/HighTempSuperconductors';
import {HuygensObservatory} from '@/server/cards/pathfinders/HuygensObservatory';
import {HydrogenBombardment} from '@/server/cards/pathfinders/HydrogenBombardment';
import {HydrogenProcessingPlant} from '@/server/cards/pathfinders/HydrogenProcessingPlant';
import {InterplanetaryTransport} from '@/server/cards/pathfinders/InterplanetaryTransport';
import {Kickstarter} from '@/server/cards/pathfinders/Kickstarter';
import {LastResortIngenuity} from '@/server/cards/pathfinders/LastResortIngenuity';
import {LobbyHalls} from '@/server/cards/pathfinders/LobbyHalls';
import {LunarEmbassy} from '@/server/cards/pathfinders/LunarEmbassy';
import {LuxuryEstate} from '@/server/cards/pathfinders/LuxuryEstate';
import {MagneticFieldStimulationDelays} from '@/server/cards/pathfinders/MagneticFieldStimulationDelays';
import {MarsDirect} from '@/server/cards/pathfinders/MarsDirect';
import {MarsMaths} from '@/server/cards/pathfinders/MarsMaths';
import {MartianCulture} from '@/server/cards/pathfinders/MartianCulture';
import {MartianDustProcessingPlant} from '@/server/cards/pathfinders/MartianDustProcessingPlant';
import {MartianInsuranceGroup} from '@/server/cards/pathfinders/MartianInsuranceGroup';
import {MartianMonuments} from '@/server/cards/pathfinders/MartianMonuments';
import {MartianNatureWonders} from '@/server/cards/pathfinders/MartianNatureWonders';
import {MartianRepository} from '@/server/cards/pathfinders/MartianRepository';
import {MicrobiologyPatents} from '@/server/cards/pathfinders/MicrobiologyPatents';
import {MindSetMars} from '@/server/cards/pathfinders/MindSetMars';
import {MuseumofEarlyColonisation} from '@/server/cards/pathfinders/MuseumofEarlyColonisation';
import {NewVenice} from '@/server/cards/pathfinders/NewVenice';
import {NobelLabs} from '@/server/cards/pathfinders/NobelLabs';
import {Odyssey} from '@/server/cards/pathfinders/Odyssey';
import {OrbitalLaboratories} from '@/server/cards/pathfinders/OrbitalLaboratories';
import {OumuamuaTypeObjectSurvey} from '@/server/cards/pathfinders/OumuamuaTypeObjectSurvey';
import {OzoneGenerators} from '@/server/cards/pathfinders/OzoneGenerators';
import {PersonalAgenda} from '@/server/cards/pathfinders/PersonalAgenda';
import {Polaris} from '@/server/cards/pathfinders/Polaris';
import {Pollinators} from '@/server/cards/pathfinders/Pollinators';
import {PowerPlant} from '@/server/cards/pathfinders/PowerPlant';
import {PrefabricationofHumanHabitats} from '@/server/cards/pathfinders/PrefabricationofHumanHabitats';
import {PrivateSecurity} from '@/server/cards/pathfinders/PrivateSecurity';
import {PublicSponsoredGrant} from '@/server/cards/pathfinders/PublicSponsoredGrant';
import {RareEarthElements} from '@/server/cards/pathfinders/RareEarthElements';
import {RedCity} from '@/server/cards/pathfinders/RedCity';
import {ResearchGrant} from '@/server/cards/pathfinders/ResearchGrant';
import {ReturntoAbandonedTechnology} from '@/server/cards/pathfinders/ReturntoAbandonedTechnology';
import {RichDeposits} from '@/server/cards/pathfinders/RichDeposits';
import {Ringcom} from '@/server/cards/pathfinders/Ringcom';
import {RobinHaulings} from '@/server/cards/pathfinders/RobinHaulings';
import {SecretLabs} from '@/server/cards/pathfinders/SecretLabs';
import {SmallComet} from '@/server/cards/pathfinders/SmallComet';
import {SmallOpenPitMine} from '@/server/cards/pathfinders/SmallOpenPitMine';
import {SocialEvents} from '@/server/cards/pathfinders/SocialEvents';
import {SoilDetoxification} from '@/server/cards/pathfinders/SoilDetoxification';
import {Solarpedia} from '@/server/cards/pathfinders/Solarpedia';
import {SolarStorm} from '@/server/cards/pathfinders/SolarStorm';
import {SolBank} from '@/server/cards/pathfinders/SolBank';
import {SoylentSeedlingSystems} from '@/server/cards/pathfinders/SoylentSeedlingSystems';
import {SpaceDebrisCleaningOperation} from '@/server/cards/pathfinders/SpaceDebrisCleaningOperation';
import {SpaceRaceToMars} from '@/server/cards/pathfinders/SpaceRaceToMars';
import {SpaceRelay} from '@/server/cards/pathfinders/SpaceRelay';
import {SpecializedSettlement} from '@/server/cards/pathfinders/SpecializedSettlement';
import {Steelaris} from '@/server/cards/pathfinders/Steelaris';
import {SurveyMission} from '@/server/cards/pathfinders/SurveyMission';
import {TerraformingControlStation} from '@/server/cards/pathfinders/TerraformingControlStation';
import {TerraformingRobots} from '@/server/cards/pathfinders/TerraformingRobots';
import {TheNewSpaceRace} from '@/server/cards/pathfinders/TheNewSpaceRace';
import {ThinkTank} from '@/server/cards/pathfinders/ThinkTank';
import {TiredEarth} from '@/server/cards/pathfinders/TiredEarth';
import {ValuableGases} from '@/server/cards/pathfinders/ValuableGases';
import {VeneraBase} from '@/server/cards/pathfinders/VeneraBase';
import {VenusFirst} from '@/server/cards/pathfinders/VenusFirst';
import {VitalColony} from '@/server/cards/pathfinders/VitalColony';
import {Wetlands} from '@/server/cards/pathfinders/Wetlands';

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
    [CardName.CRASHLANDING]: {Factory: Crashlanding, compatibility: 'ares'},
    [CardName.THINK_TANK]: {Factory: ThinkTank},
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
    [CardName.MARS_MATHS]: {Factory: MarsMaths},
    [CardName.MARS_DIRECT]: {Factory: MarsDirect, compatibility: 'pathfinders'},
    [CardName.MARTIAN_INSURANCE_GROUP]: {Factory: MartianInsuranceGroup, compatibility: 'pathfinders'},
    [CardName.SOLBANK]: {Factory: SolBank},
    [CardName.BIO_SOL]: {Factory: BioSol},
    [CardName.AURORAI]: {Factory: Aurorai, compatibility: 'pathfinders'},
    [CardName.COLLEGIUM_COPERNICUS]: {Factory: CollegiumCopernicus, compatibility: 'colonies'},
    [CardName.ROBIN_HAULINGS]: {Factory: RobinHaulings, compatibility: ['venus', 'pathfinders']},
    [CardName.ODYSSEY]: {Factory: Odyssey},
    [CardName.GAGARIN_MOBILE_BASE]: {Factory: GagarinMobileBase},
    // Broken. #7519
    // [CardName.MARS_FRONTIER_ALLIANCE]: {Factory: MarsFrontierAlliance, compatibility: 'turmoil'},
    [CardName.MIND_SET_MARS]: {Factory: MindSetMars, compatibility: 'turmoil'},
    [CardName.HABITAT_MARTE]: {Factory: HabitatMarte, compatibility: 'pathfinders'},
    [CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS]: {Factory: AdhaiHighOrbitConstructions, compatibility: 'colonies'},
  },
  preludeCards: {
    [CardName.VENUS_FIRST]: {Factory: VenusFirst, compatibility: 'venus'},
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
    [CardName.DEEP_SPACE_OPERATIONS]: {Factory: DeepSpaceOperations},
    [CardName.EXPERIENCED_MARTIANS]: {Factory: ExperiencedMartians, compatibility: ['turmoil', 'pathfinders']},
    [CardName.THE_NEW_SPACE_RACE]: {Factory: TheNewSpaceRace, compatibility: 'turmoil'},
  },

  globalEvents: {
    [GlobalEventName.BALANCED_DEVELOPMENT]: {Factory: BalancedDevelopment},
    [GlobalEventName.SPACE_RACE_TO_MARS]: {Factory: SpaceRaceToMars},
    [GlobalEventName.CONSTANT_STRUGGLE]: {Factory: ConstantStruggle, negative: true},
    [GlobalEventName.TIRED_EARTH]: {Factory: TiredEarth, negative: true},
    [GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS]: {Factory: MagneticFieldStimulationDelays, negative: true},
    [GlobalEventName.COMMUNICATION_BOOM]: {Factory: CommunicationBoom, negative: true},
  },

  // Perhaps these community cards should just move to this manifest, but only if it becomes
  // generally easier to just add all the preludes that match what game someone's playing.
  cardsToRemove: [
    CardName.RESEARCH_GRANT,
    CardName.VALUABLE_GASES,
  ],
});

