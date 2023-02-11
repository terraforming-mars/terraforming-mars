import {CombinedVueInstance} from 'vue/types/vue';
import {mainAppSettings} from '@/client/components/App';

// Gives caller acecss to global client methods and data.
//
// This app's top level is probably not using a standard pattern, so some of this is
// just messy. But at least this method simplifies access a great day.
export function vueRoot(component: CombinedVueInstance<any, any, any, any, any>): typeof mainAppSettings.methods & typeof mainAppSettings.data {
  return component.$root as unknown as (typeof mainAppSettings.methods & typeof mainAppSettings.data);
}
