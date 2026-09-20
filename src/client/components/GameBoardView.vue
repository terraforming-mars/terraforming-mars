<!-- Common widgets between player and spectator views -->
<template>
  <a name="board" class="player_home_anchor hotkey-target"></a>
  <Board
    :spaces="game.spaces"
    :expansions="game.gameOptions.expansions"
    :venusScaleLevel="game.venusScaleLevel"
    :boardName ="game.gameOptions.boardName"
    :oceans_count="game.oceans"
    :oxygen_level="game.oxygenLevel"
    :temperature="game.temperature"
    :altVenusBoard="game.gameOptions.altVenusBoard"
    :aresData="game.aresData"
    :tileView="tileView"
    @toggleTileView="$emit('toggleTileView')"
    id="shortkey-board"
  />

  <template v-if="game.turmoil">
    <a class="hotkey-target"></a>
    <Turmoil :turmoil="game.turmoil"/>
  </template>

  <template v-if="game.moon">
    <a class="hotkey-target"></a>
    <MoonBoard :model="game.moon" :tileView="tileView" id="shortkey-moonBoard"/>
  </template>

  <template v-if="game.gameOptions.expansions.pathfinders">
    <a class="hotkey-target"></a>
    <PlanetaryTracks :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>
  </template>

  <DeltaProjectBoard v-if="game.gameOptions.expansions.deltaProject" :players="players"/>

  <div v-if="players.length > 1" class="player_home_block--milestones-and-awards">
    <a class="hotkey-target"></a>
    <Milestones :milestones="game.milestones" />
    <Awards :awards="game.awards" />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

import {GameModel} from '@/common/models/GameModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {SpaceId} from '@/common/Types';
import Board from '@/client/components/Board.vue';
import DeltaProjectBoard from '@/client/components/delta/DeltaProjectBoard.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import Turmoil from '@/client/components/turmoil/Turmoil.vue';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import {TileView} from './board/TileView';
import {scrollToSpace} from '@/client/utils/boardScroll';

export default defineComponent({
  name: 'GameBoardView',
  props: {
    game: {
      type: Object as () => GameModel,
      required: true,
    },
    tileView: {
      type: String as () => TileView,
      required: true,
    },
    players: {
      type: Array as PropType<ReadonlyArray<PublicPlayerModel>>,
      required: true,
    },
  },
  emits: ['toggleTileView'],
  components: {
    Board,
    DeltaProjectBoard,
    Milestones,
    Awards,
    Turmoil,
    MoonBoard,
    PlanetaryTracks,
  },
  methods: {
    highlightSpace(spaceId: SpaceId) {
      scrollToSpace(spaceId);

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
  },
});
</script>
