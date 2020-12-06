import Vue, {VNode} from 'vue';
import {PlayerInputFactory} from './PlayerInputFactory';
import {PlayerModel} from '../models/PlayerModel';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {Button} from '../components/common/Button';
import {$t} from '../directives/i18n';

export const AndOptions = Vue.component('and-options', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    players: {
      type: Array as () => Array<PlayerModel>,
    },
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
    return {};
  },
  methods: {
    saveData: function() {
      for (let i = 0; i < this.$data.childComponents.length; i++) {
        const componentInstance = this.$data.childComponents[i]
          .componentInstance;
        if (componentInstance !== undefined) {
          if (
            (componentInstance as any).saveData instanceof Function
          ) {
            (componentInstance as any).saveData();
          }
        }
      }
      const res: Array<Array<string>> = [];
      if (this.playerinput.options !== undefined) {
        for (let i = 0; i < this.playerinput.options.length; i++) {
          res.push(this.$data.responded['' + i]);
        }
      }
      this.onsave(res);
    },
  },
  render: function(createElement) {
    const playerInput = this.playerinput;
    const children: Array<VNode> = [];
    this.$data.childComponents = [];
    this.$data.responded = [];
    if (this.showtitle) {
      children.push(
        createElement('div', {'class': 'wf-title'}, $t(playerInput.title)),
      );
    }
    if (playerInput.options !== undefined) {
      const options = playerInput.options;
      options.forEach((option, idx: number) => {
        if (this.$data.responded[idx] === undefined) {
          children.push(
            new PlayerInputFactory().getPlayerInput(
              createElement,
              this.players,
              this.player,
              option,
              (out: Array<Array<string>>) => {
                this.$data.responded[idx] = out[0];
              },
              false,
              true,
            ),
          );
          this.$data.childComponents.push(
            children[children.length - 1],
          );
        }
      });
    }
    if (this.showsave) {
      const saveBtn = createElement(Button, {
        props: {
          title: playerInput.buttonLabel,
          type: 'submit',
          size: 'normal',
          onClick: () => {
            this.saveData();
          },
        },
      });
      children.push(
        createElement('div', {'class': 'wf-action'}, [saveBtn]),
      );
    }
    return createElement('div', {'class': 'wf-options'}, children);
  },
});
