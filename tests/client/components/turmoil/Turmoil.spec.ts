import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import Turmoil from '@/client/components/turmoil/Turmoil.vue';

describe('Turmoil', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Turmoil, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      propsData: {
        turmoil: {
          dominant: undefined,
          ruling: undefined,
          chairman: undefined,
          parties: [],
          lobby: [],
          reserve: [],
          distant: undefined,
          coming: undefined,
          current: undefined,
          politicalAgendas: undefined,
          policyActionUsers: [],
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
