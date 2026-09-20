<template>
  <div class="log-container">
    <LogGenerationList
      :max="viewModel.game.generation"
      :selected="selectedGeneration"
      :lastSoloGeneration="lastSoloGeneration"
      @selected="selectGeneration">
      <template #title>
        <h2 :class="titleClasses">
          <span v-i18n>Game log</span>
        </h2>
      </template>
    </LogGenerationList>
    <div class="panel log-panel">
      <div id="logpanel-scrollable" class="panel-body" @scroll="updateScrollState">
        <LogMessageComponent v-for="(message, index) in messages" :key="index" :message="message" :viewModel="viewModel" @click="messageClicked(message)" @spaceClicked="$emit('spaceClicked', $event)"/>
      </div>
      <button
        v-show="showScrollToBottomButton"
        type="button"
        class="log-latest-button"
        aria-label="Latest logs"
        title="Latest logs"
        data-test="log-latest"
        @click="showLatestLogs"
      >
        <svg class="log-latest-button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </button>
      <div class='debugid'>(debugid {{step}})</div>
    </div>
    <LogMessageInspector ref="messageInspector" :viewModel="viewModel"/>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {LogMessage} from '@/common/logs/LogMessage';
import {ViewModel} from '@/common/models/PlayerModel';
import {playerColorClass} from '@/common/utils/utils';
import {Color} from '@/common/Color';
import {SoundManager} from '@/client/utils/SoundManager';
import {getPreferences} from '@/client/utils/PreferencesManager';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import LogMessageInspector from '@/client/components/logpanel/LogMessageInspector.vue';
import LogGenerationList from '@/client/components/logpanel/LogGenerationList.vue';
import {fetchLogs} from '@/client/utils/fetchLogs';

const BOTTOM_SCROLL_THRESHOLD = 24; // Roughly one line of log text.

type ScrollPosition = number | 'bottom';

type ViewState = {
  // The current generation viewed in the log panel, which might be different
  // from the current generation in the game.
  selectedGeneration: number,
  // True if the player was viewing the newest generation, and so should be moved
  // forward to whatever generation is newest after a remount.
  following: boolean,
  // Either 'bottom' which means continue scrolling as new entries appear,
  // or a number which is the pixel height from the top of the widget.
  scrollPosition: ScrollPosition,
};

let viewState: ViewState | undefined;

type Refs = {
  messageInspector: InstanceType<typeof LogMessageInspector>;
};

type LogPanelModel = {
  messages: Array<LogMessage>,
  selectedGeneration: number,
  showScrollToBottomButton: boolean,
  // True while the panel should keep following the newest generation as it changes.
  // False once the player manually navigates to an earlier generation.
  following: boolean,
};

export default defineComponent({
  name: 'LogPanel',
  props: {
    viewModel: {
      type: Object as () => ViewModel,
      required: true,
    },
    color: {
      type: String as () => Color,
      required: true,
    },
    step: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data(): LogPanelModel {
    return {
      messages: [],
      selectedGeneration: -1,
      showScrollToBottomButton: false,
      following: true,
    };
  },
  components: {
    LogMessageComponent,
    LogMessageInspector,
    LogGenerationList,
  },
  emits: ['spaceClicked'],
  methods: {
    messageClicked(message: LogMessage) {
      this.typedRefs.messageInspector.show(message);
    },
    selectGeneration(gen: number): void {
      this.following = gen === this.generation;
      if (gen !== this.selectedGeneration) {
        this.getLogsForGeneration(gen, gen === this.generation ? 'bottom' : undefined);
      }
      this.selectedGeneration = gen;
    },
    showLatestLogs(): void {
      this.following = true;
      this.selectedGeneration = this.generation;
      this.getLogsForGeneration(this.generation, 'bottom');
    },
    getLogsForGeneration(generation: number, scrollPosition?: ScrollPosition): void {
      const messages = this.messages;
      fetchLogs(this.viewModel.id, generation)
        .then((data) => {
          if (!data) {
            return;
          }
          messages.length = 0;
          messages.push(...data);
          if (getPreferences().enable_sounds && window.location.search.includes('experimental=1') ) {
            SoundManager.newLog();
          }
          if (scrollPosition === 'bottom') {
            this.$nextTick(this.scrollToEnd);
          } else if (scrollPosition !== undefined) {
            this.$nextTick(() => this.restoreScrollTop(scrollPosition));
          }
        });
    },
    scrollToEnd() {
      const scrollablePanel = this.scrollablePanel;
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
        this.updateScrollState();
      }
    },
    restoreScrollTop(scrollTop: number) {
      const scrollablePanel = this.scrollablePanel;
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollTop;
        this.updateScrollState();
      }
    },
    updateScrollState(): void {
      this.showScrollToBottomButton = !this.isNearBottom();
    },
    isNearBottom(): boolean {
      const scrollablePanel = this.scrollablePanel;
      if (scrollablePanel === null) {
        return true;
      }
      const remaining = scrollablePanel.scrollHeight - scrollablePanel.clientHeight - scrollablePanel.scrollTop;
      return remaining <= BOTTOM_SCROLL_THRESHOLD;
    },
  },
  computed: {
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
    },
    generation(): number {
      return this.viewModel.game.generation;
    },
    lastSoloGeneration(): number | undefined {
      return this.viewModel.players.length === 1 ? this.viewModel.game.lastSoloGeneration : undefined;
    },
    titleClasses(): string {
      const classes = ['log-title'];
      classes.push(playerColorClass(this.color, 'shadow'));
      return classes.join(' ');
    },
    scrollablePanel(): HTMLElement | null {
      return document.getElementById('logpanel-scrollable');
    },
  },
  mounted() {
    const restoredState = viewState;
    if (restoredState !== undefined && restoredState.following === false) {
      this.following = false;
      this.selectedGeneration = restoredState.selectedGeneration;
      this.getLogsForGeneration(this.selectedGeneration, restoredState.scrollPosition);
    } else {
      // Either this is the first mount, or the panel was following the newest
      // generation, which may have advanced since the previous instance unmounted.
      this.following = true;
      this.selectedGeneration = this.generation;
      this.getLogsForGeneration(this.selectedGeneration, 'bottom');
    }
  },
  beforeUnmount() {
    viewState = {
      selectedGeneration: this.selectedGeneration,
      following: this.following,
      scrollPosition: this.isNearBottom() ? 'bottom' : this.scrollablePanel?.scrollTop ?? 'bottom',
    };
  },
});

</script>
