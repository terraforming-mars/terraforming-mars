import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CorporationsFilter from '@/client/components/create/CorporationsFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';

describe('CorporationsFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CorporationsFilter, {
      localVue: getLocalVue(),
      propsData: {
        expansions: {...DEFAULT_EXPANSIONS},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
