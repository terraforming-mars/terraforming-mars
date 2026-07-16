<template>
  <div class="select_space_cont">
    <confirm-dialog
        message="Place your tile here?"
        :enableDontShowAgainCheckbox="true"
        ref="confirmation"
        v-on:accept="confirmPlacement"
        v-on:dismiss="cancelPlacement"
        v-on:hide="hideDialog" />
    <div v-if="showtitle" class="wf-select-space">
      {{ $t(playerinput.title) }}
      <go-to-map :playerinput="playerinput"></go-to-map>
    </div>
    <div v-if="warning" class="nes-container is-rounded">
      <span class="nes-text is-warning" v-i18n>{{ warning }}</span>
      <go-to-map :playerinput="playerinput"></go-to-map>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';
import {SelectSpaceModel} from '@/common/models/PlayerInputModel';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {SelectSpaceResponse} from '@/common/inputs/InputResponse';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';
import GoToMap from '@/client/components/waitingFor/GoToMap.vue';
import {SpaceId} from '@/common/Types';

type Refs = {
  confirmation: InstanceType<typeof ConfirmDialog>,
}

type DataModel = {
  spaces: Set<SpaceId>;
  selectedTile: HTMLElement | undefined,
  spaceId: SpaceId | undefined;
  warning: string | undefined;
};

export default (Vue as WithRefs<Refs>).extend({
  name: 'SelectSpace',
  props: {
    playerinput: {
      type: Object as () => SelectSpaceModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectSpaceResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data(): DataModel {
    return {
      spaces: new Set(this.playerinput.spaces),
      selectedTile: undefined,
      spaceId: undefined,
      warning: undefined,
    };
  },
  components: {
    'confirm-dialog': ConfirmDialog,
    GoToMap,
  },
  methods: {
    animateSpace(tile: Element, activate: boolean) {
      if (activate) {
        tile.classList.add('board-space--available');
      } else {
        tile.classList.remove('board-space--available');
      }
    },
    animateSpaces(tiles: Array<Element>) {
      tiles.forEach((tile: Element) => {
        const spaceId = tile.getAttribute('data_space_id') as SpaceId;
        if (spaceId !== null && this.spaces.has(spaceId)) {
          this.animateSpace(tile, true);
        }
      });
    },
    cancelPlacement() {
      if (this.selectedTile === undefined) {
        throw new Error('unexpected, no tile selected!');
      }
      this.animateSpace(this.selectedTile, false);
      this.animateSpaces(this.getSelectableSpaces());
    },
    confirmPlacement() {
      const tiles = this.getSelectableSpaces();
      tiles.forEach((tile) => {
        tile.onclick = null;
      });

      if (this.selectedTile === undefined) {
        throw new Error('unexpected, no tile selected!');
      }
      const spaceId = this.selectedTile.getAttribute('data_space_id') as SpaceId;
      if (spaceId === null) {
        throw new Error('unexpected, space has no id');
      }
      this.spaceId = spaceId;
      this.selectedTile.classList.add('board-space--selected');
      this.saveData();
    },
    disableAnimation() {
      const tiles = this.getSelectableSpaces();
      tiles.forEach((tile) => {
        tile.classList.remove('board-space--available', 'board-space--selected');
      });
    },
    getSelectableSpaces(): Array<HTMLElement> {
      const spaces: Array<HTMLElement> = [];

      const regions = ['main_board', 'moon_board', 'colony_spaces', 'moon_board_outer_spaces'];
      for (const region of regions) {
        const board = document.getElementById(region);
        if (board !== null) {
          const array = board.getElementsByClassName('board-space-selectable');
          for (let i = 0, length = array.length; i < length; i++) {
            spaces.push(array[i] as HTMLElement);
          }
        }
      }

      return spaces;
    },
    hideDialog(hide: boolean) {
      PreferencesManager.INSTANCE.set('hide_tile_confirmation', hide);
    },
    onTileSelected(tile: HTMLElement) {
      this.selectedTile = tile;
      this.disableAnimation();
      this.animateSpace(tile, true);
      tile.classList.remove('board-space--available');
      const hideTileConfirmation = getPreferences().hide_tile_confirmation;
      if (hideTileConfirmation) {
        this.confirmPlacement();
      } else {
        this.$refs.confirmation.show();
      }
    },
    saveData() {
      if (this.spaceId === undefined) {
        this.warning = 'Must select a space';
        return;
      }
      this.onsave({type: 'space', spaceId: this.spaceId});
    },
  },
  mounted() {
    this.disableAnimation();
    const tiles = this.getSelectableSpaces();
    this.animateSpaces(tiles);
    for (let i = 0, length = tiles.length; i < length; i++) {
      const tile = tiles[i];
      const spaceId = tile.getAttribute('data_space_id') as SpaceId;

      if (spaceId === null || this.spaces.has(spaceId) === false) {
        continue;
      }

      tile.onclick = () => this.onTileSelected(tile);
    }
  },
});

</script>
