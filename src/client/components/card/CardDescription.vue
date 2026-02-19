<template>
  <div :class="classes" v-i18n>({{ description }})</div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {isIDescription} from '@/common/cards/render/ICardRenderDescription';

export default defineComponent({
  name: 'CardDescription',
  props: {
    item: {
      required: true,
    },
  },
  computed: {
    classes(): ReadonlyArray<string> {
      const classes: string[] = ['card-description'];
      if (isIDescription(this.item)) {
        if (this.item.align !== 'center') {
          // we want to reduce size for aligned left of right to 60%
          classes.push('card-description-aligned');
        }
        classes.push('card-description-align--' + this.item.align);
      }
      return classes;
    },
    description(): string {
      return isIDescription(this.item) ? this.item.text : String(this.item);
    },
  },
});

</script>

