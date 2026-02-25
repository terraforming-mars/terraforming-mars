import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectResources from '@/client/components/SelectResources.vue';
import {fakePlayerViewModel} from './testHelpers';

describe('SelectResources', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectResources, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select resources',
          buttonLabel: 'Save',
          type: 'resources',
          count: 2,
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
