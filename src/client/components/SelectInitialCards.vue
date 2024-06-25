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
        <div class="player_home_colony small_colony" v-for="colonyName in playerView.game.discardedColonies" :key="colonyName">
          <colony :colony="getColony(colonyName)"></colony>
        </div>
      </div>
    </div>
    <SelectCard v-if="hasPrelude" :playerView="playerView" :playerinput="preludeCardOption" :onsave="noop" :showtitle="true" v-on:cardschanged="preludesChanged" />
    <SelectCard v-if="hasCeo" :playerView="playerView" :playerinput="ceoCardOption" :onsave="noop" :showtitle="true" v-on:cardschanged="ceosChanged" />
    <SelectCard :playerView="playerView" :playerinput="projectCardOption" :onsave="noop" :showtitle="true" v-on:cardschanged="cardsChanged" />
    <template v-if="this.selectedCorporations.length === 1">
      <div><span v-i18n>Starting Megacredits:</span> <div class="megacredits">{{getStartingMegacredits()}}</div></div>
      <div v-if="hasPrelude"><span v-i18n>After Preludes:</span> <div class="megacredits">{{getStartingMegacredits() + getAfterPreludes()}}</div></div>
    </template>
    <div v-if="warning !== undefined" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>
    <!-- :key=warning is a way of validing that the state of the button should change. If the warning changes, or disappears, that's a signal that the button might change. -->
    <AppButton :disabled="!valid" v-if="showsave" @click="saveIfConfirmed" type="submit" :title="playerinput.buttonLabel"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';

