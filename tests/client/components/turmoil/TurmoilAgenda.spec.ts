import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';

describe('TurmoilAgenda', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(TurmoilAgenda, {
      ...globalConfig,
      props: {
        id: 'mfp01',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('mounts without errors with a party badge', () => {
    const wrapper = shallowMount(TurmoilAgenda, {
      ...globalConfig,
      props: {
        id: 'mp01',
        showPartyBadge: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
