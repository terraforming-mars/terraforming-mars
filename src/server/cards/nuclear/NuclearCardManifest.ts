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
//import { FakeMediaConference } from './FakeMediaConference';
import { FundingForIter } from './FundingForIter';
//import { MolecularH2OResearch } from './MolecularH2OResearch';
import { OberonOrbitalBase } from './OberonOrbitalBase';
import { ColdFusion } from './ColdFusion';
//import { JovianMegaReseachBay } from './JovianMegaResearchBay';
import { LimitedEnergyBudget } from './LimitedEnergyBudget';
import { NuclearReactor } from './NuclearReactor';
import { SpentFuel } from './SpentFuel';
import { EnergizingLava } from './EnergizingLava';
//import { MirroredHeatExchangers } from './MirroredHeatExchangers';


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
    //[CardName.FAKE_MEDIA_CONFERENCE]: {Factory: FakeMediaConference},
    [CardName.FUNDING_FOR_ITER]: {Factory: FundingForIter},
    //[CardName.MOLECULAR_H2O_RESEARCH] : {Factory: MolecularH2OResearch},
    [CardName.OBERON_ORBITAL_BASE] : {Factory: OberonOrbitalBase},
    [CardName.COLD_FUSION]: {Factory: ColdFusion},
    //[CardName.JOVIAN_MEGA_RESEARCH_BAY] :{Factory: JovianMegaReseachBay},
    [CardName.LIMITED_ENERGY_BUDGET] : {Factory: LimitedEnergyBudget},
    [CardName.NUCLEAR_REACTOR] : {Factory: NuclearReactor},
    [CardName.SPENT_FUEL] : {Factory: SpentFuel},
    [CardName.ENERGIZING_LAVA]: {Factory: EnergizingLava},
    //[CardName.MIRRORED_HEAT_EXCHANGERS]: {Factory:MirroredHeatExchangers},
  },
 
});

