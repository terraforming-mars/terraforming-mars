import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import BoardSelector from '@/client/components/create/BoardSelector.vue';
import BoardPopup from '@/client/components/create/BoardPopup.vue';
import {BoardName} from '@/common/boards/BoardName';
import {BoardNameType} from '@/common/game/NewGameConfig';

function mountSelector(board: BoardNameType = BoardName.HELLAS, shuffleMap: boolean = false) {
  return mount(BoardSelector, {
    ...globalConfig,
    props: {board, shuffleMap},
  });
}

async function openPopup(wrapper: ReturnType<typeof mountSelector>) {
  await wrapper.find('#boardSelector-checkbox').setValue(true);
}

describe('BoardSelector', () => {
  it('mounts without errors', () => {
    const wrapper = mountSelector();
    expect(wrapper.exists()).to.be.true;
  });

  it('shows the current board on the button', () => {
    const wrapper = mountSelector();
    const text = wrapper.find('label[for="boardSelector-checkbox"]').text();
    expect(text).to.include('Board');
    expect(text).to.include(BoardName.HELLAS);
  });

  for (const run of [
    {shuffleMap: false},
    {shuffleMap: true},
  ] as const) {
    it(`shows a die only when board tiles are randomized ${JSON.stringify(run)}`, () => {
      const wrapper = mountSelector(BoardName.HELLAS, run.shuffleMap);
      expect(wrapper.find('label[for="boardSelector-checkbox"] .create-game-board-shuffled').exists()).eq(run.shuffleMap);
    });
  }

  it('opens the popup when the button is pressed', async () => {
    const wrapper = mountSelector();
    expect(wrapper.findComponent(BoardPopup).exists()).is.false;
    await openPopup(wrapper);
    const popup = wrapper.findComponent(BoardPopup);
    expect(popup.exists()).is.true;
    expect(popup.props('board')).eq(BoardName.HELLAS);
  });

  it('emits the board chosen in the popup and hides the popup', async () => {
    const wrapper = mountSelector();
    await openPopup(wrapper);
    await wrapper.find(`input[type="radio"][value="${BoardName.ELYSIUM}"]`).setValue();
    expect(wrapper.emitted('update:board')).to.deep.eq([[BoardName.ELYSIUM]]);
    expect(wrapper.findComponent(BoardPopup).exists()).is.false;
  });

  it('passes the randomize board tiles choice through the popup', async () => {
    const wrapper = mountSelector();
    await openPopup(wrapper);
    const popup = wrapper.findComponent(BoardPopup);
    expect(popup.props('shuffleMap')).is.false;
    await wrapper.find('#shuffleMap-checkbox').setValue(true);
    expect(wrapper.emitted('update:shuffleMap')).to.deep.eq([[true]]);
    expect(wrapper.findComponent(BoardPopup).exists()).is.true;
  });

  it('hides the popup when it closes without a selection', async () => {
    const wrapper = mountSelector();
    await openPopup(wrapper);
    await wrapper.findComponent(BoardPopup).vm.$emit('close');
    expect(wrapper.findComponent(BoardPopup).exists()).is.false;
    expect(wrapper.emitted('update:board')).is.undefined;
  });
});
