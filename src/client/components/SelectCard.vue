<template>
    <div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <label v-for="card in getOrderedCards()" :key="card.name" :class="getCardBoxClass(card)">
            <template v-if="!card.isDisabled">
              <input v-if="isSelectOnlyOneCard()" type="radio" v-model="cards" :value="card" />
              <input v-else type="checkbox" v-model="cards" :value="card" :disabled="playerinput.maxCardsToSelect !== undefined && Array.isArray(cards) && cards.length >= playerinput.maxCardsToSelect && cards.includes(card) === false" />
            </template>
            <Card :card="card">
              <template v-if="playerinput.showOwner">
                <div :class="'card-owner-label player_translucent_bg_color_'+ getOwner(card).color">
                  {{getOwner(card).name}}
                </div>
              </template>
            </Card>
        </label>
        <div v-if="hasCardWarning()" class="card-warning">{{ $t(warning) }}</div>
        <div v-if="showsave === true" class="nofloat">
            <Button :disabled="isOptionalToManyCards() && cardsSelected() === 0" type="submit" @click="saveData" :title="buttonLabel()" />
            <Button :disabled="isOptionalToManyCards() && cardsSelected() > 0" v-if="isOptionalToManyCards()" @click="saveData" type="submit" :title="$t('Skip this action')" />
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';
import {Color} from '@/common/Color';
import {Message} from '@/common/logs/Message';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {VueModelCheckbox, VueModelRadio} from '@/client/types';
import Card from '@/client/components/card/Card.vue';
import {CardModel} from '@/common/models/CardModel';
import {CardName} from '@/common/cards/CardName';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';

interface Owner {
  name: string;
  color: Color;
}

interface SelectCardModel {
  cards: VueModelRadio<CardModel> | VueModelCheckbox<Array<CardModel>>;
  warning: string | Message | undefined;
  owners: Map<CardName, Owner>,
}

export default Vue.extend({
  name: 'SelectCard',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
      required: false,
      default: false,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      cards: [],
      warning: undefined,
      owners: new Map(),
    } as SelectCardModel;
  },
  components: {
    Card,
    Button,
  },
  watch: {
    cards() {
      this.$emit('cardschanged', this.getData());
    },
  },
  methods: {
    cardsSelected(): number {
      if (Array.isArray(this.cards)) {
        return this.cards.length;
      } else if (this.cards === false || this.cards === undefined) {
        return 0;
      }
      return 1;
    },
    getOrderedCards(): Array<CardModel> {
      let cards: Array<CardModel> = [];
      if (this.playerinput.cards !== undefined) {
        if (this.playerinput.selectBlueCardAction) {
          cards = sortActiveCards(this.playerinput.cards);
        } else {
          cards = CardOrderStorage.getOrdered(
            CardOrderStorage.getCardOrder(this.playerView.id),
            this.playerinput.cards,
          );
        }
      }

      if (this.playerinput.showOwner) {
        // Optimization so getOwners isn't repeatedly called.
        this.owners.clear();
        this.playerinput.cards?.forEach((card) => {
          const owner = this.findOwner(card);
          if (owner !== undefined) this.owners.set(card.name, owner);
        });
      }
      return cards;
    },
    hasCardWarning() {
      if (Array.isArray(this.cards)) {
        return false;
      } else if (typeof this.cards === 'object' && this.cards.warning !== undefined) {
        this.warning = this.cards.warning;
        return true;
      }
      return false;
    },
    isOptionalToManyCards(): boolean {
      return this.playerinput.maxCardsToSelect !== undefined &&
             this.playerinput.maxCardsToSelect > 1 &&
             this.playerinput.minCardsToSelect === 0;
    },
    getData(): Array<CardName> {
      return Array.isArray(this.$data.cards) ? this.$data.cards.map((card) => card.name) : [this.$data.cards.name];
    },
    saveData() {
      this.onsave([this.getData()]);
    },
    getCardBoxClass(card: CardModel): string {
      if (this.playerinput.showOwner && this.getOwner(card) !== undefined) {
        return 'cardbox cardbox-with-owner-label';
      }
      return 'cardbox';
    },
    findOwner(card: CardModel): Owner | undefined {
      for (const player of this.playerView.players) {
        if (player.playedCards.find((c) => c.name === card.name) || player.corporationCard?.name === card.name) {
          return {name: player.name, color: player.color};
        }
      }
      return undefined;
    },
    getOwner(card: CardModel): Owner {
      return this.owners.get(card.name) ?? {name: 'unknown', color: Color.NEUTRAL};
    },
    isSelectOnlyOneCard() : boolean {
      return this.playerinput.maxCardsToSelect === 1 && this.playerinput.minCardsToSelect === 1;
    },
    buttonLabel(): string {
      return this.isSelectOnlyOneCard() ? this.playerinput.buttonLabel : this.playerinput.buttonLabel + ' ' + this.cardsSelected();
    },
  },
});

</script>
