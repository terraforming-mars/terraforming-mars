import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GlobalParameterValue from '@/client/components/GlobalParameterValue.vue';
import {GlobalParameter} from '@/common/GlobalParameter';
import {BoardName} from '@/common/boards/BoardName';

describe('GlobalParameterValue', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GlobalParameterValue, {
      ...globalConfig,
      props: {
        param: GlobalParameter.TEMPERATURE,
        value: -30,
        boardName: BoardName.THARSIS,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  for (const run of [
    {boardName: BoardName.THARSIS, value: 30, isMax: true},
    {boardName: BoardName.AMAZONIS_PLANITIA, value: 30, isMax: false},
    {boardName: BoardName.AMAZONIS_PLANITIA, value: 33, isMax: true},
  ]) {
    it(`Venus at ${run.value} on ${run.boardName} is ${run.isMax ? '' : 'not '}at its maximum`, () => {
      const wrapper = shallowMount(GlobalParameterValue, {
        ...globalConfig,
        props: {
          param: GlobalParameter.VENUS,
          value: run.value,
          boardName: run.boardName,
        },
      });
      expect((wrapper.vm as any).isMax).eq(run.isMax);
    });
  }
});
