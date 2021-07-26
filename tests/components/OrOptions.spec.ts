
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import OrOptions from '../../src/components/OrOptions.vue';
import {PlayerInputTypes} from '../../src/PlayerInputTypes';

describe('OrOptions', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    return localVue;
  }
  it('saves the options ignoring hidden', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(OrOptions, {
      localVue: getLocalVue(),
      propsData: {
        player: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          options: [{
            inputType: PlayerInputTypes.SELECT_OPTION,
            title: 'hide this',
            showOnlyInLearnerMode: true,
          }, {
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
    expect(savedData).to.deep.eq([['1'],['1']]);
  });
  it('moves and selects 2nd option', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(OrOptions, {
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
    const inputs = component.findAll('input');
    await inputs.at(1).setChecked();
    const buttons = component.findAllComponents({name: 'Button'});
    await buttons.at(0).findAllComponents({
      name: 'button',
    }).at(0).trigger('click');
    expect(savedData).to.deep.eq([['1'],['1']]);
  });
});
