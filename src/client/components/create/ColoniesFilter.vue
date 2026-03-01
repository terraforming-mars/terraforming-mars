<template>
  <ModuleItemFilter
    title="Colonies"
    :groups="GROUPS"
    :itemsByGroup="ITEMS_BY_GROUP"
    :selected="initialSelected"
    @update:selected="$emit('colonies-list-changed', $event)"
    @close="$emit('close')"
  >
    <template #item="{ itemName, icon }">
      <span v-i18n>{{ itemName }} - ({{ description(itemName) }})</span>
      <div v-if="compatibility(itemName)" :class="icon(compatibility(itemName))"></div>
    </template>
  </ModuleItemFilter>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import ModuleItemFilter from './ModuleItemFilter.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {COLONY_DESCRIPTIONS} from '@/common/colonies/ColonyDescription';
import {OFFICIAL_COLONY_NAMES, COMMUNITY_COLONY_NAMES, PATHFINDERS_COLONY_NAMES} from '@/common/colonies/AllColonies';
import {Expansion} from '@/common/cards/GameModule';
import {getColony} from '@/client/colonies/ClientColonyManifest';

const OFFICIAL_COLONIES = [...OFFICIAL_COLONY_NAMES].sort();
const COMMUNITY_COLONIES = [...COMMUNITY_COLONY_NAMES].sort();
const PATHFINDERS_COLONIES = [...PATHFINDERS_COLONY_NAMES].sort();

const GROUPS = [
  {key: 'colonies', label: 'Official'},
  {key: 'community', label: 'Community'},
  {key: 'pathfinders', label: 'Pathfinders'},
];

const ITEMS_BY_GROUP: Record<string, Array<ColonyName>> = {
  colonies: OFFICIAL_COLONIES,
  community: COMMUNITY_COLONIES,
  pathfinders: PATHFINDERS_COLONIES,
};

export default defineComponent({
  name: 'ColoniesFilter',
  components: {ModuleItemFilter},
  emits: ['colonies-list-changed', 'close'],
  props: {
    expansions: {type: Object as () => Record<Expansion, boolean>, required: true},
    selected: {type: Array as () => Array<ColonyName>, required: true},
  },
  data() {
    const initialSelected: Array<ColonyName> = this.selected.length > 0 ? [...this.selected] : [
      ...OFFICIAL_COLONIES,
      ...this.expansions.community ? COMMUNITY_COLONIES : [],
      ...this.expansions.pathfinders ? PATHFINDERS_COLONIES : [],
    ];
    return {initialSelected};
  },
  computed: {
    GROUPS(): typeof GROUPS {
      return GROUPS;
    },
    ITEMS_BY_GROUP(): typeof ITEMS_BY_GROUP {
      return ITEMS_BY_GROUP;
    },
  },
  methods: {
    description(name: string): string {
      return COLONY_DESCRIPTIONS[name as ColonyName];
    },
    compatibility(name: string): Expansion | undefined {
      return getColony(name as ColonyName)?.expansion;
    },
  },
});
</script>
