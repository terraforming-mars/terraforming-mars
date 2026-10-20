import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import BoardPopup from '@/client/components/create/BoardPopup.vue';
import {BoardName} from '@/common/boards/BoardName';
import {BoardNameType} from '@/common/game/NewGameConfig';

function mountPopup(board: BoardNameType = BoardName.THARSIS, shuffleMap: boolean = false) {
  return mount(BoardPopup, {
    ...globalConfig,
    props: {board, shuffleMap},
  });
}

function radio(wrapper: ReturnType<typeof mountPopup>, board: BoardNameType) {
  return wrapper.find<HTMLInputElement>(`input[type="radio"][value="${board}"]`);
}

describe('BoardPopup', () => {
  it('mounts without errors', () => {
    const wrapper = mountPopup();
    expect(wrapper.exists()).to.be.true;
  });

  it('checks the current board', () => {
    const wrapper = mountPopup(BoardName.HELLAS);
    expect(radio(wrapper, BoardName.HELLAS).element.checked).is.true;
    expect(radio(wrapper, BoardName.THARSIS).element.checked).is.false;
  });

  it('emits the selected board and closes', async () => {
    const wrapper = mountPopup();
    await radio(wrapper, BoardName.ELYSIUM).setValue();
    expect(wrapper.emitted('update:board')).to.deep.eq([[BoardName.ELYSIUM]]);
    expect(wrapper.emitted('close')).to.have.length(1);
  });

  it('closes without a selection', async () => {
    const wrapper = mountPopup();
    await wrapper.find('.close-button').trigger('click');
    expect(wrapper.emitted('close')).to.have.length(1);
    expect(wrapper.emitted('update:board')).is.undefined;
  });

  for (const run of [
    {shuffleMap: false},
    {shuffleMap: true},
  ] as const) {
    it(`shows whether board tiles are randomized ${JSON.stringify(run)}`, () => {
      const wrapper = mountPopup(BoardName.THARSIS, run.shuffleMap);
      expect(wrapper.find<HTMLInputElement>('#shuffleMap-checkbox').element.checked).eq(run.shuffleMap);
    });
  }

  it('emits the randomize board tiles choice without closing', async () => {
    const wrapper = mountPopup();
    await wrapper.find('#shuffleMap-checkbox').setValue(true);
    expect(wrapper.emitted('update:shuffleMap')).to.deep.eq([[true]]);
    expect(wrapper.emitted('close')).is.undefined;
  });
});
