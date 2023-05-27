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

  },
 
});

