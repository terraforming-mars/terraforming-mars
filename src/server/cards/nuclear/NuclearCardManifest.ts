import {ModuleManifest} from '../ModuleManifest';
import {CardName} from '../../../common/cards/CardName';

import {Caracals} from './Caracals';
import {CentralDockingStation} from './CentralDockingStation';
import {Chemtrails} from './Chemtrails';
import {GenomicsNucleationCenter} from './GenomicsNucleationCenter';
import {InfraredTherapy} from './InfraredTherapy';
import { NeonJellyfish } from './NeonJellyfish';

export const NUCLEAR_CARD_MANIFEST = new ModuleManifest({
  module: 'nuclear',
  projectCards: {
    [CardName.CARACALS]: {Factory: Caracals},   
    [CardName.CENTRAL_DOCKING_STATION]: {Factory: CentralDockingStation},
    [CardName.CHEMTRAILS]: {Factory: Chemtrails},
    [CardName.GENOMICS_NUCLEATION_CENTER]:  {Factory: GenomicsNucleationCenter},
    [CardName.INFRARED_THERAPY]: {Factory: InfraredTherapy},
    [CardName.NEON_JELLYFISH]: {Factory: NeonJellyfish}
  },
 
});

