import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';

export interface SerializedGlobalEventDealer {
  deck: Array<GlobalEventName>;
  discarded: Array<GlobalEventName>;
}
