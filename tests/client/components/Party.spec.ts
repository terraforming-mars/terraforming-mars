import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import Party from '@/client/components/Party.vue';
import {PartyName} from '@/common/turmoil/PartyName';

describe('Party', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Party, {
      ...globalConfig,
      props: {
        party: {
          name: PartyName.MARS,
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
