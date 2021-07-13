
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import PlayerInputFactory from '../../src/components/PlayerInputFactory.vue';
import {PlayerInputTypes} from '../../src/PlayerInputTypes';

describe('PlayerInputFactory', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    return localVue;
  }
  it('saves data', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(PlayerInputFactory, {
      localVue: getLocalVue(),
      propsData: {
        players: [],
        player: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          inputType: PlayerInputTypes.SELECT_OPTION
        },
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
        showsave: true,
        showtitle: true
      },
    });
    expect(component).not.is.undefined;
    (component as any).vm.saveData();
    expect(savedData).not.is.undefined;
  });
});
