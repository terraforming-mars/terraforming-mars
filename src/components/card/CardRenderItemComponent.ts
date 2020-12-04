import Vue from 'vue';
import {generateClassString} from '../../utils/utils';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderItemType} from '../../cards/render/CardRenderItemType';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItemSize} from '../../cards/render/CardRenderItemSize';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';

// microbe, animal and plant tag could be used both as a resource and played tag
const RESOURCE_AND_TAG_TYPES = [CardRenderItemType.ANIMALS, CardRenderItemType.PLANTS, CardRenderItemType.MICROBES];

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
      let classes: Array<string> = [];
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
        if (this.item.size !== undefined) {
          classes.push(`card-ocean--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.GREENERY) {
        classes.push('card-global-requirement');
        classes.push('card-greenery-global-requirement');
        if (this.item.size !== undefined) {
          classes.push(`card-greenery--${this.item.size}`);
        }
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
      } else if (type === CardRenderItemType.WILD) {
        classes.push('card-resource');
        classes.push('card-resource-wild');
      } else if (type === CardRenderItemType.TRADE) {
        classes.push('card-resource-trade');
      } else if (type === CardRenderItemType.COLONIES) {
        classes.push('card-resource-colony');
        // TODO (chosta): think about an abstraction for item size
        if (this.item.size === CardRenderItemSize.SMALL) {
          classes.push('card-resource-colony-S');
        }
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
      } else if (type === CardRenderItemType.NO_TAGS) {
        classes.push('card-resource-tag');
        classes.push('card-community-services');
      } else if (type === CardRenderItemType.CITY) {
        classes.push('card-tile');
        classes.push(`city-tile--${this.item.size}`);
      } else if (type === CardRenderItemType.EMPTY_TILE) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--empty-tile');
      }

      // round tags
      if (this.item.isPlayed) {
        // override resource behavior
        if (RESOURCE_AND_TAG_TYPES.includes(type)) {
          classes = classes.filter((c) => c !== 'card-resource');
        }
        classes.push('card-resource-tag');
        if (type === CardRenderItemType.EVENT) {
          classes.push('card-tag-event');
        } else if (type === CardRenderItemType.SPACE) {
          classes.push('card-tag-space');
        } else if (type === CardRenderItemType.SCIENCE) {
          classes.push('card-tag-science');
        } else if (type === CardRenderItemType.JOVIAN) {
          classes.push('card-tag-jovian');
        } else if (type === CardRenderItemType.VENUS) {
          classes.push('card-tag-venus');
        } else if (type === CardRenderItemType.EARTH) {
          classes.push('card-tag-earth');
        }
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
      let result: string = '';
      // in case of symbols inside
      if (this.item instanceof CardRenderItem && this.item.amountInside) {
        result += this.item.amount.toString();
        if (this.item.multiplier) {
          result += 'X';
        }
      }
      if (this.item.secondaryTag !== undefined) {
        const classes: string[] = ['card-icon'];
        classes.push(`tag-${this.item.secondaryTag}`);
        result += '<div class="' + generateClassString(classes) + '"></div>';
      }
      if (this.item.isPlate || this.item.text !== undefined) {
        result += this.item.text || 'n/a';
      }
      if (this.item.type === CardRenderItemType.NO_TAGS) {
        result = 'X';
      }
      return result;
    },
  },
  template: `
        <div class="card-item-container">
            <div class="card-res-amount" v-if="item.showDigit">{{ getAmountAbs() }}</div>
            <div :class="getComponentClasses()" v-for="index in itemsToShow()" v-html="itemHtmlContent()" :key="index"/>
        </div>
    `,
});
