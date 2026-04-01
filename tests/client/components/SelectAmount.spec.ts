import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectAmount from '@/client/components/SelectAmount.vue';

describe('SelectAmount', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectAmount, {
      ...globalConfig,
      props: {
        playerinput: {
          title: 'Select amount',
          buttonLabel: 'Save',
          type: 'amount',
          min: 0,
          max: 5,
          maxByDefault: false,
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
