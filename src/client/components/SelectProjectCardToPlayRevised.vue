<template>
<div class="payments_cont">

  <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>

  <label v-for="availableCard in cards" class="payments_cards" :key="availableCard.name">
    <input v-if="!availableCard.isDisabled" class="hidden" type="radio" v-model="cardName" :value="availableCard.name" />
    <Card class="cardbox" :card="availableCard" />
  </label>

  <template v-if="card !== undefined && card.additionalProjectCosts">
    <div v-if="card.additionalProjectCosts.aeronGenomicsResources" class="card-warning"
      v-i18n="[$t(card.name), card.additionalProjectCosts.aeronGenomicsResources, 'animals', $t(CardName.AERON_GENOMICS)]"
    >
      Playing ${0} consumes ${1} ${2} from ${3}
    </div>
    <div v-if="card.additionalProjectCosts.thinkTankResources" class="card-warning"
      v-i18n="[$t(card.name), card.additionalProjectCosts.thinkTankResources, 'data', $t(CardName.THINK_TANK)]">
      Playing ${0} consumes ${1} ${2} from ${3}
    </div>
    <div v-if="card.additionalProjectCosts.redsCost" class="card-warning" v-i18n="[$t(card.name), card.additionalProjectCosts.redsCost, $t('Reds')]">
      Playing ${0} will cost ${1} M€ more because ${2} are in power
    </div>
  </template>
  <warnings-component v-if="card !== undefined" :warnings="card.warnings"></warnings-component>

  <PaymentForm
    v-if="showPaymentSection"
    ref="paymentForm"
    :key="cardName"
    :cost="cost"
    :order="order"
    :ledger="ledger"
    :showsave="showsave"
    :buttonLabel="playerinput.buttonLabel"
    @save="saveData">
  </PaymentForm>
</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Payment} from '@/common/inputs/Payment';
import {SpendableResource} from '@/common/inputs/Spendable';
import Card from '@/client/components/card/Card.vue';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {PaymentWidgetMixin} from '@/client/mixins/PaymentWidgetMixinRevised';
import {SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Tag} from '@/common/cards/Tag';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';
import {SelectProjectCardToPlayResponse} from '@/common/inputs/InputResponse';
import WarningsComponent from '@/client/components/WarningsComponent.vue';
import PaymentForm from '@/client/components/PaymentForm.vue';
import {Ledger} from '@/client/components/PaymentLedger';

