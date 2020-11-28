import Vue from 'vue';
import {generateClassString} from '../../utils/utils';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderItemType} from '../../cards/render/CardRenderItemType';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';

export const CardRenderItemComponent = Vue.component('CardRenderItemComponent', {
  props: {
    item: {
      type: Object as () => CardRenderItem,
    },
  },
  components: {
    CardRenderSymbolComponent,
  },
  methods: {
    getComponentClasses: function(): string {
      const classes: Array<string> = [''];
      const type: CardRenderItemType = this.item.type;
      if (type === CardRenderItemType.TEMPERATURE) {
        classes.push('card-global-requirement');
        classes.push('card-temperature-global-requirement');
      } else if (type === CardRenderItemType.OXYGEN) {
        classes.push('card-global-requirement');
        classes.push('card-oxygen-global-requirement');
      } else if (type === CardRenderItemType.OCEANS) {
        classes.push('card-global-requirement');
        classes.push('card-ocean-global-requirement');
      } else if (type === CardRenderItemType.VENUS) {
        classes.push('card-global-requirement');
        classes.push('card-venus-global-requirement');
      } else if (type === CardRenderItemType.TR) {
        classes.push('card-tile');
        classes.push('card-tr');
      } else if (type === CardRenderItemType.TITANIUM) {
        classes.push('card-resource');
        classes.push('card-resource-titanium');
      } else if (type === CardRenderItemType.STEEL) {
        classes.push('card-resource');
        classes.push('card-resource-steel');
      } else if (type === CardRenderItemType.HEAT) {
        classes.push('card-resource');
        classes.push('card-resource-heat');
      } else if (type === CardRenderItemType.ENERGY) {
        classes.push('card-resource');
        classes.push('card-resource-energy');
      } else if (type === CardRenderItemType.PLANTS) {
        classes.push('card-resource');
        classes.push('card-resource-plant');
      } else if (type === CardRenderItemType.MEGACREDITS) {
        classes.push('card-resource');
        classes.push('card-resource-money');
      } else if (type === CardRenderItemType.CARDS) {
        classes.push('card-resource');
        classes.push('card-card');
      } else if (type === CardRenderItemType.FLOATERS) {
        classes.push('card-resource');
        classes.push('card-resource-floater');
      } else if (type === CardRenderItemType.ASTEROIDS) {
        classes.push('card-resource');
        classes.push('card-resource-asteroid');
      } else if (type === CardRenderItemType.MICROBES) {
        classes.push('card-resource');
        classes.push('card-resource-microbe');
      } else if (type === CardRenderItemType.ANIMALS) {
        classes.push('card-resource');
        classes.push('card-resource-animal');
      } else if (type === CardRenderItemType.TRADE) {
        classes.push('card-resource-trade');
      } else if (type === CardRenderItemType.TRADE_DISCOUNT) {
        classes.push('card-resource');
        classes.push('card-resource-trade-discount');
      } else if (type === CardRenderItemType.TRADE_FLEET) {
        classes.push('card-resource-trade-fleet');
      } else if (type === CardRenderItemType.CHAIRMAN) {
        classes.push('card-chairman');
      } else if (type === CardRenderItemType.PARTY_LEADERS) {
        classes.push('card-party-leader');
      } else if (type === CardRenderItemType.DELEGATES) {
        classes.push('card-delegate');
      } else if (type === CardRenderItemType.INFLUENCE) {
        classes.push('card-influence');
      } else if (type === CardRenderItemType.CITY) {
        classes.push('card-tile');
        classes.push(`city-tile--${this.item.size}`);
      } else if (type === CardRenderItemType.EVENT) {
        classes.push('card-tag-event');
      } else if (type === CardRenderItemType.SPACE) {
        classes.push('card-tag-space');
      } else if (type === CardRenderItemType.JOVIAN) {
        classes.push('card-tag-jovian');
      } else if (type === CardRenderItemType.VENUS_TAG) {
        classes.push('card-tag-venus');
      }
      // round tags
      if (this.item.isPlayed) {
        classes.push('card-resource-tag');
      }

      // act upon any player
      if (this.item.anyPlayer === true) {
        if (type === CardRenderItemType.DELEGATES) {
          classes.push('card-delegate-red');
        } else {
          classes.push('red-outline');
        }
      }

      // golden background
      if (this.item.isPlate) {
        classes.push('card-plate');
      }

      // size and text
      if (this.item.text !== undefined) {
        classes.push(`card-text-size--${this.item.size}`);
        if (this.item.isUppercase) {
          classes.push('card-text-uppercase');
        }
      }

      return generateClassString(classes);
    },
    getAmountAbs: function(): number {
      if (this.item.amountInside) return 1;
      return Math.abs(this.item.amount);
    },
    getMinus: function(): CardRenderSymbol {
      return CardRenderSymbol.minus();
    },
    itemsToShow: function(): number {
      if (this.item.showDigit) return 1;
      return this.getAmountAbs();
    },
    itemHtmlContent: function(): string {
      // in case of symbols inside
      if (this.item instanceof CardRenderItem && this.item.amountInside) return this.item.amount.toString();
      if (this.item.isPlate || this.item.text !== undefined) return this.item.text || 'n/a';
      if (this.item.secondaryTag !== undefined) {
        const classes: string[] = ['card-icon'];
        classes.push(`tag-${this.item.secondaryTag}`);
        return '<div class="' + generateClassString(classes) + '"/>';
      }
      return '';
    },
  },
  template: `
        <div class="card-item-container">
            <div class="card-res-amount" v-if="item.showDigit">{{ getAmountAbs() }}</div>
            <div :class="getComponentClasses()" v-for="index in itemsToShow()" v-html="itemHtmlContent()" :key="index"/>
        </div>
    `,
});
