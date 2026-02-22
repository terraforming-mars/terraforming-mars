import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectProductionToLose from '@/client/components/SelectProductionToLose.vue';

describe('SelectProductionToLose', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectProductionToLose, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {
          title: 'Select production to lose',
          buttonLabel: 'Save',
          type: 'productionToLose',
          payProduction: {
            cost: 2,
            units: {
              megacredits: 0,
              steel: 0,
              titanium: 0,
              plants: 0,
              energy: 0,
              heat: 0,
            },
          },
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
