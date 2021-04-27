import Vue, {VNode} from 'vue';
import {PlayerInputFactory} from './PlayerInputFactory';
import {$t} from '../directives/i18n';
import {Button} from '../components/common/Button';
import {PlayerModel} from '../models/PlayerModel';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PreferencesManager} from './PreferencesManager';

let unique: number = 0;

export const OrOptions = Vue.component('or-options', {
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
    return {
      selectedOption: 0,
    };
  },
  methods: {
    saveData: function() {
      const componentInstance = this.$data.childComponents[
        this.$data.selectedOption
      ].componentInstance;
      if (componentInstance !== undefined) {
        if ((componentInstance as any).saveData instanceof Function) {
          (componentInstance as any).saveData();
          return;
        }
      }
      throw new Error('Unexpected unable to save data');
    },
  },
  render: function(createElement) {
    unique++;
    this.$data.childComponents = [];
    const children: Array<VNode> = [];
    if (this.showtitle) {
      children.push(
        createElement('label', [
          createElement('div', $t(this.playerinput.title)),
        ]),
      );
    }
    const optionElements: Array<VNode> = [];
    if (this.playerinput.options === undefined) {
      throw new Error('no options provided for OrOptions');
    }
    this.playerinput.options.forEach((option: any, idx: number) => {
      const domProps: { [key: string]: any } = {
        name: 'selectOption' + unique,
        type: 'radio',
        value: String(idx),
      };
      const displayStyle: string =
                this.$data.selectedOption === idx ? 'block' : 'none';
      const subchildren: Array<VNode> = [];
      if (this.$data.selectedOption === idx) {
        domProps.checked = true;
      }
      subchildren.push(
        createElement('label', {'class': 'form-radio'}, [
          createElement('input', {
            domProps,
            on: {
              change: (event: any) => {
                this.selectedOption = Number(
                  event.target.value,
                );
              },
            },
          }),
          createElement('i', {'class': 'form-icon'}),
          createElement('span', $t(option.title)),
        ]),
      );
      this.$data.childComponents.push(
        new PlayerInputFactory().getPlayerInput(
          createElement,
          this.players,
          this.player,
          option,
          (out: Array<Array<string>>) => {
            const copy = [[String(idx)]];
            for (let i = 0; i < out.length; i++) {
              copy.push(out[i].slice());
            }
            this.onsave(copy);
          },
          false,
          false,
        ),
      );
      subchildren.push(
        createElement(
          'div',
          {style: {display: displayStyle, marginLeft: '30px'}},
          [
            this.$data.childComponents[
              this.$data.childComponents.length - 1
            ],
          ],
        ),
      );
      optionElements.push(subchildren[subchildren.length - 1]);

      // Show all option by default unless it is told to show only in learner mode
      let showOption = true;
      if (option.showOnlyInLearnerMode && !PreferencesManager.loadBoolean('learner_mode')) {
        showOption = false;
      }

      // Only push this orOption element if we are showing it
      if (showOption) {
        children.push(createElement('div', subchildren));

        if (this.showsave && this.$data.selectedOption === idx) {
          children.push(
            createElement(
              'div',
              {
                'style': {'margin': '5px 30px 10px'},
                'class': 'wf-action',
              },
              [
                createElement(Button, {
                  props: {
                    title: $t(option.buttonLabel),
                    type: 'submit',
                    size: 'normal',
                    onClick: () => {
                      this.saveData();
                    },
                  },
                }),
              ],
            ),
          );
        }
      }
    });
    return createElement('div', {'class': 'wf-options'}, children);
  },
});
