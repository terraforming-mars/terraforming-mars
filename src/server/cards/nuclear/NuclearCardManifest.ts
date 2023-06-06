import {ModuleManifest} from '../ModuleManifest';
import {CardName} from '../../../common/cards/CardName';

import {Caracals} from './Caracals';
import {CentralDockingStation} from './CentralDockingStation';
import {Chemtrails} from './Chemtrails';
import {GenomicsNucleationCenter} from './GenomicsNucleationCenter';
import {InfraredTherapy} from './InfraredTherapy';
import { NeonJellyfish } from './NeonJellyfish';
import { NeutrondCity } from './NeutronCity';
import { NitrateCombustion } from './NitrateCombustion';
import { OxygenGarden } from './OxygenGarden';
import { ProcessedTitanium } from './ProcessedTitanium';
import { TokamakFundraiser } from './TokamakFundraiser';
import { UndercoverActivists } from './UndercoverActivists';
import { FakeMediaConference } from './FakeMediaConference';
import { FundingForIter } from './FundingForIter';
//import { MolecularH2OResearch } from './MolecularH2OResearch';
import { OberonOrbitalBase } from './OberonOrbitalBase';
import { ColdFusion } from './ColdFusion';
import { JovianMegaReseachBay } from './JovianMegaResearchBay';
import { LimitedEnergyBudget } from './LimitedEnergyBudget';
import { NuclearReactor } from './NuclearReactor';
import { SpentFuel } from './SpentFuel';
import { EnergizingLava } from './EnergizingLava';
//import { MirroredHeatExchangers } from './MirroredHeatExchangers';
import { MissileDefenseMatrix } from './MissileDefenseMatrix';
import { ParticleBeamAccelerator } from './ParticleBeamAccelerator';
import { PlanetXSighting } from './PlanetXSighting';
import { RadioactiveDecay } from './RadioactiveDecay';
import { RedSpotGasHarvesting } from './RedSpotGasHervting';
import { SoilDecontamination } from './SoilDecontamination';
import { SolarIrradiance } from './SolarIrradiance';
import { StellarNova } from './StellarNova';
//
import { TritonExpedition } from './TritonExpedition';
import { AcuteRadiationSickness } from './AcuteRadiationSickness';
import { DumpSite } from './DumpSite';
import { EnrichmentFacility } from './EnrichmentFacility';
import { EvacuationZone } from './EvacuationZone';
import { ExtinctionLevelEvent } from './ExtinctionLevelEvent';
import { ExploratoryMiningSite } from './ExploratoryMiningSite';
import { ForestFires } from './ForestFires';
import { FuelRods } from './FuelRods';
import { FukushimaFarming } from './FukiushimaFarming';
import { CEOHeartAttack } from './CeoHeartAttack';
import { CosmicRays } from './CosmicRays';
import { GeneticMutations } from './GeneticMutations';
//import { Cockroaches } from './Cockroaches';



export const NUCLEAR_CARD_MANIFEST = new ModuleManifest({
  module: 'nuclear',
  projectCards: {
    [CardName.CARACALS]: {Factory: Caracals},   
    [CardName.CENTRAL_DOCKING_STATION]: {Factory: CentralDockingStation},
    [CardName.CHEMTRAILS]: {Factory: Chemtrails},
    [CardName.GENOMICS_NUCLEATION_CENTER]:  {Factory: GenomicsNucleationCenter},
    [CardName.INFRARED_THERAPY]: {Factory: InfraredTherapy},
    [CardName.NEON_JELLYFISH]: {Factory: NeonJellyfish},
    [CardName.NEUTRON_CITY]: {Factory: NeutrondCity},
    [CardName.NITRATE_COMBUSTION]: {Factory: NitrateCombustion},
    [CardName.OXYGEN_GARDEN]: {Factory: OxygenGarden},
    [CardName.PROCESSED_TITANIUM]: {Factory: ProcessedTitanium},
    [CardName.TOKAMAK_FUNDRAISER]: {Factory: TokamakFundraiser},
    [CardName.UNDERCOVER_ACTIVISTS]: {Factory: UndercoverActivists},
    [CardName.FAKE_MEDIA_CONFERENCE]: {Factory: FakeMediaConference},
    [CardName.FUNDING_FOR_ITER]: {Factory: FundingForIter},
    //[CardName.MOLECULAR_H2O_RESEARCH] : {Factory: MolecularH2OResearch},
    [CardName.OBERON_ORBITAL_BASE] : {Factory: OberonOrbitalBase},
    [CardName.COLD_FUSION]: {Factory: ColdFusion},
    [CardName.JOVIAN_MEGA_RESEARCH_BAY] :{Factory: JovianMegaReseachBay},
    [CardName.LIMITED_ENERGY_BUDGET] : {Factory: LimitedEnergyBudget},
    [CardName.NUCLEAR_REACTOR] : {Factory: NuclearReactor},
    [CardName.SPENT_FUEL] : {Factory: SpentFuel},
    [CardName.ENERGIZING_LAVA]: {Factory: EnergizingLava},
    //[CardName.MIRRORED_HEAT_EXCHANGERS]: {Factory:MirroredHeatExchangers},
    [CardName.MISSILE_DEFENSE_MATRIX]: {Factory: MissileDefenseMatrix},
    [CardName.PARTICLE_BEAM_ACCELERATOR]: {Factory: ParticleBeamAccelerator},
    [CardName.PLANET_X_SIGHTING]: {Factory: PlanetXSighting},
    [CardName.RADIOACTIVE_DECAY]: {Factory: RadioactiveDecay},
    [CardName.RED_SPOT_GAS_HARVESTING]: {Factory: RedSpotGasHarvesting},
    [CardName.SOIL_DECONTAMINATION]: {Factory: SoilDecontamination},
    [CardName.SOLAR_IRRADIANCE]: {Factory: SolarIrradiance},
    [CardName.STELLAR_NOVA]: {Factory: StellarNova},
    //[CardName.TRITUM_STATION]: {Factory: TritumStation},
    [CardName.TRITON_EXPEDITION]: {Factory: TritonExpedition},
    [CardName.ACUTE_RADIATION_SICKNESS]: {Factory: AcuteRadiationSickness},
    [CardName.DUMP_SITE]: {Factory: DumpSite},
    [CardName.ENRICHMENT_FACILITY]: {Factory: EnrichmentFacility},
    [CardName.EVACUATION_ZONE]: {Factory: EvacuationZone},
    [CardName.EXTINCION_LEVEL_EVENT]: {Factory: ExtinctionLevelEvent},
    [CardName.EXPLORATORY_MINING_SITE]: {Factory: ExploratoryMiningSite},
    [CardName.FOREST_FIRES]: {Factory: ForestFires},
    [CardName.FUEL_RODS]: {Factory: FuelRods},
    [CardName.FUKUSHIMA_FARMING]: {Factory: FukushimaFarming},
    [CardName.CEO_HEART_ATTACK]: {Factory: CEOHeartAttack},
    //[CardName.COCKROACHES]: {Factory: Cockroaches},
    [CardName.COSMIC_RAYS]: {Factory: CosmicRays},
    [CardName.GENETIC_MUTATIONS]: {Factory: GeneticMutations},

  },
 
});

