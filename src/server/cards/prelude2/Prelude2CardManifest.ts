import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {AppliedScience} from '@/server/cards/prelude2/AppliedScience';
import {AtmosphericEnhancers} from '@/server/cards/prelude2/AtmosphericEnhancers';
import {BoardOfDirectors} from '@/server/cards/prelude2/BoardOfDirectors';
import {CeresTechMarket} from '@/server/cards/prelude2/CeresTechMarket';
import {CloudTourism} from '@/server/cards/prelude2/CloudTourism';
import {ColonialEnvoys} from '@/server/cards/prelude2/ColonialEnvoys';
import {ColonialRepresentation} from '@/server/cards/prelude2/ColonialRepresentation';
import {ColonyTradeHub} from '@/server/cards/prelude2/ColonyTradeHub';
import {CorridorsOfPower} from '@/server/cards/prelude2/CorridorsOfPower';
import {EarlyColonization} from '@/server/cards/prelude2/EarlyColonization';
import {Ecotec} from '@/server/cards/prelude2/Ecotec';
import {EnvoysFromVenus} from '@/server/cards/prelude2/EnvoysFromVenus';
import {FloatingRefinery} from '@/server/cards/prelude2/FloatingRefinery';
import {FloatingTradeHub} from '@/server/cards/prelude2/FloatingTradeHub';
import {FocusedOrganization} from '@/server/cards/prelude2/FocusedOrganization';
import {FrontierTown} from '@/server/cards/prelude2/FrontierTown';
import {GhgShipment} from '@/server/cards/prelude2/GhgShipment';
import {HighCircles} from '@/server/cards/prelude2/HighCircles';
import {IndustrialComplex} from '@/server/cards/prelude2/IndustrialComplex';
import {IshtarExpedition} from '@/server/cards/prelude2/IshtarExpedition';
import {JovianEnvoys} from '@/server/cards/prelude2/JovianEnvoys';
import {L1TradeTerminal} from '@/server/cards/prelude2/L1TradeTerminal';
import {MainBeltAsteroids} from '@/server/cards/prelude2/MainBeltAsteroids';
import {MicrogravityNutrition} from '@/server/cards/prelude2/MicrogravityNutrition';
import {NirgalEnterprises} from '@/server/cards/prelude2/NirgalEnterprises';
import {NobelPrize} from '@/server/cards/prelude2/NobelPrize';
import {OldMiningColony} from '@/server/cards/prelude2/OldMiningColony';
import {PalladinShipping} from '@/server/cards/prelude2/PalladinShipping';
import {PlanetaryAlliance} from '@/server/cards/prelude2/PlanetaryAlliance';
import {PreservationProgram} from '@/server/cards/prelude2/PreservationProgram';
import {ProjectEden} from '@/server/cards/prelude2/ProjectEden';
import {Recession} from '@/server/cards/prelude2/Recession';
import {RedAppeasement} from '@/server/cards/prelude2/RedAppeasement';
import {RiseToPower} from '@/server/cards/prelude2/RiseToPower';
import {SagittaFrontierServices} from '@/server/cards/prelude2/SagittaFrontierServices';
import {SoilBacteria} from '@/server/cards/prelude2/SoilBacteria';
import {SoilStudies} from '@/server/cards/prelude2/SoilStudies';
import {SpaceLanes} from '@/server/cards/prelude2/SpaceLanes';
import {SpecialPermit} from '@/server/cards/prelude2/SpecialPermit';
import {Spire} from '@/server/cards/prelude2/Spire';
import {SponsoringNation} from '@/server/cards/prelude2/SponsoringNation';
import {StratosphericExpedition} from '@/server/cards/prelude2/StratosphericExpedition';
import {SummitLogistics} from '@/server/cards/prelude2/SummitLogistics';
import {TerraformingDeal} from '@/server/cards/prelude2/TerraformingDeal';
import {UnexpectedApplication} from '@/server/cards/prelude2/UnexpectedApplication';
import {VenusAllies} from '@/server/cards/prelude2/VenusAllies';
import {VenusContract} from '@/server/cards/prelude2/VenusContract';
import {VenusL1Shade} from '@/server/cards/prelude2/VenusL1Shade';
import {VenusOrbitalSurvey} from '@/server/cards/prelude2/VenusOrbitalSurvey';
import {VenusShuttles} from '@/server/cards/prelude2/VenusShuttles';
import {VenusTradeHub} from '@/server/cards/prelude2/VenusTradeHub';
import {WGProject} from '@/server/cards/prelude2/WGProject';
import {WorldGovernmentAdvisor} from '@/server/cards/prelude2/WorldGovernmentAdvisor';

