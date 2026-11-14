// Support finding the ModuleItemFilter in the create game filters.
//
// Finding the module item filter in the custom filters is tricky because of
// component typing. This maps to the types in ModuleItemFilter, though it
// is inferred, not guaranteed.

import type {VueWrapper} from '@vue/test-utils';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';

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

type ModuleItemFilterWrapper = VueWrapper & {
  props(): ModuleItemFilterProps;
  props<K extends keyof ModuleItemFilterProps>(key: K): ModuleItemFilterProps[K];
  vm: {
    $emit<K extends keyof ModuleItemFilterEmits>(event: K, ...args: ModuleItemFilterEmits[K]): void;
  };
};

/**
 * Finds the ModuleItemFilter component in a wrapper.
 */
export function findModuleItemFilter(wrapper: VueWrapper): ModuleItemFilterWrapper {
  return wrapper.findComponent(ModuleItemFilter) as ModuleItemFilterWrapper;
}
