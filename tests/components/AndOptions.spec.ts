
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import AndOptions from '../../src/components/AndOptions.vue';
import {PlayerInputTypes} from '../../src/PlayerInputTypes';

describe('AndOptions', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    return localVue;
  }
  it('saves the options', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(AndOptions, {
      localVue: getLocalVue(),
      propsData: {
        playerView: {
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
