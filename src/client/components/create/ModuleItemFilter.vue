<!--
  Generic popup filter for grouped item selection.

  Manages All/None/Invert selection, text filtering, and the checkbox list.
  Callers supply per-item rendering via the #item scoped slot:

    <template #item="{ itemName, icon }">
      <span>{{ itemName }}</span>
      <div v-for="m in compat(itemName)" :class="icon(m)"></div>
    </template>

  Groups whose itemsByGroup entry is empty are hidden automatically.
-->
<template>
  <PopupPanel @close="$emit('close')">
    <template v-slot:header>
      <div class="corporations-filter-toolbox-cont">
        <h2 v-i18n>{{ title }}</h2>
        <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
          <a href="#" v-i18n v-on:click.prevent="selectAll('All')">All*</a> |
          <a href="#" v-i18n v-on:click.prevent="selectNone('All')">None*</a> |
          <a href="#" v-i18n v-on:click.prevent="invertSelection('All')">Invert*</a>
          <input class="filter" :placeholder="$t('filter')" v-model="filterText">
        </div>
      </div>
    </template>
    <div>
      <div class="corporations-filter">
        <template v-for="group in groups">
          <div
            class="corporations-filter-group"
            v-if="(itemsByGroup[group.key] ?? []).length > 0"
            v-bind:key="group.key"
          >
            <div class="corporations-filter-toolbox-cont">
              <div>
                <span v-i18n>{{ group.label }}</span>&nbsp;
                <div :class="icon(group.key)"></div>
              </div>
              <div class="corporations-filter-toolbox">
                <a href="#" v-i18n v-on:click.prevent="selectAll(group.key)">All</a> |
                <a href="#" v-i18n v-on:click.prevent="selectNone(group.key)">None</a> |
                <a href="#" v-i18n v-on:click.prevent="invertSelection(group.key)">Invert</a>
              </div>
            </div>
            <div
              v-for="item in itemsByGroup[group.key]"
              v-bind:key="item"
              v-show="include(item)"
            >
              <label class="form-checkbox">
                <input type="checkbox" v-model="localSelected" :value="item"/>
                <i class="form-icon"></i>
                <slot name="item" :itemName="item" :icon="icon"></slot>
              </label>
            </div>
          </div>
        </template>
      </div>
    </div>
  </PopupPanel>
</template>

<script setup lang="ts" generic="T extends string">
import {type Ref, ref, watch} from 'vue';
import PopupPanel from '../common/PopupPanel.vue';

type Group = {key: string; label: string};

const props = defineProps<{
  title: string;
  groups: Array<Group>;
  itemsByGroup: Record<string, Array<T>>;
  selected: Array<T>;
}>();

const emit = defineEmits<{
  'update:selected': [value: Array<T>];
  'close': [];
}>();

const filterText = ref('');
const localSelected = ref([...props.selected]) as Ref<Array<T>>;

function allItems(): Array<T> {
  return props.groups.flatMap((g) => props.itemsByGroup[g.key] ?? []);
}

function getItemsByGroup(key: string): Array<T> {
  if (key === 'All') return allItems();
  return (props.itemsByGroup[key] ?? []).slice();
}

function selectAll(key: string) {
  for (const item of getItemsByGroup(key)) {
    if (!localSelected.value.includes(item)) {
      localSelected.value.push(item);
    }
  }
}

function removeFromSelection(item: T) {
  const idx = localSelected.value.indexOf(item);
  if (idx !== -1) {
    localSelected.value.splice(idx, 1);
  }
}

function selectNone(key: string) {
  for (const item of getItemsByGroup(key)) {
    removeFromSelection(item);
  }
}

function invertSelection(key: string) {
  for (const item of getItemsByGroup(key)) {
    if (localSelected.value.includes(item)) {
      removeFromSelection(item);
    } else {
      localSelected.value.push(item);
    }
  }
}

/** Called by a parent via $refs to sync a group with an expansion toggle. */
function watchSelect(key: string, enabled: boolean) {
  enabled ? selectAll(key) : selectNone(key);
}

function include(name: string): boolean {
  const normalized = filterText.value.toLocaleUpperCase();
  return normalized.length === 0 || name.toLocaleUpperCase().includes(normalized);
}

function icon(module: string | undefined): string | undefined {
  if (module === undefined) return undefined;
  let suffix = module;
  if (module === 'colonies') suffix = 'colony';
  if (module === 'moon') suffix = 'themoon';
  return `create-game-expansion-icon expansion-icon-${suffix}`;
}

watch(localSelected, (value) => {
  emit('update:selected', [...value]);
}, {deep: true});

defineExpose({watchSelect});
</script>
