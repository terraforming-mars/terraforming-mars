import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HomeLink from '@/client/components/common/HomeLink.vue';

describe('HomeLink', () => {
  it('links to the start screen', () => {
    const wrapper = shallowMount(HomeLink, {
      ...globalConfig,
      slots: {
        default: 'Terraforming Mars',
      },
    });
    const a = wrapper.find('a');
    expect(a.attributes('href')).eq('.');
    expect(a.text()).eq('Terraforming Mars');
  });
});
