import {registerBehaviorExecutor} from '@/server/behavior/BehaviorExecutor';
import {Executor} from '@/server/behavior/Executor';
import {initializeGlobalEventDealer} from '@/server/turmoil/globalEvents/GlobalEventDealer';
import {ALL_MODULE_MANIFESTS} from '@/server/cards/AllManifests';

export function globalInitialize() {
  registerBehaviorExecutor(new Executor());
  initializeGlobalEventDealer(ALL_MODULE_MANIFESTS);
}
