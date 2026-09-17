<template>
  <!-- All cubes share the Martian Nature Wonders artwork -->
  <div
    class="board-space board-space-cube--martian-nature-wonders"
    :title="$t(description)"
    data-test="cube">
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {SpaceCube} from '@/common/boards/SpaceCube';

const descriptions: Record<SpaceCube, string> = {
  'martian-nature-wonders': 'Martian Nature Wonders: nothing may be placed here',
  'rey-skywalker': 'Rey... Skywalker?: nothing may be placed here',
};

export default defineComponent({
  name: 'BoardSpaceCube',
  props: {
    cube: {
      type: String as () => SpaceCube,
      required: true,
    },
  },
  computed: {
    description(): string {
      return descriptions[this.cube];
    },
  },
});

</script>
