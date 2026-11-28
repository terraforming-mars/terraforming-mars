// Common code shared between PlayerHome and SpectatorHome:
// hotkey navigation, the keyboard shortcuts dialog, and tile view cycling.
import {defineComponent} from 'vue';
import {SpaceId} from '@/common/Types';
import {KeyboardNavigation} from '@/client/components/KeyboardNavigation';
import {nextTileView, TileView} from '@/client/components/board/TileView';

type DataModel = {
  tileView: TileView;
  keyboardShortcutOpened: boolean;
  hotkeyTargets: Array<Element>;
}

export const HomeMixin = defineComponent({
  name: 'HomeMixin',
  data(): DataModel {
    return {
      tileView: 'show',
      keyboardShortcutOpened: false,
      hotkeyTargets: [],
    };
  },
  methods: {
    navigatePage(event: KeyboardEvent) {
      // Most '?' are shifted, so process this before the action that exits early with modifiers
      if (event.key === '?') {
        this.keyboardShortcutOpened = !this.keyboardShortcutOpened;
        return;
      }
      if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      const ids: Partial<Record<string, string>> = {
        [KeyboardNavigation.GAMEBOARD]: 'shortkey-board',
        [KeyboardNavigation.PLAYERSOVERVIEW]: 'shortkey-playersoverview',
        [KeyboardNavigation.HAND]: 'shortkey-hand',
        [KeyboardNavigation.COLONIES]: 'shortkey-colonies',
      };
      const inputSource = event.target as Node;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        const id = ids[event.code];
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            event.preventDefault();
            el.scrollIntoView({block: 'center', inline: 'center', behavior: 'smooth'});
          }
        } else if (event.code.startsWith('Digit')) {
          const ASCII_ONE = '1'.charCodeAt(0);
          const index = event.code.charCodeAt(5) - ASCII_ONE;
          if (index >= 0 && index < this.hotkeyTargets.length) {
            const el = this.hotkeyTargets[index];
            if (el) {
              el.scrollIntoView({block: 'start', inline: 'center', behavior: 'smooth'});
            }
          }
        }
      }
    },
    cycleTileView(): void {
      this.tileView = nextTileView(this.tileView);
    },
    // Consumers must set `ref="gameBoardView"` on their <GameBoardView> for this to have any effect.
    onSpaceClicked(spaceId: SpaceId): void {
      const gameBoardView = this.$refs.gameBoardView as {highlightSpace: (spaceId: SpaceId) => void} | undefined;
      gameBoardView?.highlightSpace(spaceId);
    },
  },
  mounted() {
    window.addEventListener('keydown', this.navigatePage);
    const targets = this.$el.getElementsByClassName('hotkey-target');
    for (let i = 0; i < targets.length; i++) {
      const element = targets.item(i);
      if (element) {
        this.hotkeyTargets.push(element);
      }
    }
  },
  unmounted() {
    window.removeEventListener('keydown', this.navigatePage);
  },
});
