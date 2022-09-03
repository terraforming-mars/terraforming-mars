
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';

import {expect} from 'chai';
import AndOptions from '@/client/components/AndOptions.vue';
import {PlayerInputType} from '@/common/input/PlayerInputType';
import {InputResponse} from '@/common/inputs/InputResponse';

describe('AndOptions', function() {
  it('saves the options', async function() {
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
            inputType: PlayerInputType.SELECT_OPTION,
            title: 'select a',
          }, {
            title: 'select b',
            inputType: PlayerInputType.SELECT_OPTION,
          }],
        },
        onsave: function(data: InputResponse) {
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
