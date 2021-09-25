<template>
  <div>
    <confirm-dialog
        message="Place your tile here?"
        :enableDontShowAgainCheckbox="true"
        ref="confirmation"
        v-on:accept="confirmPlacement"
        v-on:dismiss="cancelPlacement"
        v-on:hide="hideDialog" />
    <div v-if="showtitle" class="wf-select-space">{{ $t(playerinput.title) }}</div>
    <div v-if="warning" class="nes-container is-rounded"><span class="nes-text is-warning">{{ warning }}</span></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'SelectSpace',
  props: {
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      availableSpaces: new Set(this.playerinput.availableSpaces),
      selectedTile: undefined as HTMLElement | undefined,
      spaceId: undefined,
      warning: undefined,
    };
  },
  components: {
    'confirm-dialog': ConfirmDialog,
  },
  methods: {
    animateSpace(tile: Element, activate: boolean) {
      if (activate) {
        tile.classList.add('board-space--available');
      } else {
        tile.classList.remove('board-space--available');
      }
    },
    animateAvailableSpaces(tiles: Array<Element>) {
      tiles.forEach((tile: Element) => {
        const spaceId = tile.getAttribute('data_space_id');
        if (spaceId !== null && this.availableSpaces.has(spaceId)) {
          this.animateSpace(tile, true);
        }
      });
    },
    cancelPlacement() {
      if (this.selectedTile === undefined) {
        throw new Error('unexpected, no tile selected!');
      }
      this.animateSpace(this.selectedTile, false);
      this.animateAvailableSpaces(this.getSelectableSpaces());
    },
    confirmPlacement() {
      const tiles = this.getSelectableSpaces();
      tiles.forEach((tile: Element) => {
        (tile as HTMLElement).onclick = null;
      });

      if (this.selectedTile === undefined) {
        throw new Error('unexpected, no tile selected!');
      }
      this.$data.spaceId = this.selectedTile.getAttribute('data_space_id');
      this.selectedTile.classList.add('board-space--selected');
      this.saveData();
    },
    disableAvailableSpaceAnimation() {
      const tiles = this.getSelectableSpaces();
      tiles.forEach((tile: Element) => {
        tile.classList.remove('board-space--available', 'board-space--selected');
      });
    },
    getSelectableSpaces() {
      const spaces: Array<Element> = [];

      let board = document.getElementById('main_board');
      if (board !== null) {
        const array = board.getElementsByClassName('board-space-selectable');
        for (let i = 0, length = array.length; i < length; i++) {
          spaces.push(array[i]);
        }
      }

      board = document.getElementById('moon_board');
      if (board !== null) {
        const array = board.getElementsByClassName('board-space-selectable');
        for (let i = 0, length = array.length; i < length; i++) {
          spaces.push(array[i]);
        }
      }

      return spaces;
    },
    hideDialog(hide: boolean) {
      PreferencesManager.save('hide_tile_confirmation', hide);
    },
    onTileSelected(tile: HTMLElement) {
      this.selectedTile = tile;
      this.disableAvailableSpaceAnimation();
      this.animateSpace(tile, true);
      tile.classList.remove('board-space--available');
      const hideTileConfirmation = PreferencesManager.loadBoolean('hide_tile_confirmation');
      if (hideTileConfirmation) {
        this.confirmPlacement();
      } else {
        (this.$refs['confirmation'] as any).show();
      }
    },
    saveData() {
      if (this.$data.spaceId === undefined) {
        this.$data.warning = 'Must select a space';
        return;
      }
      this.onsave([[this.$data.spaceId]]);
    },
  },
  mounted() {
    this.disableAvailableSpaceAnimation();
    const tiles = this.getSelectableSpaces();
    this.animateAvailableSpaces(tiles);
    for (let i = 0, length = tiles.length; i < length; i++) {
      const tile: HTMLElement = tiles[i] as HTMLElement;
      const spaceId = tile.getAttribute('data_space_id');
      if (spaceId === null || this.availableSpaces.has(spaceId) === false) {
        continue;
      };

      tile.onclick = () => this.onTileSelected(tile);
    }
  },
});

</script>
