<template>
  <div class="card-help" v-show="hovering" @click.stop="open"><a>?</a></div>
  <Teleport to="body">
    <PopupPanel v-if="showPopup" @close="close">
      <template #header>
        <h2>{{ name }}</h2>
      </template>
      <div class="card-help-text" v-html="renderedHelpText"></div>
    </PopupPanel>
  </Teleport>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import MarkdownIt from 'markdown-it';
import {CardName} from '@/common/cards/CardName';
import {CARD_HELP_TEXT} from '@/client/cards/CardHelpText';
import PopupPanel from '@/client/components/common/PopupPanel.vue';

const md = new MarkdownIt({html: true, linkify: false, breaks: false});

export default defineComponent({
  name: 'CardHelp',
  components: {
    PopupPanel,
  },
  props: {
    name: {
      type: String as () => CardName,
      required: true,
    },
    hovering: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showPopup: false,
    };
  },
  computed: {
    renderedHelpText(): string {
      return md.render(CARD_HELP_TEXT[this.name] ?? '');
    },
  },
  methods: {
    open() {
      this.showPopup = true;
    },
    close() {
      this.showPopup = false;
    },
  },
});

</script>
