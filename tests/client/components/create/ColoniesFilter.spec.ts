import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import ColoniesFilter from '@/client/components/create/ColoniesFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';

describe('ColoniesFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      localVue: getLocalVue(),
      propsData: {
        expansions: {...DEFAULT_EXPANSIONS, colonies: true},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
