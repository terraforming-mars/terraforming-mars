<template>
  <div :class="outerClass">
    <underground-token v-if="claimedToken !== undefined" :token="claimedToken" location="tag-count"/>
    <Tag v-else :tag="(tag as CardTag)" :size="size" :type="type"/>
    <span :class="innerClass">{{ count }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from 'vue';
import Tag from '@/client/components/Tag.vue';
import UndergroundToken from '@/client/components/underworld/UndergroundToken.vue';
import {Tag as CardTag} from '@/common/cards/Tag';
import {SpecialTags} from '@/client/cards/SpecialTags';
import {TemporaryBonusToken} from '@/common/underworld/UndergroundResourceToken';
import {ClaimedToken} from '@/common/underworld/UnderworldPlayerData';

// Display-only tags used in PlayerTags for overview counts.
type DisplayTag = 'vp' | 'tr' | 'handicap' | 'cards' | 'escape';

export default defineComponent({
  name: 'tag-count',
  props: {
    tag: {
      type: String as () => CardTag | SpecialTags | DisplayTag,
      required: true,
    },
    undergroundToken: {
      type: String as () => TemporaryBonusToken | undefined,
      required: false,
      default: undefined,
    },
    count: {
      type: [Number, String] as PropType<number | string>,
    },
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    showWhenZero: {
      // When true, show even if the value is zero.
      required: false,
      default: false,
    },
  },
  components: {
    Tag,
    UndergroundToken,
  },
  computed: {
    outerClass(): string {
      const classes = ['tag-display'];
      if (this.count === 0 && this.showWhenZero === false) {
        classes.push('tag-no-show');
      }
      return classes.join(' ');
    },
    innerClass(): string {
      const classes = ['tag-count-display'];
      if (this.count === 0 && this.showWhenZero === false) {
        classes.push('tag-count-no-show');
      }

      return classes.join(' ');
    },
    claimedToken(): ClaimedToken | undefined {
      if (this.undergroundToken === undefined) {
        return undefined;
      }
      return {token: this.undergroundToken, shelter: false, active: true};
    },

  },
});
</script>

