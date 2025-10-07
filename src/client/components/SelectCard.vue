<template>
    <div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <label
          v-for="card in getOrderedCards()"
          :key="card.name"
          :class="getCardBoxClass(card)"
          @pointerup.prevent="onCardPointerUp(card, $event)"
        >
            <template v-if="!card.isDisabled">
              <input
                v-if="selectOnlyOneCard"
                type="radio"
                :name="radioGroupName"
                :checked="isCardSelected(card)"
                @change="onCardInputChange(card, $event)"
              />
              <input
                v-else
                type="checkbox"
                :checked="isCardSelected(card)"
                :disabled="isCardDisabled(card)"
                @change="onCardInputChange(card, $event)"
              />
            </template>
            <Card :card="card" :actionUsed="isCardActivated(card)" :robotCard="robotCard(card)">
              <template v-if="playerinput.showOwner">
                <div :class="'card-owner-label player_translucent_bg_color_'+ getOwner(card).color">
                  {{getOwner(card).name}}
                </div>
              </template>
            </Card>
        </label>
        <div v-if="hasCardWarning()" class="card-warning">{{ $t(warning) }}</div>
        <warnings-component :warnings="warnings"></warnings-component>
        <div v-if="showsave === true" class="nofloat">
            <AppButton :disabled="isOptionalToManyCards && cardsSelected() === 0" type="submit" @click="saveData" :title="buttonLabel()" />
            <AppButton :disabled="isOptionalToManyCards && cardsSelected() > 0" v-if="isOptionalToManyCards" @click="saveData" type="submit" :title="$t('Skip this action')" />
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import WarningsComponent from '@/client/components/WarningsComponent.vue';
import {Color} from '@/common/Color';
import {Message} from '@/common/logs/Message';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import Card from '@/client/components/card/Card.vue';
import {CardModel} from '@/common/models/CardModel';
import {CardName} from '@/common/cards/CardName';
import {SelectCardModel} from '@/common/models/PlayerInputModel';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';
import {SelectCardResponse} from '@/common/inputs/InputResponse';
import {Warning} from '@/common/cards/Warning';

type Owner = {
  name: string;
  color: Color;
}

type WidgetDataModel = {
  // The selected item or items
  cards: CardModel | Array<CardModel>;
  warning: string | Message | undefined;
  warnings: ReadonlyArray<Warning> | undefined;
  owners: Map<CardName, Owner>,
  instanceId: number,
}

let selectCardInstanceCounter = 0;

export default Vue.extend({
  name: 'SelectCard',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectCardModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectCardResponse) => void,
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
  data(): WidgetDataModel {
    return {
      cards: [],
      warning: undefined,
      owners: new Map(),
      warnings: undefined,
      instanceId: selectCardInstanceCounter++,
    };
  },
  components: {
    Card,
    WarningsComponent,
    AppButton,
  },
  watch: {
    cards() {
      this.$emit('cardschanged', this.getData());
    },
  },
  methods: {
    cardsSelected(): number {
      return this.getSelectedCards().length;
    },
    getOrderedCards(): ReadonlyArray<CardModel> {
      let cards: ReadonlyArray<CardModel> = [];
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
        this.playerinput.cards.forEach((card) => {
          const owner = this.findOwner(card);
          if (owner !== undefined) this.owners.set(card.name, owner);
        });
      }
      return cards;
    },
    getData(): Array<CardName> {
      return this.getSelectedCards().map((card) => card.name);
    },
    hasCardWarning() {
      // This is pretty clunky, to be honest.
      if (Array.isArray(this.cards)) {
        if (this.cards.length === 1) {
          this.warnings = this.cards[0].warnings;
        }
        return false;
      } else if (typeof this.cards === 'object') {
        this.warnings = this.cards.warnings;
      }
      return false;
    },

    canSave() {
      const len = this.getData().length;
      if (len > this.playerinput.min) {
        return false;
      }
      if (len < this.playerinput.max) {
        return false;
      }
      return true;
    },
    saveData() {
      this.onsave({type: 'card', cards: this.getData()});
    },
    getCardBoxClass(card: CardModel): string {
      if (this.playerinput.showOwner && this.getOwner(card) !== undefined) {
        return 'cardbox cardbox-with-owner-label';
      }
      return 'cardbox';
    },
    findOwner(card: CardModel): Owner | undefined {
      for (const player of this.playerView.players) {
        if (player.tableau.find((c) => c.name === card.name)) {
          return {name: player.name, color: player.color};
        }
      }
      return undefined;
    },
    getOwner(card: CardModel): Owner {
      return this.owners.get(card.name) ?? {name: 'unknown', color: 'neutral'};
    },
    isCardActivated(card: CardModel): boolean {
      // Copied from PlayerMixin.
      return this.playerView.thisPlayer.actionsThisGeneration.includes(card.name);
    },
    getSelectedCards(): Array<CardModel> {
      if (Array.isArray(this.cards)) {
        return this.cards;
      }
      if (this.cards === undefined) {
        return [];
      }
      return [this.cards];
    },
    isCardSelected(card: CardModel): boolean {
      return this.getSelectedCards().some((selected) => selected.name === card.name);
    },
    isCardDisabled(card: CardModel): boolean {
      if (this.selectOnlyOneCard) {
        return false;
      }
      if (this.playerinput.max === undefined) {
        return false;
      }
      const selected = this.getSelectedCards();
      if (selected.length < this.playerinput.max) {
        return false;
      }
      return selected.some((selectedCard) => selectedCard.name === card.name) === false;
    },
    buttonLabel(): string {
      return this.selectOnlyOneCard ? this.playerinput.buttonLabel : this.playerinput.buttonLabel + ' ' + this.cardsSelected();
    },
    robotCard(card: CardModel): CardModel | undefined {
      return this.playerView.thisPlayer.selfReplicatingRobotsCards?.find((r) => r.name === card.name);
    },
    onCardPointerUp(card: CardModel, event: PointerEvent): void {
      if (event.button !== 0 && event.pointerType === 'mouse') {
        return;
      }
      if (card.isDisabled || this.isCardDisabled(card)) {
        return;
      }
      const shouldSelect = this.selectOnlyOneCard ? true : !this.isCardSelected(card);
      this.applySelectionChange(card, shouldSelect, event);
    },
    onCardInputChange(card: CardModel, event: Event): void {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      this.applySelectionChange(card, target.checked, event);
    },
    applySelectionChange(card: CardModel, shouldSelect: boolean, event?: Event): void {
      if (this.selectOnlyOneCard) {
        if (shouldSelect) {
          this.cards = card;
        }
        return;
      }

      const selected = [...this.getSelectedCards()];
      const idx = selected.findIndex((selectedCard) => selectedCard.name === card.name);

      if (shouldSelect) {
        if (idx !== -1) {
          return;
        }
        if (this.playerinput.max !== undefined && selected.length >= this.playerinput.max) {
          if (event?.target instanceof HTMLInputElement) {
            event.target.checked = false;
          }
          return;
        }
        selected.push(card);
        this.cards = selected;
        return;
      }

      if (idx !== -1) {
        selected.splice(idx, 1);
        this.cards = selected;
      }
    },
  },
  computed: {
    radioGroupName(): string {
      return `select-card-${this.instanceId}`;
    },
    selectOnlyOneCard() : boolean {
      return this.playerinput.max === 1 && this.playerinput.min === 1;
    },
    isOptionalToManyCards(): boolean {
      return this.playerinput.max !== undefined &&
             this.playerinput.max > 1 &&
             this.playerinput.min === 0;
    },
  },
});

</script>
