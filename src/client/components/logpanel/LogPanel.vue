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
      <div id="logpanel-scrollable" class="panel-body">
        <LogMessageComponent v-for="(message, index) in messages" :key="index" :message="message" :viewModel="viewModel" @click="messageClicked(message)" @spaceClicked="spaceClicked"/>
      </div>
      <div class='debugid'>(debugid {{step}})</div>
    </div>
    <CardPanel v-if="selectedMessage !== undefined" :message="selectedMessage" :players="viewModel.players" @hide="selectedMessage = undefined"/>
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
import {SpaceId} from '@/common/Types';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import CardPanel from '@/client/components/logpanel/CardPanel.vue';
import LogGenerationList from '@/client/components/logpanel/LogGenerationList.vue';
import {isMarsSpace} from '@/common/boards/spaces';
import {fetchLogs} from '@/client/utils/fetchLogs';

type LogPanelModel = {
  messages: Array<LogMessage>,
  selectedGeneration: number,
  selectedMessage: LogMessage | undefined,
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
      selectedMessage: undefined,
    };
  },
  components: {
    LogMessageComponent,
    CardPanel,
    LogGenerationList,
  },
  methods: {
    messageClicked(message: LogMessage) {
      this.selectedMessage = message;
    },
    spaceClicked(spaceId: SpaceId) {
      const id = isMarsSpace(spaceId) ? 'shortkey-board' : 'shortkey-moonBoard';
      const el = document.getElementById(id);
      el?.scrollIntoView({block: 'center', inline: 'center', behavior: 'auto'});

      const regions = ['main_board', 'moon_board', 'moon_board_outer_spaces'];
      for (const region of regions) {
        const board = document.getElementById(region);
        if (board !== null) {
          const array = board.getElementsByClassName('board-log-highlight');
          for (let i = 0, length = array.length; i < length; i++) {
            const element = array[i] as HTMLElement;
            if (element.getAttribute('data_log_highlight_id') === spaceId) {
              element.classList.add('highlight');
              setTimeout(() => {
                element.classList.remove('highlight');
              }, 3000);
              return;
            }
          }
        }
      }
    },
    selectGeneration(selected: number): void {
      if (selected !== this.selectedGeneration) {
        this.selectedGeneration = selected;
        this.getLogsForGeneration(selected);
      }
    },
    getLogsForGeneration(generation: number): void {
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
          if (generation === this.viewModel.game.generation) {
            this.$nextTick(this.scrollToEnd);
          }
        });
    },
    scrollToEnd() {
      const scrollablePanel = document.getElementById('logpanel-scrollable');
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
      }
    },
  },
  computed: {
    lastSoloGeneration(): number | undefined {
      return this.viewModel.players.length === 1 ? this.viewModel.game.lastSoloGeneration : undefined;
    },
    titleClasses(): string {
      const classes = ['log-title'];
      classes.push(playerColorClass(this.color, 'shadow'));
      return classes.join(' ');
    },
  },
  mounted() {
    this.selectedGeneration = -1;
    this.selectGeneration(this.viewModel.game.generation);
  },
});

</script>
