import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';

export type SerializedGlobalEventDealer = {
  deck: Array<GlobalEventName>;
  discarded: Array<GlobalEventName>;
}