import AppButton from '@/client/components/common/AppButton.vue';
import {getCard, getCardOrThrow} from '@/client/cards/ClientCardManifest';
import {CardName} from '@/common/cards/CardName';
import * as constants from '@/common/constants';
import {PlayerInputModel, SelectCardModel, SelectInitialCardsModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import SelectCard from '@/client/components/SelectCard.vue';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';
import {getPreferences, Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {Tag} from '@/common/cards/Tag';
import {SelectInitialCardsResponse} from '@/common/inputs/InputResponse';
import {CardType} from '@/common/cards/CardType';
import Colony from '@/client/components/colonies/Colony.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {ColonyModel} from '@/common/models/ColonyModel';
import * as titles from '@/common/inputs/SelectInitialCards';
import {sum} from '@/common/utils/utils';

type Refs = {
  confirmation: InstanceType<typeof ConfirmDialog>,
}

type DataModel = {
  selectedCards: Array<CardName>,
  // End result will be a single CEO, but the player may select multiple while deciding what to keep.
  selectedCeos: Array<CardName>,
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
      type: Object as () => SelectInitialCardsModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectInitialCardsResponse) => void,
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
    AppButton,
    SelectCard,
    'confirm-dialog': ConfirmDialog,
    Colony,
  },
  data(): DataModel {
    return {
      selectedCards: [],
      selectedCeos: [],
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
      return sum(this.selectedPreludes.map((prelude) => {
        const card = getCardOrThrow(prelude);
        const base = card.startingMegaCredits ?? 0;
        return base + this.extra(prelude);
      }));
    },
    extra(prelude: CardName): number {
      const card = getCardOrThrow(prelude);
      switch (this.selectedCorporations.length === 1 ? this.selectedCorporations[0] : undefined) {
      // For each step you increase the production of a resource ... you also gain that resource.
      case CardName.MANUTECH:
        return card.productionBox?.megacredits ?? 0;

      // When you place a city tile, gain 3 M€.
      case CardName.THARSIS_REPUBLIC:
        switch (prelude) {
        case CardName.SELF_SUFFICIENT_SETTLEMENT:
        case CardName.EARLY_SETTLEMENT:
        case CardName.STRATEGIC_BASE_PLANNING:
          return 3;
        }
        return 0;

      // When ANY microbe tag is played ... lose 4 M€ or as much as possible.
      case CardName.PHARMACY_UNION:
        const tags = card.tags.filter((tag) => tag === Tag.MICROBE).length;
        return (-4 * tags);

      // when a microbe tag is played, incl. this, THAT PLAYER gains 2 M€,
      case CardName.SPLICE:
        const microbeTags = card.tags.filter((tag) => tag === Tag.MICROBE).length;
        return (2 * microbeTags);

      // Whenever Venus is terraformed 1 step, you gain 2 M€
      case CardName.APHRODITE:
        switch (prelude) {
        case CardName.VENUS_FIRST:
          return 4;
        case CardName.HYDROGEN_BOMBARDMENT:
          return 2;
        }
        return 0;

      // When any player raises any Moon Rate, gain 1M€ per step.
      case CardName.LUNA_FIRST_INCORPORATED:
        switch (prelude) {
        case CardName.FIRST_LUNAR_SETTLEMENT:
        case CardName.CORE_MINE:
        case CardName.BASIC_INFRASTRUCTURE:
          return 1;
        case CardName.MINING_COMPLEX:
          return 2;
        }
        return 0;

      // When you place an ocean tile, gain 4MC
      case CardName.POLARIS:
        switch (prelude) {
        case CardName.AQUIFER_TURBINES:
        case CardName.POLAR_INDUSTRIES:
          return 4;
        case CardName.GREAT_AQUIFER:
          return 8;
        }
        return 0;

      // Gain 2 MC for each project card in hand.
      case CardName.HEAD_START:
        return this.selectedCards.length * 2;

      // Gain 4MC for playing a card with no tags.
      // Gain 1MC for playing a card with 1 tag.
      case CardName.SAGITTA_FRONTIER_SERVICES:
        const count = card.tags.filter((tag) => tag !== Tag.WILD).length;
        return count === 0 ? 4 : count === 1 ? 1 : 0;

      default:
        return 0;
      }
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
      const projectCards = this.selectedCards.filter((name) => getCard(name)?.type !== CardType.PRELUDE);
      let showAlert = false;
      if (this.preferences.show_alerts && projectCards.length === 0) showAlert = true;
      if (showAlert) {
        this.$refs.confirmation.show();
      } else {
        this.saveData();
      }
    },
    saveData() {
      const result: SelectInitialCardsResponse = {
        type: 'initialCards',
        responses: [],
      };

      if (this.selectedCorporations.length === 1) {
        result.responses.push({
          type: 'card',
          cards: [this.selectedCorporations[0]],
        });
      }
      if (this.hasPrelude) {
        result.responses.push({
          type: 'card',
          cards: this.selectedPreludes,
        });
      }
      if (this.hasCeo) {
        result.responses.push({
          type: 'card',
          cards: this.selectedCeos,
        });
      }
      result.responses.push({
        type: 'card',
        cards: this.selectedCards,
      });
      this.onsave(result);
    },

    cardsChanged(cards: Array<CardName>) {
      this.selectedCards = cards;
      this.validate();
    },
    ceosChanged(cards: Array<CardName>) {
      this.selectedCeos = cards;
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
      if (this.hasCeo) {
        if (this.selectedCeos.length < 1) {
          this.warning = 'Select 1 CEO';
          return false;
        }
        if (this.selectedCeos.length > 1) {
          this.warning = 'You selected too many CEOs';
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
    // TODO(kberg): Duplicate of LogPanel.getColony
    getColony(colonyName: ColonyName): ColonyModel {
      return {
        colonies: [],
        isActive: false,
        name: colonyName,
        trackPosition: 0,
        visitor: undefined,
      };
    },
  },
  computed: {
    playerCanChooseAridor() {
      return this.playerView.dealtCorporationCards.some((card) => card.name === CardName.ARIDOR);
    },
    hasPrelude() {
      return hasOption(this.playerinput.options, titles.SELECT_PRELUDE_TITLE);
    },
    hasCeo() {
      return hasOption(this.playerinput.options, titles.SELECT_CEO_TITLE);
    },
    corpCardOption() {
      const option = getOption(this.playerinput.options, titles.SELECT_CORPORATION_TITLE);
      if (getPreferences().experimental_ui) {
        option.min = 1;
        option.max = option.cards.length;
      }
      return option;
    },
    preludeCardOption() {
      const option = getOption(this.playerinput.options, titles.SELECT_PRELUDE_TITLE);
      if (getPreferences().experimental_ui) {
        option.max = option.cards.length;
      }
      return option;
    },
    ceoCardOption() {
      const option = getOption(this.playerinput.options, titles.SELECT_CEO_TITLE);
      if (getPreferences().experimental_ui) {
        option.max = option.cards.length;
      }
      return option;
    },
    projectCardOption() {
      return getOption(this.playerinput.options, titles.SELECT_PROJECTS_TITLE);
    },
  },
  mounted() {
    this.validate();
  },
});

function getOption(options: Array<PlayerInputModel>, title: string): SelectCardModel {
  const option = options.find((option) => option.title === title);
  if (option === undefined) {
    throw new Error('invalid input, missing option');
  }
  if (option.type !== 'card') {
    throw new Error('invalid input, Not a SelectCard option');
  }
  return option;
}

function hasOption(options: Array<PlayerInputModel>, title: string): boolean {
  const option = options.find((option) => option.title === title);
  return option !== undefined;
}
</script>
