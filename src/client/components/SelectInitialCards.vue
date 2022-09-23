<template>
  <div class="select-initial-cards">
    <confirm-dialog
      message="Continue without buying any project cards?"
      ref="confirmation"
      v-on:accept="confirmSelection" />
    <SelectCard :playerView="playerView" :playerinput="corpCardOption" :showtitle="true" :onsave="noop" v-on:cardschanged="corporationChanged" />
    <div v-if="playerCanChooseAridor" class="player_home_colony_cont">
      <div v-i18n>These are the colony tiles Aridor may choose from:</div>
      <div class="discarded-colonies-for-aridor">
        <div class="player_home_colony small_colony" v-for="colony in playerView.game.discardedColonies" :key="colony.name">
          <colony :colony="colony"></colony>
        </div>
      </div>
    </div>
    <SelectCard v-if="hasPrelude" :playerView="playerView" :playerinput="preludeCardOption" :onsave="noop" :showtitle="true" v-on:cardschanged="preludesChanged" />
    <SelectCard :playerView="playerView" :playerinput="projectCardOption" :onsave="noop" :showtitle="true" v-on:cardschanged="cardsChanged" />
    <template v-if="this.selectedCorporations.length === 1">
      <div><span v-i18n>Starting Megacredits:</span> <div class="megacredits">{{getStartingMegacredits()}}</div></div>
      <div v-if="hasPrelude"><span v-i18n>After Preludes:</span> <div class="megacredits">{{getStartingMegacredits() + getAfterPreludes()}}</div></div>
    </template>
    <div v-if="warning !== undefined" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>
    <!-- :key=warning is a way of validing that the state of the button should change. If the warning changes, or disappears, that's a signal that the button might change. -->
    <Button :disabled="!valid" v-if="showsave" @click="saveIfConfirmed" type="submit" :title="playerinput.buttonLabel"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';

