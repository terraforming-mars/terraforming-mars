<template>
  <div :class="getClasses()">({{ getDescription() }})</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {isIDescription} from '@/cards/render/ICardRenderDescription';
import {generateClassString} from '@/utils/utils';

export default Vue.extend({
  name: 'CardDescription',
  props: {
    item: {
      required: true,
    },
  },
  methods: {
    getClasses(): string {
      const classes: string[] = ['card-description'];
      if (isIDescription(this.item)) {
        if (this.item.align !== 'center') {
          // we want to reduce size for aligned left of right to 60%
          classes.push('card-description-aligned');
        }
        classes.push('card-description-align--' + this.item.align);
      }
      return generateClassString(classes);
    },
    getDescription(): string {
      return isIDescription(this.item) ? this.item.text : String(this.item);
    },
  },
});

</script>

