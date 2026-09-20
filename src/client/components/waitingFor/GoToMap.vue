<template>
  <span class="gotomap_cont">
    &nbsp;&nbsp;<span @click="onclick" v-i18n>go to map</span>
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {SelectSpaceModel} from '@/common/models/PlayerInputModel';
import {scrollToSpace} from '@/client/utils/boardScroll';

export default defineComponent({
  name: 'GoToMap',
  props: {
    playerinput: {
      type: Object as () => SelectSpaceModel,
      required: true,
    },
  },
  methods: {
    onclick(event: MouseEvent) {
      if (scrollToSpace(this.playerinput.spaces?.[0] ?? '00') !== null) {
        event.preventDefault();
      }
    },
  },
});

</script>
