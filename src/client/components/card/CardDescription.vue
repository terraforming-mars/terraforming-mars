<template>
  <div :class="classes">(<span v-i18n>{{ description }}</span>)</div>
</template>

<script lang="ts">

import {defineComponent, PropType} from 'vue';
import {isDescription} from '@/common/cards/render/CardRenderDescription';

export default defineComponent({
  name: 'CardDescription',
  props: {
    item: {
      type: [String, Object] as PropType<unknown>,
      required: true,
    },
  },
  computed: {
    classes(): ReadonlyArray<string> {
      const classes: string[] = ['card-description'];
      if (isDescription(this.item)) {
        if (this.item.align !== 'center') {
          // we want to reduce size for aligned left of right to 60%
          classes.push('card-description-aligned');
        }
        classes.push('card-description-align--' + this.item.align);
      }
      return classes;
    },
    description(): string {
      return isDescription(this.item) ? this.item.text : String(this.item);
    },
  },
});

</script>

