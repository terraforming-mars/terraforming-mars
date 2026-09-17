import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import BoardSpaceCube from '@/client/components/board/BoardSpaceCube.vue';

describe('BoardSpaceCube', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(BoardSpaceCube, {
      ...globalConfig,
      props: {
        cube: 'martian-nature-wonders',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders both cubes with the same artwork', () => {
    for (const cube of ['martian-nature-wonders', 'rey-skywalker'] as const) {
      const wrapper = shallowMount(BoardSpaceCube, {...globalConfig, props: {cube}});

      expect(wrapper.find('[data-test="cube"]').classes())
        .to.contain('board-space-cube--martian-nature-wonders');
    }
  });
});
