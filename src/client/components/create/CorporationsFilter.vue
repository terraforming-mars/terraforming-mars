<template>
  <ModuleItemFilter
    title="Corporations"
    :groups="GROUPS"
    :itemsByGroup="ALL_CARDS_BY_MODULE"
    :selected="initialSelected"
    @update:selected="$emit('corporation-list-changed', $event)"
    @close="$emit('close')"
  >
    <template #item="{ itemName, icon }">
      <span v-i18n>{{ itemName }}</span>
      <div v-for="m in compatibility(itemName)" :key="m" :class="icon(m)"></div>
    </template>
  </ModuleItemFilter>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import ModuleItemFilter from './ModuleItemFilter.vue';
import {CardName} from '@/common/cards/CardName';
import {Expansion, GameModule, GAME_MODULES, MODULE_NAMES} from '@/common/cards/GameModule';
import {byModule, byType, getCard, getCards} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';
import {toName} from '@/common/utils/utils';

function corpCardNames(module: GameModule): Array<CardName> {
  return getCards(byModule(module))
    .filter(byType(CardType.CORPORATION))
    .map(toName)
    .filter((name) => name !== CardName.BEGINNER_CORPORATION);
}

const interim = GAME_MODULES.map((module) => [module, [] as Array<CardName>]);
const ALL_CARDS_BY_MODULE: Record<GameModule, Array<CardName>> = Object.fromEntries(interim);
getCards(byType(CardType.CORPORATION)).forEach((card) => {
  if (card.name !== CardName.BEGINNER_CORPORATION) {
    ALL_CARDS_BY_MODULE[card.module].push(card.name);
  }
});
GAME_MODULES.forEach((module) => ALL_CARDS_BY_MODULE[module].sort());

const GROUPS = GAME_MODULES.map((module) => ({key: module, label: MODULE_NAMES[module]}));

export default defineComponent({
  name: 'CorporationsFilter',
  components: {ModuleItemFilter},
  emits: ['corporation-list-changed', 'close'],
  props: {
    expansions: {type: Object as () => Record<Expansion, boolean>, required: true},
    selected: {type: Array as () => Array<CardName>, required: true},
  },
  data() {
    const initialSelected: Array<CardName> = this.selected.length > 0 ? [...this.selected] : [
      ...corpCardNames('base'),
      ...this.expansions.corpera ? corpCardNames('corpera') : [],
      ...this.expansions.prelude ? corpCardNames('prelude') : [],
      ...this.expansions.prelude2 ? corpCardNames('prelude2') : [],
      ...this.expansions.venus ? corpCardNames('venus') : [],
      ...this.expansions.colonies ? corpCardNames('colonies') : [],
      ...this.expansions.turmoil ? corpCardNames('turmoil') : [],
      ...this.expansions.promo ? corpCardNames('promo') : [],
      ...this.expansions.community ? corpCardNames('community') : [],
      ...this.expansions.moon ? corpCardNames('moon') : [],
      ...this.expansions.pathfinders ? corpCardNames('pathfinders') : [],
      ...this.expansions.underworld ? corpCardNames('underworld') : [],
    ];
    return {initialSelected};
  },
  computed: {
    GROUPS(): typeof GROUPS {
      return GROUPS;
    },
    ALL_CARDS_BY_MODULE(): typeof ALL_CARDS_BY_MODULE {
      return ALL_CARDS_BY_MODULE;
    },
  },
  methods: {
    compatibility(name: CardName): Array<GameModule> {
      return getCard(name)?.compatibility ?? [];
    },
  },
});
</script>