export const PRELUDE2_CARD_MANIFEST = new ModuleManifest({
  module: 'prelude2',
  projectCards: {
    [CardName.ISHTAR_EXPEDITION]: {Factory: IshtarExpedition, compatibility: 'venus'},
    [CardName.SUMMIT_LOGISTICS]: {Factory: SummitLogistics, compatibility: 'turmoil'},
    [CardName.CERES_TECH_MARKET]: {Factory: CeresTechMarket, compatibility: 'colonies'},
    [CardName.RED_APPEASEMENT]: {Factory: RedAppeasement, compatibility: 'turmoil'},
    [CardName.L1_TRADE_TERMINAL]: {Factory: L1TradeTerminal, compatibility: 'colonies'},
    [CardName.CLOUD_TOURISM]: {Factory: CloudTourism, compatibility: 'venus'},
    [CardName.GHG_SHIPMENT]: {Factory: GhgShipment, compatibility: 'turmoil'},
    [CardName.SPONSORING_NATION]: {Factory: SponsoringNation, compatibility: 'turmoil'},
    [CardName.COLONIAL_REPRESENTATION]: {Factory: ColonialRepresentation, compatibility: ['colonies', 'turmoil']},
    [CardName.ENVOYS_FROM_VENUS]: {Factory: EnvoysFromVenus, compatibility: ['turmoil', 'venus']},
    [CardName.COLONIAL_ENVOYS]: {Factory: ColonialEnvoys, compatibility: ['colonies', 'turmoil']},
    [CardName.SPECIAL_PERMIT]: {Factory: SpecialPermit, compatibility: 'turmoil'},
    [CardName.FLOATING_REFINERY]: {Factory: FloatingRefinery, compatibility: 'venus'},
    [CardName.FRONTIER_TOWN]: {Factory: FrontierTown, compatibility: 'turmoil'},
    [CardName.JOVIAN_ENVOYS]: {Factory: JovianEnvoys, compatibility: 'turmoil'},
    [CardName.MICROGRAVITY_NUTRITION]: {Factory: MicrogravityNutrition, compatibility: 'colonies'},
    [CardName.SOIL_STUDIES]: {Factory: SoilStudies, compatibility: ['venus', 'colonies']},
    [CardName.STRATOSPHERIC_EXPEDITION]: {Factory: StratosphericExpedition, compatibility: 'venus'},
    [CardName.UNEXPECTED_APPLICATION]: {Factory: UnexpectedApplication, compatibility: 'venus'},
    [CardName.VENUS_ALLIES]: {Factory: VenusAllies, compatibility: ['venus', 'colonies']},
    [CardName.VENUS_ORBITAL_SURVEY]: {Factory: VenusOrbitalSurvey, compatibility: 'venus'},
    [CardName.VENUS_SHUTTLES]: {Factory: VenusShuttles, compatibility: 'venus'},
    [CardName.VENUS_TRADE_HUB]: {Factory: VenusTradeHub, compatibility: ['colonies', 'venus']},
    [CardName.WG_PROJECT]: {Factory: WGProject, compatibility: 'turmoil'},
  },

  preludeCards: {
    [CardName.APPLIED_SCIENCE]: {Factory: AppliedScience},
    [CardName.ATMOSPHERIC_ENHANCERS]: {Factory: AtmosphericEnhancers, compatibility: 'venus'},
    [CardName.BOARD_OF_DIRECTORS]: {Factory: BoardOfDirectors},
    [CardName.COLONY_TRADE_HUB]: {Factory: ColonyTradeHub, compatibility: 'colonies'},
    [CardName.CORRIDORS_OF_POWER]: {Factory: CorridorsOfPower, compatibility: 'turmoil'},
    [CardName.EARLY_COLONIZATION]: {Factory: EarlyColonization, compatibility: 'colonies'},
    [CardName.FLOATING_TRADE_HUB]: {Factory: FloatingTradeHub, compatibility: 'venus'},
    [CardName.FOCUSED_ORGANIZATION]: {Factory: FocusedOrganization},
    [CardName.HIGH_CIRCLES]: {Factory: HighCircles, compatibility: 'turmoil'},
    [CardName.INDUSTRIAL_COMPLEX]: {Factory: IndustrialComplex},
    [CardName.MAIN_BELT_ASTEROIDS]: {Factory: MainBeltAsteroids},
    [CardName.NOBEL_PRIZE]: {Factory: NobelPrize},
    [CardName.OLD_MINING_COLONY]: {Factory: OldMiningColony, compatibility: 'colonies'},
    [CardName.PLANETARY_ALLIANCE]: {Factory: PlanetaryAlliance, compatibility: 'venus'},
    [CardName.PRESERVATION_PROGRAM]: {Factory: PreservationProgram},
    [CardName.PROJECT_EDEN]: {Factory: ProjectEden},
    [CardName.RECESSION]: {Factory: Recession},
    [CardName.RISE_TO_POWER]: {Factory: RiseToPower, compatibility: 'turmoil'},
    [CardName.SOIL_BACTERIA]: {Factory: SoilBacteria},
    [CardName.SPACE_LANES]: {Factory: SpaceLanes},
    // Broken, #7610
    // [CardName.SUITABLE_INFRASTRUCTURE]: {Factory: SuitableInfrastructure},
    [CardName.TERRAFORMING_DEAL]: {Factory: TerraformingDeal},
    [CardName.VENUS_CONTRACT]: {Factory: VenusContract, compatibility: 'venus'},
    [CardName.VENUS_L1_SHADE]: {Factory: VenusL1Shade, compatibility: 'venus'},
    [CardName.WORLD_GOVERNMENT_ADVISOR]: {Factory: WorldGovernmentAdvisor},
  },

  corporationCards: {
    [CardName.NIRGAL_ENTERPRISES]: {Factory: NirgalEnterprises},
    [CardName.PALLADIN_SHIPPING]: {Factory: PalladinShipping},
    [CardName.SAGITTA_FRONTIER_SERVICES]: {Factory: SagittaFrontierServices},
    [CardName.ECOTEC]: {Factory: Ecotec},
    [CardName.SPIRE]: {Factory: Spire},
  },
});
