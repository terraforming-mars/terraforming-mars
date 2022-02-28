import {ColonyName} from '@/common/colonies/ColonyName';
import {SerializedColony} from '../SerializedColony';

export interface SerializedColonyDealer {
  // TODO(kberg): Remove SerializedColony by 2022-06-01
  discardedColonies: Array<SerializedColony | ColonyName>;
}
