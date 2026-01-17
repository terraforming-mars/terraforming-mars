import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {AIControlledMineNetwork} from '@/server/cards/moon/AIControlledMineNetwork';
import {AlgaeBioreactors} from '@/server/cards/moon/AlgaeBioreactors';
import {AncientShipyards} from '@/server/cards/moon/AncientShipyards';
import {AnOfferYouCantRefuse} from '@/server/cards/moon/AnOfferYouCantRefuse';
import {ArchimedesHydroponicsStation} from '@/server/cards/moon/ArchimedesHydroponicsStation';
import {AristarchusRoadNetwork} from '@/server/cards/moon/AristarchusRoadNetwork';
import {BasicInfrastructure} from '@/server/cards/moon/BasicInfrastructure';
import {ColonistShuttles} from '@/server/cards/moon/ColonistShuttles';
import {CopernicusSolarArrays} from '@/server/cards/moon/CopernicusSolarArrays';
import {CopernicusTower} from '@/server/cards/moon/CopernicusTower';
import {CoreMine} from '@/server/cards/moon/CoreMine';
import {CosmicRadiation} from '@/server/cards/moon/CosmicRadiation';
import {CrescentResearchAssociation} from '@/server/cards/moon/CrescentResearchAssociation';
import {DarksideIncubationPlant} from '@/server/cards/moon/DarksideIncubationPlant';
import {DarksideMeteorBombardment} from '@/server/cards/moon/DarksideMeteorBombardment';
import {DarksideMiningSyndicate} from '@/server/cards/moon/DarksideMiningSyndicate';
import {DarksideObservatory} from '@/server/cards/moon/DarksideObservatory';
import {DarksideSmugglersUnion} from '@/server/cards/moon/DarksideSmugglersUnion';
import {DeepLunarMining} from '@/server/cards/moon/DeepLunarMining';
import {EarthEmbassy} from '@/server/cards/moon/EarthEmbassy';
import {FirstLunarSettlement} from '@/server/cards/moon/FirstLunarSettlement';
import {GeodesicTents} from '@/server/cards/moon/GeodesicTents';
import {GrandLunaAcademy} from '@/server/cards/moon/GrandLunaAcademy';
import {Habitat14} from '@/server/cards/moon/Habitat14';
import {HE3FusionPlant} from '@/server/cards/moon/HE3FusionPlant';
import {HE3Lobbyists} from '@/server/cards/moon/HE3Lobbyists';
import {HE3ProductionQuotas} from '@/server/cards/moon/HE3ProductionQuotas';
import {HE3Refinery} from '@/server/cards/moon/HE3Refinery';
import {HeavyDutyRovers} from '@/server/cards/moon/HeavyDutyRovers';
import {HeliostatMirrorArray} from '@/server/cards/moon/HeliostatMirrorArray';
import {HostileTakeover} from '@/server/cards/moon/HostileTakeover';
import {HypersensitiveSiliconChipFactory} from '@/server/cards/moon/HypersensitiveSiliconChipFactory';
import {ImprovedMoonConcrete} from '@/server/cards/moon/ImprovedMoonConcrete';
import {IntragenSanctuaryHeadquarters} from '@/server/cards/moon/IntragenSanctuaryHeadquarters';
import {IronExtractionCenter} from '@/server/cards/moon/IronExtractionCenter';
import {LTFHeadquarters} from '@/server/cards/moon/LTFHeadquarters';
import {LTFPrivileges} from '@/server/cards/moon/LTFPrivileges';
import {LunaArchives} from '@/server/cards/moon/LunaArchives';
import {LunaConference} from '@/server/cards/moon/LunaConference';
import {LunaEcumenopolis} from '@/server/cards/moon/LunaEcumenopolis';
import {LunaFirstIncorporated} from '@/server/cards/moon/LunaFirstIncorporated';
import {LunaHyperloopCorporation} from '@/server/cards/moon/LunaHyperloopCorporation';
import {LunaMiningHub} from '@/server/cards/moon/LunaMiningHub';
import {LunaPoliticalInstitute} from '@/server/cards/moon/LunaPoliticalInstitute';
import {LunaProjectOffice} from '@/server/cards/moon/LunaProjectOffice';
import {LunarDustProcessingPlant} from '@/server/cards/moon/LunarDustProcessingPlant';
import {LunaResort} from '@/server/cards/moon/LunaResort';
// import {LunarIndependenceWar} from '@/server/cards/moon/LunarIndependenceWar';
import {LunarIndustryComplex} from '@/server/cards/moon/LunarIndustryComplex';
import {LunarMineUrbanization} from '@/server/cards/moon/LunarMineUrbanization';
import {LunarObservationPost} from '@/server/cards/moon/LunarObservationPost';
import {LunarPlanningOffice} from '@/server/cards/moon/LunarPlanningOffice';
import {LunarSecurityStations} from '@/server/cards/moon/LunarSecurityStations';
import {LunarSteel} from '@/server/cards/moon/LunarSteel';
import {LunarTradeFleet} from '@/server/cards/moon/LunarTradeFleet';
import {LunaSenate} from '@/server/cards/moon/LunaSenate';
import {LunaStagingStation} from '@/server/cards/moon/LunaStagingStation';
import {LunaTradeStation} from '@/server/cards/moon/LunaTradeStation';
import {LunaTrainStation} from '@/server/cards/moon/LunaTrainStation';
import {LunaTradeFederation} from '@/server/cards/moon/LunaTradeFederation';
import {MareImbriumMine} from '@/server/cards/moon/MareImbriumMine';
import {MareNectarisMine} from '@/server/cards/moon/MareNectarisMine';
import {MareNubiumMine} from '@/server/cards/moon/MareNubiumMine';
import {MareSerenitatisMine} from '@/server/cards/moon/MareSerenitatisMine';
import {MartianEmbassy} from '@/server/cards/moon/MartianEmbassy';
import {MicrosingularityPlant} from '@/server/cards/moon/MicrosingularityPlant';
import {MiningComplex} from '@/server/cards/moon/MiningComplex';
import {MiningRobotsManufCenter} from '@/server/cards/moon/MiningRobotsManufCenter';
import {MomentumViriumHabitat} from '@/server/cards/moon/MomentumViriumHabitat';
import {MoonHabitatStandardProject} from '@/server/cards/moon/MoonHabitatStandardProject';
import {MoonHabitatStandardProjectVariant1, MoonMineStandardProjectVariant1, MoonRoadStandardProjectVariant1} from '@/server/cards/moon/MoonStandardProjectVariants1';
import {MoonHabitatStandardProjectVariant2, MoonMineStandardProjectVariant2, MoonRoadStandardProjectVariant2} from '@/server/cards/moon/MoonStandardProjectVariants2';
import {MooncrateBlockFactory} from '@/server/cards/moon/MooncrateBlockFactory';
import {MooncrateConvoysToMars} from '@/server/cards/moon/MooncrateConvoysToMars';
import {MoonMineStandardProject} from '@/server/cards/moon/MoonMineStandardProject';
import {MoonRoadStandardProject} from '@/server/cards/moon/MoonRoadStandardProject';
import {MoonTether} from '@/server/cards/moon/MoonTether';
import {NanotechIndustries} from '@/server/cards/moon/NanotechIndustries';
import {NewColonyPlanningInitiatives} from '@/server/cards/moon/NewColonyPlanningInitiatives';
import {OffWorldCityLiving} from '@/server/cards/moon/OffWorldCityLiving';
import {PreliminaryDarkside} from '@/server/cards/moon/PreliminaryDarkside';
import {OrbitalPowerGrid} from '@/server/cards/moon/OrbitalPowerGrid';
import {PrideoftheEarthArkship} from '@/server/cards/moon/PrideoftheEarthArkship';
import {ProcessorFactory} from '@/server/cards/moon/ProcessorFactory';
import {RevoltingColonists} from '@/server/cards/moon/RevoltingColonists';
import {RoadPiracy} from '@/server/cards/moon/RoadPiracy';
import {RoverDriversUnion} from '@/server/cards/moon/RoverDriversUnion';
import {RustEatingBacteria} from '@/server/cards/moon/RustEatingBacteria';
import {SinusIrdiumRoadNetwork} from '@/server/cards/moon/SinusIrdiumRoadNetwork';
import {SmallDutyRovers} from '@/server/cards/moon/SmallDutyRovers';
import {SolarPanelFoundry} from '@/server/cards/moon/SolarPanelFoundry';
import {SphereHabitats} from '@/server/cards/moon/SphereHabitats';
import {StagingStationBehemoth} from '@/server/cards/moon/StagingStationBehemoth';
import {SteelMarketMonopolists} from '@/server/cards/moon/SteelMarketMonopolists';
import {SubterraneanHabitats} from '@/server/cards/moon/SubterraneanHabitats';
import {SyndicatePirateRaids} from '@/server/cards/moon/SyndicatePirateRaids';
import {TempestConsultancy} from '@/server/cards/moon/TempestConsultancy';
import {TheArchaicFoundationInstitute} from '@/server/cards/moon/TheArchaicFoundationInstitute';
import {TheDarksideofTheMoonSyndicate} from '@/server/cards/moon/TheDarksideofTheMoonSyndicate';
import {TheGrandLunaCapitalGroup} from '@/server/cards/moon/TheGrandLunaCapitalGroup';
import {TheWomb} from '@/server/cards/moon/TheWomb';
import {ThoriumRush} from '@/server/cards/moon/ThoriumRush';
import {TitaniumExtractionCenter} from '@/server/cards/moon/TitaniumExtractionCenter';
import {TitaniumMarketMonopolists} from '@/server/cards/moon/TitaniumMarketMonopolists';
import {TychoRoadNetwork} from '@/server/cards/moon/TychoRoadNetwork';
import {UndergroundDetonators} from '@/server/cards/moon/UndergroundDetonators';
import {UndermoonDrugLordsNetwork} from '@/server/cards/moon/UndermoonDrugLordsNetwork';
import {WaterTreatmentComplex} from '@/server/cards/moon/WaterTreatmentComplex';
import {WeGrowAsOne} from '@/server/cards/moon/WeGrowAsOne';