export default defineComponent({
  name: 'SelectProjectCardToPlayRevised',
  mixins: [PaymentWidgetMixin],
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    playerinput: {
      type: Object as () => SelectProjectCardToPlayModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectProjectCardToPlayResponse) => void,
      required: true,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  computed: {
    order(): ReadonlyArray<SpendableResource> {
      return ([
        'steel',
        'titanium',
        'heat',
        'plants',
        'microbes',
        'floaters',
        'lunaArchivesScience',
        'seeds',
        'graphene',
        'kuiperAsteroids',
        'auroraiData',
        'spireScience',
        'megacredits',
      ] as const).filter(this.canUse);
    },
    ledger(): Ledger {
      return this.buildLedger(this.order, this.reserveUnits);
    },
    CardName(): typeof CardName {
      return CardName;
    },
    showPaymentSection(): boolean {
      return this.card !== undefined && this.card.isDisabled !== true;
    },
  },
  watch: {
    // Vue runs watchers before re-rendering the component that owns them, so
    // available units are updated before PaymentForm remounts via :key and reads them.
    cardName(newVal: string | undefined) {
      if (newVal === undefined) return;
      // TODO(kberg): this stuff is set in data(). Perhaps share the code?
      this.card = this.getCard();
      this.cost = this.card.calculatedCost ?? 0;
      this.tags = this.getCardTags();
      this.reserveUnits = this.card.reserveUnits ?? Units.EMPTY;
      this.updateAvailableUnits();
    },
  },
  data() {
    let card: CardModel | undefined;
    let cards: ReadonlyArray<CardModel> = [];
    if ((this.playerinput?.cards?.length ?? 0) > 0) {
      cards = CardOrderStorage.getOrdered(
        CardOrderStorage.getCardOrder(this.playerView.id),
        this.playerinput.cards,
      );
      card = cards[0];
    }
    return {
      cardName: card?.name,
      card: card,
      reserveUnits: card?.reserveUnits ?? Units.EMPTY,
      cards: cards,
      cost: card?.calculatedCost ?? 0,
      tags: card !== undefined ? getCardOrThrow(card.name).tags : [],
      available: Units.of({}),
    };
  },
  components: {
    Card,
    PaymentForm,
    WarningsComponent,
  },
  created() {
    if (this.cards.length === 0) {
      return;
    }
    this.updateAvailableUnits();
  },
  methods: {
    getCard() {
      const card = this.cards.find((c) => c.name === this.cardName);
      if (card === undefined) {
        throw new Error(`card not found ${this.cardName}`);
      }
      return card;
    },
    getCardTags() {
      // By the time getCardTags is called, this.cardName is defined. This is an
      // unnecessary guard.
      if (this.cardName === undefined) {
        return [];
      }
      return getCardOrThrow(this.cardName).tags;
    },
    updateAvailableUnits() {
      const thisPlayer = this.playerView.thisPlayer;
      this.available.steel = Math.max(thisPlayer.steel - this.reserveUnits.steel, 0);
      this.available.titanium = Math.max(thisPlayer.titanium - this.reserveUnits.titanium, 0);
      this.available.heat = Math.max(this.availableHeat() - this.reserveUnits.heat, 0);
      this.available.plants = Math.max(thisPlayer.plants - this.reserveUnits.plants, 0);
    },
    canUseTitaniumRegularly(): boolean {
      return this.tags.includes(Tag.SPACE) ||
          this.playerView.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY;
    },
    cardCanUse(unit: SpendableResource): boolean {
      if (this.card === undefined) {
        return false;
      }
      const canPayWith = this.card.standardProjectCanPayWith;
      if (canPayWith !== undefined) {
        // Standard project: use explicit payment rules from the server
        switch (unit) {
        case 'megacredits':
          return true;
        // auroraiData and spireScience are always accepted by standard projects
        // (see StandardProjectCard.canPlayOptions.)
        case 'auroraiData':
        case 'spireScience':
          return true;
        case 'heat':
          return this.playerinput.paymentOptions.heat === true;
        case 'steel':
          return canPayWith.steel === true;
        case 'titanium':
          return canPayWith.titanium === true ||
              this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
        case 'seeds':
          return canPayWith.seeds === true;
        case 'kuiperAsteroids':
          return canPayWith.kuiperAsteroids === true;
        case 'plants':
        case 'microbes':
        case 'floaters':
        case 'lunaArchivesScience':
        case 'graphene':
          return false;
        default: throw new Error('Unknown unit ' + unit);
        }
      }
      // Regular project card: tag-based payment rules
      switch (unit) {
      case 'megacredits':
        return true;
      case 'heat':
        return this.playerinput.paymentOptions.heat === true;
      case 'steel':
        return this.tags.includes(Tag.BUILDING) ||
          this.playerView.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY;
      case 'titanium':
        return this.canUseTitaniumRegularly() ||
          this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
      case 'plants':
        return this.tags.includes(Tag.BUILDING) && this.playerinput.paymentOptions.plants === true;
      case 'microbes':
        return this.tags.includes(Tag.PLANT);
      case 'floaters':
        return this.tags.includes(Tag.VENUS);
      case 'lunaArchivesScience':
        return this.tags.includes(Tag.MOON);
      case 'seeds':
        return this.tags.includes(Tag.PLANT);
      case 'graphene':
        return this.tags.includes(Tag.SPACE) ||
            this.tags.includes(Tag.CITY);
      case 'kuiperAsteroids':
      case 'auroraiData':
      case 'spireScience':
        return false;
      default:
        throw new Error('Unknown unit ' + unit);
      }
    },
    canUse(unit: SpendableResource) {
      if (this.card === undefined) {
        return false;
      }
      return this.cardCanUse(unit);
    },
    canUseLunaTradeFederationTitanium(): boolean {
      return this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
    },
    getTitaniumResourceRate(): number {
      const titaniumValue = this.playerView.thisPlayer.titaniumValue;
      if (this.canUseTitaniumRegularly() || this.card?.standardProjectCanPayWith?.titanium === true) {
        return titaniumValue;
      }
      return titaniumValue - 1;
    },
    saveData(payment?: Payment) {
      if (this.card === undefined) return;
      const form = this.$refs.paymentForm as {getPayment: () => Payment} | undefined;
      const resolved = payment ?? form?.getPayment() ?? {...Payment.EMPTY};
      this.onsave({type: 'projectCard', card: this.card.name, payment: resolved});
    },
  },
});
</script>
