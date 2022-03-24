
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';

import {expect} from 'chai';
import AndOptions from '@/client/components/AndOptions.vue';
import {PlayerInputTypes} from '@/common/input/PlayerInputTypes';

describe('AndOptions', function() {
  it('saves the options', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(AndOptions, {
      localVue: getLocalVue(),
      propsData: {
        player: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          options: [{
            inputType: PlayerInputTypes.SELECT_OPTION,
            title: 'select a',
          }, {
            title: 'select b',
            inputType: PlayerInputTypes.SELECT_OPTION,
          }],
        },
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
        showsave: true,
        showtitle: true,
      },
    });
    const buttons = component.findAllComponents({name: 'Button'});
    await buttons.at(0).findAllComponents({
      name: 'button',
    }).at(0).trigger('click');
    expect(savedData).to.deep.eq([['1'], ['1']]);
  });
});
