import {GlobalEventName} from './GlobalEventName';

export interface SerializedGlobalEventDealer {
  deck: Array<GlobalEventName>;
  discarded: Array<GlobalEventName>;
}
