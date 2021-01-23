import Vue from 'vue';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {TranslateMixin} from './TranslateMixin';
import {PreferencesManager} from './PreferencesManager';

const dialogPolyfill = require('dialog-polyfill');

export const SelectSpace = Vue.component('select-space', {
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
  data: function() {
    return {
      availableSpaces: new Set(this.playerinput.availableSpaces),
      selectedTile: undefined as HTMLElement | undefined,
      spaceId: undefined,
      warning: undefined,
    };
  },
  mixins: [TranslateMixin],
  methods: {
    animateSpace: function(tile: Element, activate: boolean) {
      if (activate) {
        tile.classList.add('board-space--available');
      } else {
        tile.classList.remove('board-space--available');
      }
    },
    animateAvailableSpaces: function(tiles: HTMLCollectionOf<Element>) {
      for (let i = 0, length = tiles.length; i < length; i++) {
        const tile: Element = tiles[i];
        const spaceId = tile.getAttribute('data_space_id');
        if (spaceId !== null && this.availableSpaces.has(spaceId)) {
          this.animateSpace(tile, true);
        }
      }
    },
    cancelPlacement: function() {
      if (this.selectedTile === undefined) {
        throw new Error('unexpected, no tile selected!');
      }
      this.animateSpace(this.selectedTile, false);
      this.animateAvailableSpaces(this.getSelectableSpaces());
    },
    confirmPlacement: function() {
      const tiles = this.getSelectableSpaces();
      for (let i = 0, length = tiles.length; i < length; i++) {
        (tiles[i] as HTMLElement).onclick = null;
      }
      if (this.selectedTile === undefined) {
        throw new Error('unexpected, no tile selected!');
      }
      this.$data.spaceId = this.selectedTile.getAttribute('data_space_id');
      this.selectedTile.classList.add('board-space--selected');
      this.saveData();
    },
    disableAvailableSpaceAnimation: function() {
      const tiles = this.getSelectableSpaces();
      for (let i = 0, length = tiles.length; i < length; i++) {
        tiles[i].classList.remove('board-space--available', 'board-space--selected');
      }
    },
    getSelectableSpaces: function() {
      const board = document.getElementById('main_board');
      if (board !== null) {
        return board.getElementsByClassName('board-space-selectable');
      }
      throw new Error('main board not found!');
    },
    onTileSelected: function(tile: HTMLElement) {
      this.selectedTile = tile;
      this.disableAvailableSpaceAnimation();
      this.animateSpace(tile, true);
      tile.classList.remove('board-space--available');
      const hideTileConfirmation = PreferencesManager.loadValue('hide_tile_confirmation') === '1';
      if (hideTileConfirmation) {
        this.confirmPlacement();
      } else {
        (document.getElementById('dialog-confirm-tile') as HTMLDialogElement).showModal();
      }
    },
    saveData: function() {
      if (this.$data.spaceId === undefined) {
        this.$data.warning = 'Must select a space';
        return;
      }
      this.onsave([[this.$data.spaceId]]);
    },
  },
  mounted: function() {
    dialogPolyfill.default.registerDialog(
      document.getElementById('dialog-confirm-tile'),
    );
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
  template: `<div>
    <section>
      <dialog id="dialog-confirm-tile">
        <form method="dialog">
          <p v-i18n>Place your tile here?</p>
          <p v-i18n>(This confirmation can be disabled in preferences).</p>
          <menu class="dialog-menu centered-content">
            <button class="btn btn-lg btn-primary" v-on:click="confirmPlacement()">Ok</button>
            <button class="btn btn-lg" v-on:click="cancelPlacement()">Cancel</button>
          </menu>
        </form>
      </dialog>
    </section>
    <div v-if="showtitle" class="wf-select-space">{{ $t(playerinput.title) }}</div>
    <div v-if="warning" class="nes-container is-rounded"><span class="nes-text is-warning">{{ warning }}</span></div>
  </div>`,
});

