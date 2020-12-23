import Vue from 'vue';
import {CardRenderSymbolType} from '../../cards/render/CardRenderSymbolType';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItemSize} from '../../cards/render/CardRenderItemSize';

export const CardRenderSymbolComponent = Vue.component('CardRenderSymbolComponent', {
  props: {
    item: {
      type: Object as () => CardRenderSymbol,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const type: CardRenderSymbolType = this.item.type;
      const size: CardRenderItemSize = this.item.size;
      const classes: Array<string> = ['card-special'];
      if (type === CardRenderSymbolType.ASTERIX) {
        classes.push('card-asterix');
      } else if (type === CardRenderSymbolType.MINUS) {
        classes.push('card-minus');
      } else if (type === CardRenderSymbolType.PLUS) {
        classes.push('card-plus');
        if (size === CardRenderItemSize.SMALL) {
          classes.push('card-plus--small');
        }
      } else if (type === CardRenderSymbolType.OR) {
        classes.push('card-or');
        if (size === CardRenderItemSize.SMALL) {
          classes.push('card-or--small');
        }
      } else if (type === CardRenderSymbolType.COLON) {
        classes.push('card-colon');
      } else if (type === CardRenderSymbolType.ARROW) {
        classes.push('card-red-arrow');
      } else if (type === CardRenderSymbolType.NBSP) {
        // TODO (chosta): add size
        classes.push('card-nbsp');
      } else if (type === CardRenderSymbolType.VSPACE) {
        classes.push('card-vspace');
        if (size === CardRenderItemSize.SMALL) {
          classes.push('card-vspace--small');
        } else if (size === CardRenderItemSize.MEDIUM) {
          classes.push('card-vspace--medium');
        } else if (size === CardRenderItemSize.LARGE) {
          classes.push('card-vspace--large');
        }
      } else if (type === CardRenderSymbolType.SLASH) {
        classes.push('card-slash');
      } else if (type === CardRenderSymbolType.EQUALS) {
        classes.push('card-equals');
      }

      return classes.join(' ');
    },
    getContent: function(): string {
      if (this.item.isIcon) {
        return '';
      } else {
        return this.item.type;
      }
    },
  },
  template: `
        <div v-html="getContent()" :class="getClasses()" />
    `,
});
