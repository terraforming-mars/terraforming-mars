import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import OverviewSettings from '@/client/components/overview/OverviewSettings.vue';

describe('OverviewSettings', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(OverviewSettings, {
      localVue: getLocalVue(),
      parentComponent: {
        data() {
          return {
            componentsVisibility: {tags_concise: false},
          };
        },
        methods: {
          getVisibilityState: () => false,
          setVisibilityState: () => {},
        },
      } as any,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
