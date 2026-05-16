import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import DeltaProjectBoard from '@/client/components/delta/DeltaProjectBoard.vue';
import {DeltaBoardStep} from '@/client/components/delta/DeltaBoardStep';
import {fakePublicPlayerModel} from '../testHelpers';
import {FakeLocalStorage} from '../FakeLocalStorage';

function fakeEmptySlot(dynamicSlots: boolean): DeltaBoardStep {
  return {
    dynamicSlots: dynamicSlots,
    rewardIcons: [],
  };
}
describe('DeltaProjectBoard', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts with no players', () => {
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: []},
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders the start cell plus 11 step cells', () => {
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: []},
    });
    // Tag row: 1 start cell + 11 step cells, all sharing the step class.
    expect(wrapper.findAll('td.delta-project-board__step')).to.have.length(12);
    expect(wrapper.findAll('td.delta-project-board__step--start')).to.have.length(1);
  });

  it('places a player cube at their track position', () => {
    const player = fakePublicPlayerModel({
      color: 'blue',
      deltaProject: {position: 3, jovianBonus: false},
    });
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: [player]},
    });
    const vm = wrapper.vm;
    expect(vm.playersAtPosition(3)).to.deep.eq(['blue']);
    expect(vm.playersAtPosition(0)).to.deep.eq([]);
  });

  it('places multiple players at the same position', () => {
    const blue = fakePublicPlayerModel({
      color: 'blue',
      deltaProject: {position: 5, jovianBonus: false},
    });
    const red = fakePublicPlayerModel({
      color: 'red',
      deltaProject: {position: 5, jovianBonus: false},
    });
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: [blue, red]},
    });
    expect(wrapper.vm.playersAtPosition(5)).to.deep.eq(['blue', 'red']);
  });

  it('treats missing deltaProject data as not on the track', () => {
    const player = fakePublicPlayerModel({color: 'blue'});
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: [player]},
    });
    for (let pos = 0; pos <= 11; pos++) {
      expect(wrapper.vm.playersAtPosition(pos)).to.deep.eq([]);
    }
  });

  it('start position shows one empty slot per player when none have advanced', () => {
    const blue = fakePublicPlayerModel({
      color: 'blue',
      deltaProject: {position: 0, jovianBonus: false},
    });
    const red = fakePublicPlayerModel({
      color: 'red',
      deltaProject: {position: 0, jovianBonus: false},
    });
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: [blue, red]},
    });
    // Both players occupy start, so no empty slots at start.
    expect(wrapper.vm.emptySlotsStart()).to.eq(0);
  });

  it('emptySlots scales with player count for tag positions', () => {
    const blue = fakePublicPlayerModel({
      color: 'blue',
      deltaProject: {position: 1, jovianBonus: false},
    });
    const red = fakePublicPlayerModel({color: 'red'});
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: [blue, red]},
    });
    // 2 players, 1 occupies position 1 → 1 empty slot remains.
    expect(wrapper.vm.emptySlots(1, fakeEmptySlot(true))).to.eq(1);
    // No one at position 2 → 2 empty slots.
    expect(wrapper.vm.emptySlots(2, fakeEmptySlot(true))).to.eq(2);
  });

  it('VP positions use a single slot regardless of player count', () => {
    const blue = fakePublicPlayerModel({color: 'blue'});
    const red = fakePublicPlayerModel({color: 'red'});
    const green = fakePublicPlayerModel({color: 'green'});
    const wrapper = shallowMount(DeltaProjectBoard, {
      ...globalConfig,
      props: {players: [blue, red, green]},
    });
    expect(wrapper.vm.emptySlots(10, fakeEmptySlot(false))).to.eq(1);
    expect(wrapper.vm.emptySlots(11, fakeEmptySlot(false))).to.eq(1);
  });
});