export const MOON_CARD_MANIFEST = new ModuleManifest({
  module: 'moon',
  projectCards: {
    [CardName.MARE_NECTARIS_MINE]: {Factory: MareNectarisMine},
    [CardName.MARE_NUBIUM_MINE]: {Factory: MareNubiumMine},
    [CardName.MARE_IMBRIUM_MINE]: {Factory: MareImbriumMine},
    [CardName.MARE_SERENITATIS_MINE]: {Factory: MareSerenitatisMine},
    [CardName.HABITAT_14]: {Factory: Habitat14},
    [CardName.GEODESIC_TENTS]: {Factory: GeodesicTents},
    [CardName.SPHERE_HABITATS]: {Factory: SphereHabitats},
    [CardName.THE_WOMB]: {Factory: TheWomb},
    [CardName.TYCHO_ROAD_NETWORK]: {Factory: TychoRoadNetwork},
    [CardName.ARISTARCHUS_ROAD_NETWORK]: {Factory: AristarchusRoadNetwork},
    [CardName.SINUS_IRDIUM_ROAD_NETWORK]: {Factory: SinusIrdiumRoadNetwork},
    [CardName.MOMENTUM_VIRUM_HABITAT]: {Factory: MomentumViriumHabitat},
    [CardName.LUNA_TRADE_STATION]: {Factory: LunaTradeStation},
    [CardName.LUNA_MINING_HUB]: {Factory: LunaMiningHub},
    [CardName.LUNA_TRAIN_STATION]: {Factory: LunaTrainStation},
    [CardName.COLONIST_SHUTTLES]: {Factory: ColonistShuttles},
    [CardName.LUNAR_DUST_PROCESSING_PLANT]: {Factory: LunarDustProcessingPlant},
    [CardName.DEEP_LUNAR_MINING]: {Factory: DeepLunarMining},
    [CardName.ANCIENT_SHIPYARDS]: {Factory: AncientShipyards},
    [CardName.LUNA_PROJECT_OFFICE]: {Factory: LunaProjectOffice},
    [CardName.LUNA_RESORT]: {Factory: LunaResort},
    [CardName.LUNAR_OBSERVATION_POST]: {Factory: LunarObservationPost},
    [CardName.MINING_ROBOTS_MANUF_CENTER]: {Factory: MiningRobotsManufCenter},
    [CardName.PRIDE_OF_THE_EARTH_ARKSHIP]: {Factory: PrideoftheEarthArkship},
    [CardName.IRON_EXTRACTION_CENTER]: {Factory: IronExtractionCenter},
    [CardName.TITANIUM_EXTRACTION_CENTER]: {Factory: TitaniumExtractionCenter},
    [CardName.ARCHIMEDES_HYDROPONICS_STATION]: {Factory: ArchimedesHydroponicsStation},
    [CardName.STEEL_MARKET_MONOPOLISTS]: {Factory: SteelMarketMonopolists},
    [CardName.TITANIUM_MARKET_MONOPOLISTS]: {Factory: TitaniumMarketMonopolists},
    [CardName.LUNA_STAGING_STATION]: {Factory: LunaStagingStation},
    [CardName.NEW_COLONY_PLANNING_INITIAITIVES]: {Factory: NewColonyPlanningInitiatives},
    [CardName.AI_CONTROLLED_MINE_NETWORK]: {Factory: AIControlledMineNetwork},
    [CardName.DARKSIDE_METEOR_BOMBARDMENT]: {Factory: DarksideMeteorBombardment},
    [CardName.UNDERGROUND_DETONATORS]: {Factory: UndergroundDetonators},
    [CardName.LUNAR_TRADE_FLEET]: {Factory: LunarTradeFleet},
    [CardName.SUBTERRANEAN_HABITATS]: {Factory: SubterraneanHabitats},
    [CardName.IMPROVED_MOON_CONCRETE]: {Factory: ImprovedMoonConcrete},
    [CardName.MOONCRATE_BLOCK_FACTORY]: {Factory: MooncrateBlockFactory},
    [CardName.HEAVY_DUTY_ROVERS]: {Factory: HeavyDutyRovers},
    [CardName.MICROSINGULARITY_PLANT]: {Factory: MicrosingularityPlant},
    [CardName.HELIOSTAT_MIRROR_ARRAY]: {Factory: HeliostatMirrorArray},
    [CardName.LUNAR_SECURITY_STATIONS]: {Factory: LunarSecurityStations},
    [CardName.HYPERSENSITIVE_SILICON_CHIP_FACTORY]: {Factory: HypersensitiveSiliconChipFactory},
    [CardName.COPERNICUS_SOLAR_ARRAYS]: {Factory: CopernicusSolarArrays},
    [CardName.DARKSIDE_INCUBATION_PLANT]: {Factory: DarksideIncubationPlant},
    [CardName.WATER_TREATMENT_COMPLEX]: {Factory: WaterTreatmentComplex},
    [CardName.ALGAE_BIOREACTORS]: {Factory: AlgaeBioreactors},
    [CardName.HE3_FUSION_PLANT]: {Factory: HE3FusionPlant},
    [CardName.HE3_REFINERY]: {Factory: HE3Refinery},
    [CardName.HE3_LOBBYISTS]: {Factory: HE3Lobbyists},
    //   // Start of second pack.
    [CardName.REVOLTING_COLONISTS]: {Factory: RevoltingColonists},
    [CardName.COSMIC_RADIATION]: {Factory: CosmicRadiation},
    [CardName.OFF_WORLD_CITY_LIVING]: {Factory: OffWorldCityLiving},
    [CardName.ROAD_PIRACY]: {Factory: RoadPiracy},
    [CardName.LUNAR_MINE_URBANIZATION]: {Factory: LunarMineUrbanization},
    [CardName.THORIUM_RUSH]: {Factory: ThoriumRush},
    [CardName.HE3_PRODUCTION_QUOTAS]: {Factory: HE3ProductionQuotas, compatibility: 'turmoil'},
    [CardName.LUNA_CONFERENCE]: {Factory: LunaConference, compatibility: 'turmoil'},
    [CardName.WE_GROW_AS_ONE]: {Factory: WeGrowAsOne, compatibility: ['turmoil', 'colonies']},
    [CardName.MOONCRATE_CONVOYS_TO_MARS]: {Factory: MooncrateConvoysToMars, compatibility: ['turmoil']},
    // // [CardName.LUNAR_INDEPENDENCE_WAR]: {Factory: LunarIndependenceWar},
    [CardName.AN_OFFER_YOU_CANT_REFUSE]: {Factory: AnOfferYouCantRefuse, compatibility: 'turmoil'},
    [CardName.PRELIMINARY_DARKSIDE]: {Factory: PreliminaryDarkside},
    [CardName.HOSTILE_TAKEOVER]: {Factory: HostileTakeover},
    [CardName.SYNDICATE_PIRATE_RAIDS]: {Factory: SyndicatePirateRaids, compatibility: 'colonies'},
    [CardName.DARKSIDE_MINING_SYNDICATE]: {Factory: DarksideMiningSyndicate},
    //   // [CardName.HE3_PROPULSION]: {Factory: HE3Propulsion, compatibility: 'colonies'},
    [CardName.STAGING_STATION_BEHEMOTH]: {Factory: StagingStationBehemoth, compatibility: 'colonies'},
    [CardName.LUNA_ARCHIVES]: {Factory: LunaArchives},
    [CardName.LUNA_SENATE]: {Factory: LunaSenate},
    [CardName.LUNA_POLITICAL_INSTITUTE]: {Factory: LunaPoliticalInstitute, compatibility: 'turmoil'},
    [CardName.COPERNICUS_TOWER]: {Factory: CopernicusTower},
    [CardName.SMALL_DUTY_ROVERS]: {Factory: SmallDutyRovers},
    [CardName.LUNAR_INDUSTRY_COMPLEX]: {Factory: LunarIndustryComplex},
    [CardName.DARKSIDE_OBSERVATORY]: {Factory: DarksideObservatory},
    [CardName.MARTIAN_EMBASSY]: {Factory: MartianEmbassy, compatibility: 'pathfinders'},
    [CardName.EARTH_EMBASSY]: {Factory: EarthEmbassy},
    [CardName.ROVER_DRIVERS_UNION]: {Factory: RoverDriversUnion},
    [CardName.LTF_HEADQUARTERS]: {Factory: LTFHeadquarters, compatibility: 'colonies'},
    [CardName.DARKSIDE_SMUGGLERS_UNION]: {Factory: DarksideSmugglersUnion, compatibility: 'colonies'},
    [CardName.UNDERMOON_DRUG_LORDS_NETWORK]: {Factory: UndermoonDrugLordsNetwork},
    [CardName.LTF_PRIVILEGES]: {Factory: LTFPrivileges},
    [CardName.GRAND_LUNA_ACADEMY]: {Factory: GrandLunaAcademy},
    [CardName.LUNA_ECUMENOPOLIS]: {Factory: LunaEcumenopolis},
    [CardName.ORBITAL_POWER_GRID]: {Factory: OrbitalPowerGrid},
    [CardName.PROCESSOR_FACTORY]: {Factory: ProcessorFactory},
    [CardName.LUNAR_STEEL]: {Factory: LunarSteel},
    [CardName.RUST_EATING_BACTERIA]: {Factory: RustEatingBacteria},
    [CardName.SOLAR_PANEL_FOUNDRY]: {Factory: SolarPanelFoundry},
    [CardName.MOON_TETHER]: {Factory: MoonTether},
  },
  corporationCards: {
    [CardName.NANOTECH_INDUSTRIES]: {Factory: NanotechIndustries, compatibility: 'moon'},
    [CardName.TEMPEST_CONSULTANCY]: {Factory: TempestConsultancy, compatibility: ['turmoil', 'moon']},
    [CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE]: {Factory: TheDarksideofTheMoonSyndicate, compatibility: 'moon'},
    [CardName.LUNA_HYPERLOOP_CORPORATION]: {Factory: LunaHyperloopCorporation, compatibility: 'moon'},
    [CardName.CRESCENT_RESEARCH_ASSOCIATION]: {Factory: CrescentResearchAssociation, compatibility: 'moon'},
    [CardName.LUNA_FIRST_INCORPORATED]: {Factory: LunaFirstIncorporated, compatibility: 'moon'},
    [CardName.THE_GRAND_LUNA_CAPITAL_GROUP]: {Factory: TheGrandLunaCapitalGroup, compatibility: 'moon'},
    [CardName.INTRAGEN_SANCTUARY_HEADQUARTERS]: {Factory: IntragenSanctuaryHeadquarters, compatibility: 'moon'},
    [CardName.LUNA_TRADE_FEDERATION]: {Factory: LunaTradeFederation, compatibility: 'moon'},
    [CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE]: {Factory: TheArchaicFoundationInstitute, compatibility: 'moon'},
  },
  standardProjects: {
    [CardName.MOON_HABITAT_STANDARD_PROJECT]: {Factory: MoonHabitatStandardProject},
    [CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_1]: {Factory: MoonHabitatStandardProjectVariant1},
    [CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_2]: {Factory: MoonHabitatStandardProjectVariant2},
    [CardName.MOON_MINE_STANDARD_PROJECT]: {Factory: MoonMineStandardProject},
    [CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_1]: {Factory: MoonMineStandardProjectVariant1},
    [CardName.MOON_MINE_STANDARD_PROJECT_VARIANT_2]: {Factory: MoonMineStandardProjectVariant2},
    [CardName.MOON_ROAD_STANDARD_PROJECT]: {Factory: MoonRoadStandardProject},
    [CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_1]: {Factory: MoonRoadStandardProjectVariant1},
    [CardName.MOON_ROAD_STANDARD_PROJECT_VARIANT_2]: {Factory: MoonRoadStandardProjectVariant2},
  },
  preludeCards: {
    [CardName.FIRST_LUNAR_SETTLEMENT]: {Factory: FirstLunarSettlement, compatibility: 'moon'},
    [CardName.CORE_MINE]: {Factory: CoreMine, compatibility: 'moon'},
    [CardName.BASIC_INFRASTRUCTURE]: {Factory: BasicInfrastructure, compatibility: ['moon', 'colonies']},
    [CardName.LUNAR_PlANNING_OFFICE]: {Factory: LunarPlanningOffice, compatibility: 'moon'},
    [CardName.MINING_COMPLEX]: {Factory: MiningComplex, compatibility: 'moon'},
  },
});
