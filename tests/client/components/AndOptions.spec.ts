
import {mount} from '@vue/test-utils';
import {globalConfig} from '@tests/client/components/getLocalVue';

import {expect} from 'chai';
import AndOptions from '@/client/components/AndOptions.vue';
import {InputResponse} from '@/common/inputs/InputResponse';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {asComplete} from './utils/models';

describe('AndOptions', () => {
  it('saveData calls saveData on all child refs and captures responses', async () => {
    let savedData: InputResponse | undefined;
    const component = mount(AndOptions, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        components: {
          'PlayerInputFactory': PlayerInputFactory,
        },
      },
      props: {
        player: {
          id: 'foo',
        },
        players: [],
        playerView: asComplete<PlayerViewModel>({}),
        playerinput: {
          type: 'and',
          title: 'foo',
          options: [{
            type: 'option',
            title: 'select a',
            buttonLabel: 'select a',
          }, {
            type: 'option',
            title: 'select b',
            buttonLabel: 'select b',
          }],
          buttonLabel: 'save',
        },
        onsave: function(data: InputResponse) {
          savedData = data;
        },
        showsave: true,
        showtitle: true,
      },
    });
    const buttons = component.findAllComponents({name: 'AppButton'});
    await buttons[0].trigger('click');
    expect(savedData).to.not.be.undefined;
    expect(savedData!.type).to.eq('and');
    const andResponse = savedData as {type: string, responses: Array<InputResponse>};
    expect(andResponse.responses).to.have.length(2);
    expect(andResponse.responses[0].type).to.eq('option');
    expect(andResponse.responses[1].type).to.eq('option');
  });

  it('saves the options', async () => {
    let savedData: InputResponse | undefined;
    const component = mount(AndOptions, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        components: {
          'PlayerInputFactory': PlayerInputFactory,
        },
      },
      props: {
        player: {
          id: 'foo',
        },
        players: [],
        playerView: asComplete<PlayerViewModel>({}),
        playerinput: {
          type: 'and',
          title: 'foo',
          options: [{
            type: 'option',
            title: 'select a',
            buttonLabel: 'select a',
          }, {
            title: 'select b',
            buttonLabel: 'select b',
            type: 'option',
          }],
          buttonLabel: 'save',
        },
        onsave: function(data: InputResponse) {
          savedData = data;
        },
        showsave: true,
        showtitle: true,
      },
    });
    const buttons = component.findAllComponents({name: 'AppButton'});
    await buttons[0].trigger('click');
    expect(savedData).to.deep.eq({type: 'and', responses: [{type: 'option'}, {type: 'option'}]});
  });
});
