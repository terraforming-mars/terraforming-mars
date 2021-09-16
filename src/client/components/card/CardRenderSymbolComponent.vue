<template>
  <div :class="getClasses()">{{ getContent() }}</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderSymbolType} from '@/cards/render/CardRenderSymbolType';
import {CardRenderSymbol} from '@/cards/render/CardRenderSymbol';
import {Size} from '@/cards/render/Size';

export default Vue.extend({
  name: 'CardRenderSymbolComponent',
  props: {
    item: {
      type: Object as () => CardRenderSymbol,
      required: true,
    },
  },
  methods: {
    getClasses(): string {
      const type: CardRenderSymbolType = this.item.type;
      const size: Size = this.item.size;
      const classes: Array<string> = ['card-special'];
      if (type === CardRenderSymbolType.ASTERIX) {
        classes.push('card-asterix');
      } else if (type === CardRenderSymbolType.MINUS) {
        classes.push('card-minus');
      } else if (type === CardRenderSymbolType.PLUS) {
        classes.push('card-plus');
        if (size === Size.SMALL) {
          classes.push('card-plus--small');
        }
      } else if (type === CardRenderSymbolType.OR) {
        classes.push('card-or');
        if (size === Size.SMALL) {
          classes.push('card-or--small');
        }
        if (size === Size.TINY) {
          classes.push('card-or--tiny');
        }
      } else if (type === CardRenderSymbolType.COLON) {
        classes.push('card-colon');
      } else if (type === CardRenderSymbolType.ARROW) {
        if (size === Size.SMALL) {
          classes.push('card-red-arrow--small');
        } else {
          classes.push('card-red-arrow');
        }
      } else if (type === CardRenderSymbolType.NBSP) {
        // TODO (chosta): add size
        classes.push('card-nbsp');
      } else if (type === CardRenderSymbolType.VSPACE) {
        classes.push('card-vspace');
        if (size === Size.SMALL) {
          classes.push('card-vspace--small');
        } else if (size === Size.MEDIUM) {
          classes.push('card-vspace--medium');
        } else if (size === Size.LARGE) {
          classes.push('card-vspace--large');
        }
      } else if (type === CardRenderSymbolType.SLASH) {
        classes.push('card-slash');
      } else if (type === CardRenderSymbolType.EQUALS) {
        classes.push('card-equals');
      }

      return classes.join(' ');
    },
    getContent(): string {
      return this.item.isIcon ? '' : this.item.type;
    },
  },
});

</script>
