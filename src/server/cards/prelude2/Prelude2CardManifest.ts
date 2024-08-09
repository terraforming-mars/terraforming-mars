import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AppliedScience} from './AppliedScience';
import {AtmosphericEnhancers} from './AtmosphericEnhancers';
import {BoardOfDirectors} from './BoardOfDirectors';
import {CeresTechMarket} from './CeresTechMarket';
import {CloudTourism} from './CloudTourism';
import {ColonialEnvoys} from './ColonialEnvoys';
import {ColonialRepresentation} from './ColonialRepresentation';
import {ColonyTradeHub} from './ColonyTradeHub';
import {CorridorsOfPower} from './CorridorsOfPower';
import {EarlyColonization} from './EarlyColonization';
import {Ecotec} from './Ecotec';
import {EnvoysFromVenus} from './EnvoysFromVenus';
import {FloatingRefinery} from './FloatingRefinery';
import {FloatingTradeHub} from './FloatingTradeHub';
import {FocusedOrganization} from './FocusedOrganization';
import {FrontierTown} from './FrontierTown';
import {GhgShipment} from './GhgShipment';
import {HighCircles} from './HighCircles';
import {IndustrialComplex} from './IndustrialComplex';
import {IshtarExpedition} from './IshtarExpedition';
import {JovianEnvoys} from './JovianEnvoys';
import {L1TradeTerminal} from './L1TradeTerminal';
import {MainBeltAsteroids} from './MainBeltAsteroids';
import {MicrogravityNutrition} from './MicrogravityNutrition';
import {NirgalEnterprises} from './NirgalEnterprises';
import {NobelPrize} from './NobelPrize';
import {OldMiningColony} from './OldMiningColony';
import {PalladinShipping} from './PalladinShipping';
import {PlanetaryAlliance} from './PlanetaryAlliance';
import {PreservationProgram} from './PreservationProgram';
import {ProjectEden} from './ProjectEden';
import {Recession} from './Recession';
import {RedAppeasement} from './RedAppeasement';
import {RiseToPower} from './RiseToPower';
import {SagittaFrontierServices} from './SagittaFrontierServices';
import {SoilBacteria} from './SoilBacteria';
import {SoilStudies} from './SoilStudies';
import {SpaceLanes} from './SpaceLanes';
import {SpecialPermit} from './SpecialPermit';
import {Spire} from './Spire';
import {SponsoringNation} from './SponsoringNation';
import {StratosphericExpedition} from './StratosphericExpedition';
import {SuitableInfrastructure} from './SuitableInfrastructure';
import {SummitLogistics} from './SummitLogistics';
import {TerraformingDeal} from './TerraformingDeal';
import {UnexpectedApplication} from './UnexpectedApplication';
import {VenusAllies} from './VenusAllies';
import {VenusContract} from './VenusContract';
import {VenusL1Shade} from './VenusL1Shade';
import {VenusOrbitalSurvey} from './VenusOrbitalSurvey';
import {VenusShuttles} from './VenusShuttles';
import {VenusTradeHub} from './VenusTradeHub';
import {WGProject} from './WGProject';
import {WorldGovernmentAdvisor} from './WorldGovernmentAdvisor';

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
    [CardName.SUITABLE_INFRASTRUCTURE]: {Factory: SuitableInfrastructure},
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
