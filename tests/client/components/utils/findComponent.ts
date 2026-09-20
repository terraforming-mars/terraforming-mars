// Support finding the ModuleItemFilter in the create game filters.
//
// Finding the module item filter in the custom filters is tricky because of
// component typing. This maps to the types in ModuleItemFilter, though it
// is inferred, not guaranteed.

import type {VueWrapper} from '@vue/test-utils';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';

// Matches @vue/test-utils' own (unexported) `DefinedComponent` selector type.
type ComponentConstructor = new (...args: any[]) => any;

interface ModuleItemFilterProps {
  title: string;
  groups: Array<{key: string; label: string}>;
  itemsByGroup: Record<string, Array<string>>;
  selected: Array<string>;
}

interface ModuleItemFilterEmits {
  'update:selected': [value: Array<string>];
  'close': [];
}

interface ModuleItemFilterWrapper {
  exists(): boolean;
  props(): ModuleItemFilterProps;
  props<K extends keyof ModuleItemFilterProps>(key: K): ModuleItemFilterProps[K];
  vm: {
    $emit<K extends keyof ModuleItemFilterEmits>(event: K, ...args: ModuleItemFilterEmits[K]): void;
  };
}

/**
 * Finds the ModuleItemFilter component in a wrapper.
 */
export function findModuleItemFilter(wrapper: VueWrapper<any>): ModuleItemFilterWrapper {
  return wrapper.findComponent(ModuleItemFilter as unknown as ComponentConstructor) as ModuleItemFilterWrapper;
}