import Button from '@/client/components/common/Button.vue';
import {getCard, getCardOrThrow} from '@/client/cards/ClientCardManifest';
import {CardName} from '@/common/cards/CardName';
import * as constants from '@/common/constants';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import SelectCard from '@/client/components/SelectCard.vue';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';
import {getPreferences, Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {Tag} from '@/common/cards/Tag';
import {InputResponse} from '@/common/inputs/InputResponse';
import {CardType} from '@/common/cards/CardType';
import Colony from '@/client/components/colonies/Colony.vue';

type Refs = {
  confirmation: InstanceType<typeof ConfirmDialog>,
}

type SelectInitialCardsModel = {
  selectedCards: Array<CardName>,
  // End result will be a single corporation, but the player may select multiple while deciding what to keep.
  selectedCorporations: Array<CardName>,
  selectedPreludes: Array<CardName>,
  valid: boolean,
  warning: string | undefined,
}

export default (Vue as WithRefs<Refs>).extend({
  name: 'SelectInitialCards',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: InputResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
    preferences: {
      type: Object as () => Readonly<Preferences>,
      default: () => PreferencesManager.INSTANCE.values(),
    },
  },
  components: {
    Button,
    SelectCard,
    'confirm-dialog': ConfirmDialog,
    Colony,
  },
  data(): SelectInitialCardsModel {
    return {
      selectedCards: [],
      selectedCorporations: [],
      selectedPreludes: [],
      valid: false,
      warning: undefined,
    };
  },
  methods: {
    noop() {
      throw new Error('should not be called');
    },
    getAfterPreludes() {
      let result = 0;
      for (const prelude of this.selectedPreludes) {
        const card = getCardOrThrow(prelude);
        result += card.startingMegaCredits ?? 0;

        switch (this.selectedCorporations.length === 1 ? this.selectedCorporations[0] : undefined) {
        // For each step you increase the production of a resource ... you also gain that resource.
        case CardName.MANUTECH:
          result += card.productionBox?.megacredits ?? 0;
          break;

        // When you place a city tile, gain 3 M€.
        case CardName.THARSIS_REPUBLIC:
          switch (prelude) {
          case CardName.SELF_SUFFICIENT_SETTLEMENT:
          case CardName.EARLY_SETTLEMENT:
          case CardName.STRATEGIC_BASE_PLANNING:
            result += 3;
            break;
          }
          break;

        // When ANY microbe tag is played ... lose 4 M€ or as much as possible.
        case CardName.PHARMACY_UNION:
          const tags = card.tags.filter((tag) => tag === Tag.MICROBE).length;
          result -= (4 * tags);
          break;

        // when a microbe tag is played, incl. this, THAT PLAYER gains 2 M€,
        case CardName.SPLICE:
          const microbeTags = card.tags.filter((tag) => tag === Tag.MICROBE).length;
          result += (2 * microbeTags);
          break;

        // Whenever Venus is terraformed 1 step, you gain 2 M€
        case CardName.APHRODITE:
          switch (prelude) {
          case CardName.VENUS_FIRST:
          case CardName.VENUS_FIRST_PATHFINDERS:
            result += 4;
            break;
          case CardName.HYDROGEN_BOMBARDMENT:
            result += 2;
            break;
          }
          break;

        // When any player raises any Moon Rate, gain 1M€ per step.
        case CardName.LUNA_FIRST_INCORPORATED:
          switch (prelude) {
          case CardName.FIRST_LUNAR_SETTLEMENT:
          case CardName.CORE_MINE:
          case CardName.BASIC_INFRASTRUCTURE:
            result += 1;
            break;
          case CardName.MINING_COMPLEX:
            result += 2;
            break;
          }
          break;

        // When you place an ocean tile, gain 4MC
        case CardName.POLARIS:
          switch (prelude) {
          case CardName.AQUIFER_TURBINES:
          case CardName.POLAR_INDUSTRIES:
            result += 4;
            break;
          case CardName.GREAT_AQUIFER:
            result += 8;
            break;
          }
          break;
        }
      }
      return result;
    },
    getStartingMegacredits() {
      if (this.selectedCorporations.length !== 1) {
        return NaN;
      }
      const corpName = this.selectedCorporations[0];
      const corporation = getCardOrThrow(corpName);
      // The ?? 0 is only because IClientCard applies to _all_ cards.

      let starting = corporation.startingMegaCredits ?? 0;
      const cardCost = corporation.cardCost === undefined ? constants.CARD_COST : corporation.cardCost;
      starting -= this.selectedCards.length * cardCost;
      return starting;
    },
    saveIfConfirmed() {
      const projectCards = this.selectedCards.filter((name) => getCard(name)?.cardType !== CardType.PRELUDE);
      let showAlert = false;
      if (this.preferences.show_alerts && projectCards.length === 0) showAlert = true;
      if (showAlert) {
        this.$refs.confirmation.show();
      } else {
        this.saveData();
      }
    },
    saveData() {
      const result: InputResponse = [];
      result.push([]);
      if (this.selectedCorporations.length === 1) {
        result[0].push(this.selectedCorporations[0]);
      }
      if (this.hasPrelude) {
        result.push(this.selectedPreludes);
      }
      result.push(this.selectedCards);
      this.onsave(result);
    },
    cardsChanged(cards: Array<CardName>) {
      this.selectedCards = cards;
      this.validate();
    },
    corporationChanged(cards: Array<CardName>) {
      this.selectedCorporations = cards;
      this.validate();
    },
    preludesChanged(cards: Array<CardName>) {
      this.selectedPreludes = cards;
      this.validate();
    },
    calcuateWarning(): boolean {
      // Start with warning being empty.
      this.warning = undefined;
      if (this.selectedCorporations.length === 0) {
        this.warning = 'Select a corporation';
        return false;
      }
      if (this.selectedCorporations.length > 1) {
        this.warning = 'You selected too many corporations';
        return false;
      }
      if (this.hasPrelude) {
        if (this.selectedPreludes.length < 2) {
          this.warning = 'Select 2 preludes';
          return false;
        }
        if (this.selectedPreludes.length > 2) {
          this.warning = 'You selected too many preludes';
          return false;
        }
      }
      if (this.selectedCards.length === 0) {
        this.warning = 'You haven\'t selected any project cards';
        return true;
      }
      return true;
    },
    validate() {
      this.valid = this.calcuateWarning();
    },
    confirmSelection() {
      this.saveData();
    },
  },
  computed: {
    playerCanChooseAridor() {
      return this.playerView.dealtCorporationCards.some((card) => card.name === CardName.ARIDOR);
    },
    hasPrelude() {
      return this.playerinput.options?.length === 3;
    },
    corpCardOption() {
      const option = getOption(this.playerinput.options, 0);
      if (getPreferences().experimental_ui) {
        option.min = 1;
        option.max = undefined;
      }
      return option;
    },
    preludeCardOption() {
      const option = getOption(this.playerinput.options, 1);
      if (getPreferences().experimental_ui) {
        option.max = undefined;
      }
      return option;
    },
    projectCardOption() {
      // Compiler won't accept this method using this.hasPrelude, despite documentation saying I can.
      return getOption(this.playerinput.options, this.playerinput.options?.length === 3 ? 2 : 1);
    },
  },
  mounted() {
    this.validate();
  },
});

function getOption(options: Array<PlayerInputModel> | undefined, idx: number): PlayerInputModel {
  const option = options?.[idx];
  if (option === undefined) {
    throw new Error('invalid input, missing option');
  }
  return option;
}
</script>
