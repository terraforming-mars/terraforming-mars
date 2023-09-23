<template>
  <div :class="classes"></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameModule} from '@/common/cards/GameModule';

const MODULE_TO_CSS: Omit<Record<GameModule, string>, 'base'> = {
  'corpera': 'corporate-icon',
  'promo': 'promo-icon',
  'venus': 'venus-icon',
  'colonies': 'colonies-icon',
  'prelude': 'prelude-icon',
  'prelude2': 'prelude2-icon',
  'turmoil': 'turmoil-icon',
  'community': 'community-icon',
  'ares': 'ares-icon',
  'moon': 'moon-icon',
  'pathfinders': 'pathfinders-icon',
  'ceo': 'ceo-icon',
  'starwars': 'starwars-icon',
};

export default Vue.extend({
  name: 'CardExpansion',
  props: {
    expansion: {
      type: String as () => GameModule,
      required: true,
    },
    isCorporation: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    classes(): string {
      const classes = ['card-expansion', 'project-icon'];
      if (this.expansion !== 'base') {
        classes.push(MODULE_TO_CSS[this.expansion]);
      }
      if (this.isCorporation) {
        classes.push('card-corporation-expansion');
      }

      return classes.join(' ');
    },
  },
});

</script>

