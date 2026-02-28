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

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import PopupPanel from '../common/PopupPanel.vue';

type Group = {key: string; label: string};

export default defineComponent({
  name: 'ModuleItemFilter',
  components: {PopupPanel},
  emits: ['update:selected', 'close'],
  props: {
    title: {type: String, required: true},
    groups: {type: Array as () => Array<Group>, required: true},
    itemsByGroup: {type: Object as () => Record<string, Array<string>>, required: true},
    selected: {type: Array as () => Array<string>, required: true},
  },
  data() {
    return {
      filterText: '',
      localSelected: [...this.selected] as Array<string>,
    };
  },
  methods: {
    allItems(): Array<string> {
      return this.groups.flatMap((g) => this.itemsByGroup[g.key] ?? []);
    },
    getItemsByGroup(key: string): Array<string> {
      if (key === 'All') return this.allItems();
      return (this.itemsByGroup[key] ?? []).slice();
    },
    selectAll(key: string) {
      for (const item of this.getItemsByGroup(key)) {
        if (!this.localSelected.includes(item)) {
          this.localSelected.push(item);
        }
      }
    },
    removeFromSelection(item: string) {
      const idx = this.localSelected.indexOf(item);
      if (idx !== -1) {
        this.localSelected.splice(idx, 1);
      }
    },
    selectNone(key: string) {
      for (const item of this.getItemsByGroup(key)) {
        this.removeFromSelection(item);
      }
    },
    invertSelection(key: string) {
      for (const item of this.getItemsByGroup(key)) {
        if (this.localSelected.includes(item)) {
          this.removeFromSelection(item);
        } else {
          this.localSelected.push(item);
        }
      }
    },
    /** Called by a parent via $refs to sync a group with an expansion toggle. */
    watchSelect(key: string, enabled: boolean) {
      enabled ? this.selectAll(key) : this.selectNone(key);
    },
    include(name: string): boolean {
      const normalized = this.filterText.toLocaleUpperCase();
      return normalized.length === 0 || name.toLocaleUpperCase().includes(normalized);
    },
    icon(module: string | undefined): string | undefined {
      if (module === undefined) return undefined;
      let suffix = module;
      if (module === 'colonies') suffix = 'colony';
      if (module === 'moon') suffix = 'themoon';
      return `create-game-expansion-icon expansion-icon-${suffix}`;
    },
  },
  watch: {
    localSelected: {
      deep: true,
      handler(value: Array<string>) {
        this.$emit('update:selected', [...value]);
      },
    },
  },
});
</script>
