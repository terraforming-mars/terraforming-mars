import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectResource from '@/client/components/SelectResource.vue';
import {fakePlayerViewModel} from './testHelpers';

describe('SelectResource', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectResource, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select a resource type',
          buttonLabel: 'Save',
          type: 'resource',
          include: ['steel', 'titanium'],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
