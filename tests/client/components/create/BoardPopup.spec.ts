import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import BoardPopup from '@/client/components/create/BoardPopup.vue';
import {BoardName} from '@/common/boards/BoardName';

function mountPopup(boards = [BoardName.THARSIS], shuffleMap: boolean = false) {
  return mount(BoardPopup, {
    ...globalConfig,
    props: {boards, shuffleMap},
  });
}

function checkbox(wrapper: ReturnType<typeof mountPopup>, board: BoardName) {
  return wrapper.find<HTMLInputElement>(`input[type="checkbox"][value="${board}"]`);
}

describe('BoardPopup', () => {
  it('mounts without errors', () => {
    const wrapper = mountPopup();
    expect(wrapper.exists()).to.be.true;
  });

  it('checks the current board', () => {
    const wrapper = mountPopup([BoardName.HELLAS]);
    expect(checkbox(wrapper, BoardName.HELLAS).element.checked).is.true;
    expect(checkbox(wrapper, BoardName.THARSIS).element.checked).is.false;
  });

  it('adds the selected board and stays open', async () => {
    const wrapper = mountPopup();
    await checkbox(wrapper, BoardName.ELYSIUM).setValue();
    expect(wrapper.emitted('update:boards')).to.deep.eq([[[BoardName.THARSIS, BoardName.ELYSIUM]]]);
    expect(wrapper.emitted('close')).is.undefined;
  });

  it('closes without a selection', async () => {
    const wrapper = mountPopup();
    await wrapper.find('.close-button').trigger('click');
    expect(wrapper.emitted('close')).to.have.length(1);
    expect(wrapper.emitted('update:boards')).is.undefined;
  });

  for (const run of [
    {shuffleMap: false},
    {shuffleMap: true},
  ] as const) {
    it(`shows whether board tiles are randomized ${JSON.stringify(run)}`, () => {
      const wrapper = mountPopup([BoardName.THARSIS], run.shuffleMap);
      expect(wrapper.find<HTMLInputElement>('#shuffleMap-checkbox').element.checked).eq(run.shuffleMap);
    });
  }

  it('emits the randomize board tiles choice without closing', async () => {
    const wrapper = mountPopup();
    await wrapper.find('#shuffleMap-checkbox').setValue(true);
    expect(wrapper.emitted('update:shuffleMap')).to.deep.eq([[true]]);
    expect(wrapper.emitted('close')).is.undefined;
  });

  it('removes a board that is already selected', async () => {
    const wrapper = mountPopup([BoardName.THARSIS, BoardName.HELLAS]);
    await checkbox(wrapper, BoardName.THARSIS).setValue(false);
    expect(wrapper.emitted('update:boards')).to.deep.eq([[[BoardName.HELLAS]]]);
  });

  for (const run of [
    {button: 0, expected: [
      BoardName.THARSIS,
      BoardName.HELLAS,
      BoardName.ELYSIUM,
      BoardName.UTOPIA_PLANITIA,
      BoardName.VASTITAS_BOREALIS_NOVA,
      BoardName.TERRA_CIMMERIA_NOVA,
      BoardName.AMAZONIS_PLANITIA,
    ]},
    {button: 1, expected: [
      BoardName.THARSIS,
      BoardName.HELLAS,
      BoardName.ELYSIUM,
      BoardName.UTOPIA_PLANITIA,
      BoardName.VASTITAS_BOREALIS_NOVA,
      BoardName.TERRA_CIMMERIA_NOVA,
      BoardName.AMAZONIS_PLANITIA,
      BoardName.ARABIA_TERRA,
      BoardName.AMAZONIS,
      BoardName.TERRA_CIMMERIA,
      BoardName.VASTITAS_BOREALIS,
      BoardName.HOLLANDIA,
    ]},
  ] as const) {
    it(`random button selects its boards ${JSON.stringify(run)}`, async () => {
      const wrapper = mountPopup();
      await wrapper.findAll('.create-game-board-random')[run.button].trigger('click');
      const expected = run.expected;
      expect(wrapper.emitted('update:boards')).to.deep.eq([[expected]]);
      for (const board of expected) {
        expect(checkbox(wrapper, board).element.checked).is.true;
      }
      expect(wrapper.emitted('close')).is.undefined;
    });
  }

  it('clear resets the selection to Tharsis', async () => {
    const wrapper = mountPopup([BoardName.HELLAS, BoardName.ELYSIUM]);
    await wrapper.find('.create-game-board-clear').trigger('click');
    expect(wrapper.emitted('update:boards')).to.deep.eq([[[BoardName.THARSIS]]]);
    expect(checkbox(wrapper, BoardName.THARSIS).element.checked).is.true;
    expect(checkbox(wrapper, BoardName.HELLAS).element.checked).is.false;
    expect(checkbox(wrapper, BoardName.ELYSIUM).element.checked).is.false;
    expect(wrapper.emitted('close')).is.undefined;
  });
});
