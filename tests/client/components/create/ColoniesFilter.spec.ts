import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ColoniesFilter from '@/client/components/create/ColoniesFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';

describe('ColoniesFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {
        expansions: {...DEFAULT_EXPANSIONS, colonies: true},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
