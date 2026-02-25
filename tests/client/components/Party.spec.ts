import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import Party from '@/client/components/Party.vue';

describe('Party', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Party, {
      ...globalConfig,
      props: {
        party: {
          name: 'Mars First',
          partyLeader: undefined,
          delegates: [],
        },
        isDominant: false,
        isAvailable: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
