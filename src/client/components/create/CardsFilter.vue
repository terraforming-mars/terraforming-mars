<template>
  <PopupPanel class="cards-filter" @close="$emit('close')">
    <template #header>
      <h2 v-i18n>{{ title }}</h2>
    </template>
    <div class="cards-filter-input">
      <div>
        <input ref="filter" class="form-input" :placeholder="$t(hint)" v-model="searchTerm"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
          @keydown.enter.prevent="addHighlighted">
      </div>
      <div class="cards-filter-suggest" v-if="searchMatches.length">
        <div class="cards-filter-suggest-item" v-for="(cardName, idx) in searchMatches" :key="cardName"
          :class="{'cards-filter-suggest-item-highlighted': idx === highlighted}"
          @mouseenter="highlighted = idx">
          <a href="#" @click.prevent="addCard(cardName)">
            {{ cardName }}
            <i class="create-game-expansion-icon expansion-icon-prelude" title="This card is a Prelude" v-if="isPrelude(cardName)"></i>
            <i class="create-game-expansion-icon expansion-icon-ceo" title="This card is a CEO" v-if="isCEO(cardName)"></i>
            <template v-for="expansion in expansions(cardName)" :key="expansion">
              <i :class="`create-game-expansion-icon expansion-icon-${expansion}`" :title="expansion"></i>
            </template>
          </a>
        </div>
      </div>
    </div>
    <div class="cards-filter-results-cont" v-if="selectedCards.length">
      <div class="cards-filter-result" v-for="cardName in selectedCards" :key="cardName">
        <AppButton size="small" type="close" @click="removeCard(cardName)" />
        <label>{{ cardName }}
          <i class="create-game-expansion-icon expansion-icon-prelude" title="This card is a prelude" v-if="isPrelude(cardName)"></i>
          <i class="create-game-expansion-icon expansion-icon-ceo" title="This card is a CEO" v-if="isCEO(cardName)"></i>
          <template v-for="expansion in expansions(cardName)" :key="expansion">
            <i :class="`create-game-expansion-icon expansion-icon-${expansion}`" :title="expansion"></i>
          </template>
        </label>
      </div>
    </div>
  </PopupPanel>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {CardName} from '@/common/cards/CardName';
import AppButton from '@/client/components/common/AppButton.vue';
import PopupPanel from '@/client/components/common/PopupPanel.vue';
import {byType, getCard, getCards} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';
import {inplaceRemove, toName} from '@/common/utils/utils';
import {Expansion} from '@/common/cards/GameModule';

const ALL_CARDS: Array<CardName> = [
  ...getCards(byType(CardType.AUTOMATED)),
  ...getCards(byType(CardType.ACTIVE)),
  ...getCards(byType(CardType.EVENT)),
  ...getCards(byType(CardType.CEO)),
].map(toName)
  .sort((a, b) => a.localeCompare(b));

/** The most suggestions shown at once. */
const MAX_SEARCH_MATCHES = 10;

type CardsFilterModel = {
  selectedCards: Array<CardName>;
  /** Index into searchMatches of the suggestion that Enter adds. */
  highlighted: number;
  searchTerm: string;
}

type Refs = {
  filter: HTMLInputElement;
};

export default defineComponent({
  name: 'CardsFilter',
  emits: ['cards-list-changed', 'close'],
  props: {
    title: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
    /** Cards selected when the popup opens. */
    selected: {
      type: Array as () => ReadonlyArray<CardName>,
      default: () => [],
    },
  },
  data(): CardsFilterModel {
    return {
      selectedCards: [...this.selected],
      highlighted: 0,
      searchTerm: '',
    };
  },
  components: {
    AppButton,
    PopupPanel,
  },
  computed: {
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
    },
    /** Up to ten unselected cards whose names contain the search term. */
    searchMatches(): Array<CardName> {
      // A comma means a list of card names, which the watcher adds directly.
      if (this.searchTerm === '' || this.searchTerm.includes(',')) {
        return [];
      }
      // This is case insensitive, as opposed to the comma-separated list.
      const searchTermLowercase = this.searchTerm.toLowerCase();
      const matches: Array<CardName> = [];
      for (const candidate of ALL_CARDS) {
        if (this.selectedCards.includes(candidate)) {
          continue;
        }
        if (candidate.toLowerCase().includes(searchTermLowercase)) {
          matches.push(candidate);
        }
        if (matches.length === MAX_SEARCH_MATCHES) {
          break;
        }
      }
      return matches;
    },
  },
  methods: {
    isPrelude(cardName: CardName) {
      return getCard(cardName)?.type === CardType.PRELUDE;
    },
    isCEO(cardName: CardName) {
      return getCard(cardName)?.type === CardType.CEO;
    },
    expansions(cardName: CardName): Array<Expansion> {
      return getCard(cardName)?.compatibility ?? [];
    },
    removeCard(cardName: CardName) {
      inplaceRemove(this.selectedCards, cardName);
    },
    /** Moves the highlighted suggestion by `delta`, stopping at either end of the list. */
    moveHighlight(delta: number) {
      const last = this.searchMatches.length - 1;
      this.highlighted = Math.max(0, Math.min(last, this.highlighted + delta));
    },
    addHighlighted() {
      const cardName = this.searchMatches[this.highlighted];
      if (cardName !== undefined) {
        this.addCard(cardName);
      }
    },
    addCard(cardName: CardName) {
      if (this.selectedCards.includes(cardName)) {
        return;
      }
      this.selectedCards.push(cardName);
      this.selectedCards.sort();
      this.searchTerm = '';
      this.typedRefs.filter.focus();
    },
  },
  watch: {
    selectedCards: {
      handler(value) {
        this.$emit('cards-list-changed', value);
      },
      deep: true,
    },
    searchMatches() {
      this.highlighted = 0;
    },
    searchTerm(value: string) {
      // Allows multiple simultaneous entries
      // This is case sensitive, as opposed to the standard search
      if (value.indexOf(',') !== -1) {
        const cardNames = new Set(value.split(',').map((c) => c.trim()));
        for (const item of ALL_CARDS) {
          if (cardNames.has(item)) {
            this.addCard(item);
          }
        }
      }
    },
  },
  mounted() {
    this.typedRefs.filter.focus();
  },
});
</script>
