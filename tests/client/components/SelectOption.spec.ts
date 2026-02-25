import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectOption from '@/client/components/SelectOption.vue';

describe('SelectOption', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectOption, {
      ...globalConfig,
      props: {
        playerinput: {
          title: 'Do something',
          buttonLabel: 'OK',
          type: 'option',
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
