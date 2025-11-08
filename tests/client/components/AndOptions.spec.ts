
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';

import {expect} from 'chai';
import AndOptions from '@/client/components/AndOptions.vue';
import {InputResponse} from '@/common/inputs/InputResponse';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';

describe('AndOptions', () => {
  it('saves the options', async () => {
    let savedData: InputResponse | undefined;
    const component = mount(AndOptions, {
      localVue: getLocalVue(),
      propsData: {
        player: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          options: [{
            type: 'option',
            title: 'select a',
          }, {
            title: 'select b',
            type: 'option',
          }],
        },
        onsave: function(data: InputResponse) {
          savedData = data;
        },
        showsave: true,
        showtitle: true,
      },
      components: {
        'player-input-factory': PlayerInputFactory,
      },
    });
    const buttons = component.findAllComponents({name: 'AppButton'});
    await buttons.at(0).findAllComponents({
      name: 'AppButton',
    }).at(0).trigger('click');
    expect(savedData).to.deep.eq({type: 'and', responses: [{type: 'option'}, {type: 'option'}]});
  });
});
