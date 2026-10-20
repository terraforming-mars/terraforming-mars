import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GameEnd from '@/client/components/GameEnd.vue';
import {fakeGameModel, fakeGameOptionsModel, fakePlayerViewModel} from './testHelpers';
import {BoardName} from '@/common/boards/BoardName';
import {getGlobalParameterMaximums} from '@/common/boards/GlobalParameterMaximums';
import {GlobalParameter} from '@/common/GlobalParameter';

describe('GameEnd', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameEnd, {
      ...globalConfig,
      props: {
        participant: fakePlayerViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  for (const boardName of [BoardName.THARSIS, BoardName.AMAZONIS_PLANITIA]) {
    it('globals chart peaks at exactly 100% when every parameter is maxed on ' + boardName, () => {
      const max = getGlobalParameterMaximums(boardName);
      const game = fakeGameModel({
        gameOptions: fakeGameOptionsModel({boardName, expansions: {venus: true}}),
        globalsPerGeneration: [
          {},
          {
            [GlobalParameter.TEMPERATURE]: max.temperature,
            [GlobalParameter.OXYGEN]: max.oxygen,
            [GlobalParameter.OCEANS]: max.oceans,
            [GlobalParameter.VENUS]: max.venus,
          },
        ],
      });
      const wrapper = shallowMount(GameEnd, {
        ...globalConfig,
        props: {
          participant: fakePlayerViewModel({game}),
        },
      });

      const datasets = (wrapper.vm as any).globalsDataset as ReadonlyArray<{label: string, data: ReadonlyArray<number>}>;

      expect(datasets.map((d) => d.label)).to.deep.eq(['Temperature', 'Oxygen', 'Oceans', 'Venus']);
      for (const dataset of datasets) {
        expect(dataset.data, dataset.label).to.deep.eq([0, 100]);
      }
    });
  }
});
