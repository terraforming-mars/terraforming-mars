<template>
  <div :class="getClasses()">{{ getContent() }}</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderSymbolType} from '@/common/cards/render/CardRenderSymbolType';
import {ICardRenderSymbol} from '@/common/cards/render/Types';
import {Size} from '@/common/cards/render/Size';

const configs: Record<CardRenderSymbolType, {class: string, sizes?: Array<Size>}> = {
  [CardRenderSymbolType.ASTERIX]: {class: 'card-asterix'},
  [CardRenderSymbolType.MINUS]: {class: 'card-minus'},
  [CardRenderSymbolType.PLUS]: {class: 'card-plus', sizes: [Size.SMALL]},
  [CardRenderSymbolType.OR]: {class: 'card-or', sizes: [Size.SMALL, Size.TINY]},
  [CardRenderSymbolType.COLON]: {class: 'card-colon'},
  [CardRenderSymbolType.ARROW]: {class: 'card-arrow', sizes: [Size.SMALL]},
  [CardRenderSymbolType.NBSP]: {class: 'card-nbsp'},
  [CardRenderSymbolType.VSPACE]: {class: 'card-vspace', sizes: [Size.SMALL, Size.MEDIUM, Size.LARGE]},
  [CardRenderSymbolType.SLASH]: {class: 'card-slash', sizes: [Size.SMALL]},
  [CardRenderSymbolType.EQUALS]: {class: 'card-equals'},
  [CardRenderSymbolType.SURVEY_MISSION]: {class: 'card-survey-mission'},
  [CardRenderSymbolType.EMPTY]: {class: ''},
  [CardRenderSymbolType.BRACKET_OPEN]: {class: ''},
  [CardRenderSymbolType.BRACKET_CLOSE]: {class: ''},
};

function sizeToString(size: Size): string {
  switch (size) {
  case Size.TINY: return 'tiny';
  case Size.SMALL: return 'small';
  case Size.MEDIUM: return 'medium';
  case Size.LARGE: return 'large';
  }
}

export default Vue.extend({
  name: 'CardRenderSymbolComponent',
  props: {
    item: {
      type: Object as () => ICardRenderSymbol,
      required: true,
    },
  },
  methods: {
    getClasses(): string {
      const type: CardRenderSymbolType = this.item.type;
      const size: Size = this.item.size;
      const classes: Array<string> = ['card-special'];

      if (type === CardRenderSymbolType.ARROW) {
      // Special-case arrow
        if (size === Size.SMALL) {
          classes.push('card-red-arrow--small');
        } else {
          classes.push('card-red-arrow');
        }
      } else {
        const config = configs[type];
        classes.push(config.class);
        if (config.sizes?.includes(size)) {
          classes.push(`${config.class}--${sizeToString(size)}`);
        }
      }

      return classes.join(' ');
    },
    getContent(): string {
      return this.item.isIcon ? '' : this.item.type;
    },
  },
});

</script>
