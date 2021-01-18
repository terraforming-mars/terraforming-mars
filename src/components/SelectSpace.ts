import Vue, {VNode} from 'vue';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {$t} from '../directives/i18n';
import {SpaceId} from '../boards/ISpace';
import {PreferencesManager} from './PreferencesManager';

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
      spaceId: undefined,
      warning: undefined,
    };
  },
  methods: {
    saveData: function() {
      if (this.$data.spaceId === undefined) {
        this.$data.warning = 'Must select a space';
        return;
      }
      this.onsave([[this.$data.spaceId]]);
    },
  },
  mounted: function() {
    const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
    const setOfSpaces: {[x: string]: boolean} = {};

    if (playerInput.availableSpaces !== undefined) {
      playerInput.availableSpaces.forEach((spaceId: SpaceId) => {
        setOfSpaces[spaceId] = true;
      });
    }

    const disableAvailableSpaceAnimation = function() {
      const tiles = document.getElementsByClassName('board-space-selectable');
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].classList.remove('board-space--available');
        tiles[i].classList.remove('board-space--selected');
      }
    };

    const animateSpace = function(tile: Element, activate: boolean) {
      if (activate) {
        tile.classList.add('board-space--available');
      } else {
        tile.classList.remove('board-space--available');
      }
    };

    const animateAvailableSpaces = function(tiles: HTMLCollectionOf<Element>) {
      for (let i = 0; i < tiles.length; i++) {
        const tile: Element = tiles[i];
        const spaceId = tile.getAttribute('data_space_id');
        if (spaceId !== null && setOfSpaces[spaceId] === true) {
          animateSpace(tile, true);
        }
      }
    };

    const confirm = function() {
      const hideTileConfirmation = PreferencesManager.loadValue('hide_tile_confirmation') === '1';
      if (hideTileConfirmation) {
        return true;
      }
      return window.confirm('Place your tile here?\n\n(This confirmation can be disabled in preferences).');
    };

    {
      disableAvailableSpaceAnimation();
      const tiles = document.getElementsByClassName('board-space-selectable');
      animateAvailableSpaces(tiles);
      for (let i = 0; i < tiles.length; i++) {
        const tile: HTMLElement = tiles[i] as HTMLElement;
        const spaceId = tile.getAttribute('data_space_id');
        if (spaceId === null || setOfSpaces[spaceId] !== true) {
          continue;
        };

        tile.onclick = () => {
          disableAvailableSpaceAnimation();
          animateSpace(tile, true);
          // All this goes on a timeout so it is executed after the animation changes.
          // Otherwise the confirmation dialog prevents the CSS animation updates above
          // this comment.
          setTimeout(() => {
            tile.classList.remove('board-space--available');
            if (confirm()) {
              for (let j = 0; j < tiles.length; j++) {
                (tiles[j] as HTMLElement).onclick = null;
              }
              this.$data.spaceId = tile.getAttribute('data_space_id');
              tile.classList.add('board-space--selected');
              this.saveData();
            } else {
              animateSpace(tile, false);
              // without the timeout, this flashing animation gets out of sync with
              // the other tiles, like the blinker of the car in front of you.
              setTimeout(() => animateAvailableSpaces(tiles), 0);
            }
          }, 15); // 15ms gives the entire DOM a chance to catch up.
        };
      }
    }
  },
  render: function(createElement) {
    const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
    const children: Array<VNode> = [];
    if (this.showtitle) {
      children.push(createElement('div', {'class': 'wf-select-space'}, $t(playerInput.title)));
    }
    if (this.$data.warning) {
      children.push(createElement('div', {domProps: {className: 'nes-container is-rounded'}}, [createElement('span', {domProps: {className: 'nes-text is-warning'}}, this.$data.warning)]));
    }

    return createElement('div', children);
  },
});

