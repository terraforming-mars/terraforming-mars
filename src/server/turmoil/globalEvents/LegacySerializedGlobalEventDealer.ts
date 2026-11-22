import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';

export type LegacySerializedGlobalEventDealer = {
  deck: Array<GlobalEventName>;
  discarded: Array<GlobalEventName>;
}
