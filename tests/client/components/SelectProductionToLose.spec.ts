import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectProductionToLose from '@/client/components/SelectProductionToLose.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';

describe('SelectProductionToLose', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectProductionToLose, {
      ...globalConfig,
      props: {
        playerView: {} as PlayerViewModel,
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
