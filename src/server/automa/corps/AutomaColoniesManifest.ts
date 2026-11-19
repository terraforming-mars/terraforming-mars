import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {AridorMarsBot} from './colonies/AridorMarsBot';
import {ArklightMarsBot} from './colonies/ArklightMarsBot';
import {PolyphemosMarsBot} from './colonies/PolyphemosMarsBot';
import {PoseidonMarsBot} from './colonies/PoseidonMarsBot';

export const AUTOMA_COLONIES_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.ARIDOR]: new AridorMarsBot(),
    [CardName.ARKLIGHT]: new ArklightMarsBot(),
    [CardName.POLYPHEMOS]: new PolyphemosMarsBot(),
    [CardName.POSEIDON]: new PoseidonMarsBot(),
  },
};
