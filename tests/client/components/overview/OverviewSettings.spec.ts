import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import OverviewSettings from '@/client/components/overview/OverviewSettings.vue';

describe('OverviewSettings', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(OverviewSettings, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        mixins: [{
          methods: {
            getVisibilityState: () => false,
            setVisibilityState: () => {},
          },
          data() {
            return {componentsVisibility: {tags_concise: false}};
          },
        }],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
