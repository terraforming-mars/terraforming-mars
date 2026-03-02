import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PreludesFilter from '@/client/components/create/PreludesFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';

describe('PreludesFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {
        expansions: {...DEFAULT_EXPANSIONS, prelude: true},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
