import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import {fakeViewModel} from '../testHelpers';

describe('PlayersOverview', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayersOverview, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      propsData: {
        playerView: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
