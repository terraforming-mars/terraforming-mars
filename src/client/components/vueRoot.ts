import {ComponentPublicInstance} from 'vue';
import App from '@/client/components/App';

// Gives caller access to global client methods and data.
//
// This app's top level is probably not using a standard pattern, so some of this is
// just messy. But at least this method simplifies access.
export function vueRoot(component: ComponentPublicInstance): InstanceType<typeof App> {
  return component.$root as any;
}
