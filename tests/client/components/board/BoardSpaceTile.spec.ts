import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import BoardSpaceTile from '@/client/components/board/BoardSpaceTile.vue';
import {SpaceType} from '@/common/boards/SpaceType';

describe('BoardSpaceTile', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(BoardSpaceTile, {
      ...globalConfig,
      props: {
        space: {
          id: '01',
          x: 0,
          y: 0,
          bonus: [],
          color: undefined,
          tileType: undefined,
          spaceType: SpaceType.LAND,
          highlight: undefined,
        },
        aresExtension: false,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
