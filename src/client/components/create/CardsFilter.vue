<template>
    <div class="cards-filter">
        <h2 v-i18n>{{ title }}</h2>
        <div class="cards-filter-results-cont" v-if="selected.length">
            <div class="cards-filter-result" v-for="cardName in selected" v-bind:key="cardName">
                <label>{{ cardName }}
                  <i class="create-game-expansion-icon expansion-icon-prelude" title="This card is a prelude" v-if="isPrelude(cardName)"></i>
                  <i class="create-game-expansion-icon expansion-icon-ceo" title="This card is a CEO" v-if="isCEO(cardName)"></i>
                  <template v-for="expansion of expansions(cardName)">
                    <i v-bind:key="expansion" :class="`create-game-expansion-icon expansion-icon-${expansion}`" :title="expansion"></i>
                  </template>
                </label>
                <AppButton size="small" type="close" @click="removeCard(cardName)" />
            </div>
        </div>
        <div class="cards-filter-input">
            <div>
                <input ref="filter" class="form-input" :placeholder="$t(hint)" v-model="searchTerm" />
            </div>
            <div class="cards-filter-suggest" v-if="searchMatches.length">
                <div class="cards-filter-suggest-item" v-for="cardName in searchMatches" v-bind:key="cardName">
                    <a href="#" v-on:click.prevent="addCard(cardName)">
                      {{ cardName }}
                      <i class="create-game-expansion-icon expansion-icon-prelude" title="This card is a Prelude" v-if="isPrelude(cardName)"></i>
                      <i class="create-game-expansion-icon expansion-icon-ceo" title="This card is a CEO" v-if="isCEO(cardName)"></i>
                      <template v-for="expansion of expansions(cardName)">
                        <i v-bind:key="expansion" :class="`create-game-expansion-icon expansion-icon-${expansion}`" :title="expansion"></i>
                      </template>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';
import {CardName} from '@/common/cards/CardName';
import AppButton from '@/client/components/common/AppButton.vue';
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

type Refs = {
  filter: HTMLInputElement,
};

type CardsFilterModel = {
  selected: Array<CardName>;
  searchMatches: Array<CardName>;
  searchTerm: string;
}

export default (Vue as WithRefs<Refs>).extend({
  name: 'CardsFilter',
  props: {
    title: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
  },
  data(): CardsFilterModel {
    return {
      selected: [],
      searchMatches: [],
      searchTerm: '',
    };
  },
  components: {
    AppButton,
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
      inplaceRemove(this.selected, cardName);
    },
    addCard(cardName: CardName) {
      if (this.selected.includes(cardName)) return;
      this.selected.push(cardName);
      this.selected.sort();
      this.searchTerm = '';
      this.$refs.filter.focus();
    },
  },
  watch: {
    selected(value) {
      this.$emit('cards-list-changed', value);
    },
    searchTerm(value: string) {
      this.searchMatches = [];

      // Allows multiple simultaneous entries
      // This is case sensitive, as opposed to the standard search
      if (value.indexOf(',') !== -1) {
        const cardNames = new Set(value.split(',').map((c) => c.trim()));
        for (const item of ALL_CARDS) {
          if (cardNames.has(item)) {
            this.addCard(item);
          }
        }
        return;
      }

      if (value === '') {
        return;
      }

      const searchTermLowercase = value.toLowerCase();
      for (const candidate of ALL_CARDS) {
        if (candidate.toLowerCase().indexOf(searchTermLowercase) >= 0) {
          this.searchMatches.push(candidate);
        }
        if (this.searchMatches.length === 5) {
          return;
        }
      }
    },
  },
  mounted() {
    this.$refs.filter.focus();
  },
});
</script>
